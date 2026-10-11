import Papa from 'papaparse';
import { z } from 'zod';
export const fields = ['gpa','annualFamilyIncome','residencyRegion'] as const;
export type Field = typeof fields[number];
export const labels: Record<Field,string> = {gpa:'GPA',annualFamilyIncome:'Annual family income',residencyRegion:'Residency'};
export const dates: Record<Field,string> = {gpa:'gpaVerifiedAt',annualFamilyIncome:'incomeVerifiedAt',residencyRegion:'residencyVerifiedAt'};
export type Applicant = {applicantId:string;fullName:string;gpa:string;annualFamilyIncome:string;residencyRegion:string;submittedAt:string;gpaVerifiedAt:string;incomeVerifiedAt:string;residencyVerifiedAt:string;notes:string};
export type Policy = {minGpa:number;maxIncome:number;region:string};
export type Freshness = Record<Field,number>;
export type Outcome = 'ELIGIBLE'|'INELIGIBLE'|'UNDETERMINED';
export type Quality = 'Clean'|'Missing'|'Stale'|'Invalid'|'Unverified';
export type Rule = {field:Field;state:'PASS'|'FAIL'|'UNKNOWN';quality:Quality;age:number|null;reason:string};
export type Evaluation = {outcome:Outcome;rules:Rule[]};
export type Comparison = {applicant:Applicant;old:Evaluation;next:Evaluation;transition:string;priority:'High'|'Medium'|'Low'|'None';quality:Quality};
export type Quarantine = {row:number;raw:Record<string,unknown>;errors:string[]};
export type ImportResult = {records:Applicant[];quarantine:Quarantine[];errors:string[];total:number};
export const defaultFreshness:Freshness = {gpa:365,annualFamilyIncome:180,residencyRegion:365};
export const defaultPolicies: [Policy,Policy] = [{minGpa:7,maxIncome:300000,region:'Karnataka'},{minGpa:7.5,maxIncome:250000,region:'Karnataka'}];
export const policySchema = z.object({minGpa:z.number().finite().min(0).max(10),maxIncome:z.number().finite().nonnegative(),region:z.string().trim().min(1).max(100)});
const identitySchema = z.object({applicantId:z.string().trim().min(1).max(100),fullName:z.string().trim().min(1).max(200)});
export const columns = ['applicantId','fullName','gpa','annualFamilyIncome','residencyRegion','submittedAt','gpaVerifiedAt','incomeVerifiedAt','residencyVerifiedAt','notes'] as const;
export function parseDate(value:string):number|null {
 if(!value || !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z)?$/.test(value))return null;
 const time=Date.parse(value); if(!Number.isFinite(time)||new Date(time).toISOString().slice(0,10)!==value.slice(0,10))return null;return time;
}
export function fieldQuality(a:Applicant,field:Field,fresh:Freshness,now:number):{quality:Quality;age:number|null;reason:string} {
 const value=a[field].trim();
 if(!value)return {quality:'Missing',age:null,reason:`${labels[field]} is missing.`};
 if(field!=='residencyRegion' && (!/^\d+(?:\.\d+)?$/.test(value)||!Number.isFinite(Number(value))||Number(value)<0||(field==='gpa'&&Number(value)>10)))return {quality:'Invalid',age:null,reason:`${labels[field]} must be ${field==='gpa'?'a number from 0 to 10':'a nonnegative number'}.`};
 const raw=a[dates[field] as keyof Applicant];
 if(!raw)return {quality:'Unverified',age:null,reason:`${labels[field]} has no verification date.`};
 const timestamp=parseDate(raw);
 if(timestamp===null||timestamp>now)return {quality:'Invalid',age:null,reason:`${labels[field]} has an invalid or future verification date.`};
 const age=(now-timestamp)/86400000;
 if(age>fresh[field])return {quality:'Stale',age,reason:`${labels[field]} was verified ${Math.floor(age)} days ago; limit is ${fresh[field]} days.`};
 return {quality:'Clean',age,reason:'Current, valid evidence.'};
}
export function evaluate(a:Applicant,p:Policy,fresh=defaultFreshness,now=Date.now()):Evaluation {
 const rules:Rule[]=fields.map(field=>{
  const q=fieldQuality(a,field,fresh,now);
  const requirement=field==='gpa'?`GPA ≥ ${p.minGpa}`:field==='annualFamilyIncome'?`Income ≤ ₹${p.maxIncome.toLocaleString('en-IN')}`:`Residency = ${p.region}`;
  if(q.quality!=='Clean')return {field,...q,state:'UNKNOWN',reason:`${q.reason} Cannot verify ${requirement}.`};
  const passed=field==='gpa'?Number(a.gpa)>=p.minGpa:field==='annualFamilyIncome'?Number(a.annualFamilyIncome)<=p.maxIncome:a.residencyRegion.trim().toLowerCase()===p.region.trim().toLowerCase();
  return {field,...q,state:passed?'PASS':'FAIL',reason:`${requirement}: verified value ${a[field]} ${passed?'satisfies':'fails'} this rule.`};
 });
 return {rules,outcome:rules.some(r=>r.state==='FAIL')?'INELIGIBLE':rules.some(r=>r.state==='UNKNOWN')?'UNDETERMINED':'ELIGIBLE'};
}
export function compare(a:Applicant,policies:[Policy,Policy],fresh=defaultFreshness,now=Date.now()):Comparison {
 const old=evaluate(a,policies[0],fresh,now), next=evaluate(a,policies[1],fresh,now);
 const uncertain=[old,next].filter(e=>e.outcome==='UNDETERMINED').length;
 const transition=uncertain?'Uncertain':old.outcome===next.outcome?(old.outcome==='ELIGIBLE'?'Eligible in both':'Ineligible in both'):next.outcome==='ELIGIBLE'?'Gained eligibility':'Lost eligibility';
 const quality=(['Invalid','Missing','Stale','Unverified'] as Quality[]).find(q=>old.rules.some(r=>r.quality===q))||'Clean';
 return {applicant:a,old,next,transition,quality,priority:uncertain===2?'High':uncertain===1?'Medium':quality!=='Clean'?'Low':'None'};
}
export function metrics(results:Comparison[]) {
 return {total:results.length,eligible:results.filter(r=>r.next.outcome==='ELIGIBLE').length,ineligible:results.filter(r=>r.next.outcome==='INELIGIBLE').length,uncertain:results.filter(r=>r.next.outcome==='UNDETERMINED').length,changed:results.filter(r=>['Gained eligibility','Lost eligibility'].includes(r.transition)).length,stale:results.filter(r=>r.old.rules.some(f=>f.quality==='Stale')).length};
}
export function ingest(rows:Record<string,unknown>[],parseErrors:{row?:number;message:string}[]=[]):ImportResult {
 const counts=new Map<string,number>();rows.forEach(r=>{const id=String(r.applicantId??'').trim();if(id)counts.set(id,(counts.get(id)||0)+1)});
 const result:ImportResult={records:[],quarantine:[],errors:[],total:rows.length};
 rows.forEach((raw,i)=>{
  const a=Object.fromEntries(columns.map(k=>[k,String(raw[k]??'').trim()])) as Applicant;
  const identity=identitySchema.safeParse(a);
  const errors=identity.success?[]:identity.error.issues.map(e=>`${e.path.join('.')}: ${e.message}`);
  if((counts.get(a.applicantId)||0)>1)errors.push('Duplicate applicant ID. All occurrences quarantined until identity is resolved.');
  if(!a.submittedAt||parseDate(a.submittedAt)===null||parseDate(a.submittedAt)!>Date.now())errors.push('submittedAt must be a valid, nonfuture ISO date.');
  if('__parsed_extra' in raw)errors.push('Row contains more cells than headers.');
  errors.push(...parseErrors.filter(e=>e.row===i).map(e=>e.message));
  if(errors.length)result.quarantine.push({row:i+2,raw,errors});else result.records.push(a);
 });return result;
}
export function parseCSV(text:string):ImportResult {
 const parsed=Papa.parse<Record<string,string>>(text,{header:true,skipEmptyLines:'greedy',transformHeader:h=>h.replace(/^\uFEFF/,'').trim()});
 const headers=parsed.meta.fields||[];const missing=columns.filter(k=>k!=='notes'&&!headers.includes(k));
 if(missing.length)return {records:[],quarantine:[],total:parsed.data.length,errors:[`Missing required headers: ${missing.join(', ')}`]};
 if(new Set(headers).size!==headers.length || Object.keys((parsed.meta as unknown as {renamedHeaders?:object}).renamedHeaders||{}).length)return {records:[],quarantine:[],total:parsed.data.length,errors:['Duplicate CSV headers. Use each required header exactly once.']};
 const result=ingest(parsed.data,parsed.errors);
 result.errors.push(...parsed.errors.filter(e=>e.row===undefined).map(e=>e.message));
 return result;
}
export function toCSV(rows:object[]) {return Papa.unparse(rows,{escapeFormulae:true});}
export type Audit={id:string;timestamp:string;actionType:string;applicantId:string;previousValue:unknown;newValue:unknown;reason:string;actor:string};
export function audit(actionType:string,reason:string,previousValue:unknown=null,newValue:unknown=null,applicantId=''):Audit {return {id:crypto.randomUUID(),timestamp:new Date().toISOString(),actionType,applicantId,previousValue,newValue,reason,actor:'Demo Administrator'};}
export function correctionEvents(before:Applicant,after:Applicant):Audit[] {
 const changed=columns.filter(k=>before[k]!==after[k]);if(!changed.length)return [];
 const events=[audit('Correction',`Updated ${changed.join(', ')}`,before,after,after.applicantId)];
 if(changed.some(k=>Object.values(dates).includes(k)))events.push(audit('Verification','Verification metadata changed in demo; evidence is not independently checked.',before,after,after.applicantId));
 return events;
}
