import {createContext,useContext,useState,useMemo,useEffect,ReactNode} from 'react';
import {Applicant,Audit,ImportResult,Policy,Freshness,defaultFreshness,defaultPolicies,compare,audit,correctionEvents,columns,parseDate} from './engine';
import {demoImport} from './data/demo';
export type Feedback={id:string;date:string;platform:string;reviewer:string;comment:string;evidence:string;category:string;status:string;change:string;testEvidence:string;before:string;after:string};
type State={version:1;data:ImportResult;dataset:string;policies:[Policy,Policy];freshness:Freshness;events:Audit[];resolved:string[];feedback:Feedback[]};
const key='shiftwise-v1';
function initial():State{return {version:1,data:demoImport(),dataset:'Synthetic scholarship cohort',policies:structuredClone(defaultPolicies),freshness:{...defaultFreshness},events:[],resolved:[],feedback:[]};}
function read():State {try{const raw=localStorage.getItem(key);if(raw){const s=JSON.parse(raw);if(s.version===1&&Array.isArray(s.data.records)&&s.data.records.every((r:Applicant)=>columns.every(k=>typeof r[k]==='string'))&&Array.isArray(s.events)&&Array.isArray(s.feedback)&&Array.isArray(s.resolved)&&s.policies?.length===2&&s.freshness)return s;}}catch{}return initial();}
function useModel(){
 const [state,set]=useState(read),[now,setNow]=useState(Date.now),[toast,setToast]=useState(''),[storageError,setStorageError]=useState('');
 useEffect(()=>{try{localStorage.setItem(key,JSON.stringify(state));setStorageError('')}catch{setStorageError('Browser storage is unavailable or full. Export your work before closing this tab.')}},[state]);
 useEffect(()=>{if(toast){const t=setTimeout(()=>setToast(''),5000);return()=>clearTimeout(t)}},[toast]);
 useEffect(()=>{const timer=setInterval(()=>setNow(Date.now()),60000);return()=>clearInterval(timer)},[]);
 const results=useMemo(()=>state.data.records.map(a=>compare(a,state.policies,state.freshness,now)),[state.data.records,state.policies,state.freshness,now]);
 const addEvents=(events:Audit[])=>set(s=>({...s,events:[...events,...s.events]}));
 const recalculate=()=>{setNow(Date.now());addEvents([audit('Recalculation',`Re-evaluated ${results.length} applicant records.`)]);setToast('Analysis recalculated from current evidence.');};
 const loadDemo=()=>{set(s=>({...s,data:demoImport(),dataset:'Synthetic scholarship cohort',resolved:[],events:[audit('Demo reset','Loaded synthetic dataset.'),...s.events]}));setNow(Date.now());setToast('Synthetic dataset loaded.');};
 const reset=()=>{set(s=>({...initial(),events:[audit('Demo reset','Reset dataset, policies, freshness, feedback and reviews.'),...s.events]}));setNow(Date.now());setToast('Demo reset.');};
 const importData=(data:ImportResult,name:string)=>{set(s=>({...s,data,dataset:name,resolved:[],events:[audit('Import',`${data.records.length} accepted; ${data.quarantine.length} quarantined.`,null,{total:data.total,accepted:data.records.length,quarantined:data.quarantine.length}),...s.events]}));setToast('Import completed; inspect quarantined rows and evidence warnings.');};
 const saveApplicant=(a:Applicant,isNew=false)=>{
  if(!a.applicantId.trim()||!a.fullName.trim())throw Error('Applicant ID and name are required.');
  if(isNew&&state.data.records.some(r=>r.applicantId===a.applicantId))throw Error('Applicant ID already exists.');
  if(parseDate(a.submittedAt)===null||parseDate(a.submittedAt)!>Date.now())throw Error('Submitted date must be a valid, nonfuture ISO date.');
  for(const f of ['gpa','annualFamilyIncome'] as const)if(a[f]&&(!/^\d+(?:\.\d+)?$/.test(a[f])||!Number.isFinite(Number(a[f]))||Number(a[f])<0||(f==='gpa'&&Number(a[f])>10)))throw Error(f==='gpa'?'GPA must be between 0 and 10.':'Income must be nonnegative.');
  for(const f of ['gpaVerifiedAt','incomeVerifiedAt','residencyVerifiedAt'] as const)if(a[f]&&(parseDate(a[f])===null||parseDate(a[f])!>Date.now()))throw Error('Verification dates must be valid and not in the future.');
  const before=state.data.records.find(r=>r.applicantId===a.applicantId);
  const events=before?correctionEvents(before,a):[audit('Correction','Added synthetic applicant.',null,a,a.applicantId)];
  if(!events.length){setToast('No changes to save.');return;}
  const outcome=compare(a,state.policies,state.freshness);
  events.push(audit('Recalculation',`${outcome.old.outcome} → ${outcome.next.outcome}`,null,outcome.transition,a.applicantId));
  set(s=>({...s,data:{...s.data,total:s.data.total+(isNew?1:0),records:isNew?[...s.data.records,a]:s.data.records.map(r=>r.applicantId===a.applicantId?a:r)},resolved:s.resolved.filter(id=>id!==a.applicantId),events:[...events,...s.events]}));setNow(Date.now());setToast('Record saved and both policies re-evaluated.');
 };
 const savePolicies=(policies:[Policy,Policy])=>{set(s=>({...s,policies,resolved:[],events:[audit('Policy','Updated policy comparison.',s.policies,policies),...s.events]}));setToast('Policies saved. All results recalculated.');};
 const saveFreshness=(freshness:Freshness)=>{set(s=>({...s,freshness,resolved:[],events:[audit('Validation','Updated evidence freshness limits.',s.freshness,freshness),...s.events]}));setToast('Freshness limits saved and decisions recalculated.');};
 const resolve=(id:string)=>{const r=results.find(r=>r.applicant.applicantId===id);if(!r||['High','Medium'].includes(r.priority))throw Error('Decision-critical evidence still needs verification.');set(s=>({...s,resolved:[...new Set([...s.resolved,id])],events:[audit('Review','Resolved after reliable policy conclusions.',null,r.transition,id),...s.events]}));setToast('Review marked resolved.');};
 const saveFeedback=(entry:Feedback)=>{set(s=>({...s,feedback:s.feedback.some(f=>f.id===entry.id)?s.feedback.map(f=>f.id===entry.id?entry:f):[entry,...s.feedback]}));setToast('Feedback saved locally. Export it and commit evidence to GitHub.');};
 return {state,results,now,toast,storageError,setToast,recalculate,loadDemo,reset,importData,saveApplicant,savePolicies,saveFreshness,resolve,saveFeedback};
}
type Store=ReturnType<typeof useModel>;
const Context=createContext<Store|null>(null);
export function Provider({children}:{children:ReactNode}){const value=useModel();return <Context.Provider value={value}>{children}</Context.Provider>}
export const useStore=()=>useContext(Context)!;
export function download(name:string,content:string,type='text/plain'){const url=URL.createObjectURL(new Blob([content],{type}));const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
