// formatMove, fmt, load/save, elo, fresh, material, startClocks

import { GL, PTS } from './constants';
import { init, keyOf } from './engine/rules';

export const formatMove=move=>move.replace(/^[NBRQK]/,piece=>GL[piece]);
export const startClocks=t=>({w:t*60000,b:t*60000});
export const fmt=ms=>ms>0&&ms<10000?(ms/1000).toFixed(1):Math.floor(Math.ceil(ms/1000)/60)+':'+String(Math.ceil(ms/1000)%60).padStart(2,'0');
export const saveRes=r=>{try{localStorage.setItem('chess-results',JSON.stringify(r));}catch(e){}};
export const load=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v;}catch(e){return d;}};
export const save=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));}catch(e){}};
export const elo=(r,o,sc)=>Math.round(r+32*(sc-1/(1+Math.pow(10,(o-r)/400))));
export const fresh=()=>{const s=init();return {s,keys:[keyOf(s)],log:[],caps:[],over:null,chk:false,last:null,clk:null};};
export const material=(b,col)=>{let v=0;for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(p&&p[0]===col&&PTS[p[1]])v+=PTS[p[1]];}return v;};