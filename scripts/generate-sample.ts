import {writeFileSync} from 'node:fs';
import {demoRows} from '../src/data/demo';
import {toCSV} from '../src/engine';
writeFileSync('public/demo/applicants.csv',toCSV(demoRows()));
