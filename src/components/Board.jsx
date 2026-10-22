// the 8×8 grid and promotion dialog

import React from 'react';
import { GL } from '../constants';
import { kingPos } from '../engine/rules';

const h=React.createElement;
const NAMES={P:'pawn',N:'knight',B:'bishop',R:'rook',Q:'queen',K:'king'};

/* children = overlays drawn on top of the board (e.g. the game-over card) */
export default function Board({snap,sel,targets,flip,drag,promo,theme,pst,onSquare,onDown,onPromote,onCancelPromo,children}){
  const anim=(r,c)=>{
    const L=snap.last; if(!L||snap.noanim) return null;
    const [fr,fc,tr,tc2]=L, k=snap.s.b[tr][tc2]; let o=null;
    if(r===tr&&c===tc2) o=[fc-tc2,fr-tr];
    else if(k&&k[1]==='K'&&Math.abs(tc2-fc)===2&&r===tr&&c===(tc2>fc?5:3)) o=[(tc2>fc?7:0)-c,0];
    return o&&o.map(v=>v*(flip?-1:1));
  };
  const idx=flip?[7,6,5,4,3,2,1,0]:[0,1,2,3,4,5,6,7];
  const kp=snap.chk?kingPos(snap.s.b,snap.s.turn):null;
  const cells=[];
  idx.forEach((r,ri)=>idx.forEach((c,ci)=>{
    const p=snap.s.b[r][c], tg=targets.find(m=>m.tr===r&&m.tc===c), L=snap.last, an=anim(r,c);
    const cls=['sq',(r+c)%2?'d':'l',
      sel&&sel[0]===r&&sel[1]===c?'sel':'',
      L&&((L[0]===r&&L[1]===c)||(L[2]===r&&L[3]===c))?'last':'',
      kp&&kp[0]===r&&kp[1]===c?'chk':'', tg?'dot':'', tg&&tg.cap?'cp':''].join(' ');
    cells.push(h('button',{key:r+'-'+c,className:cls,onClick:()=>onSquare(r,c),onPointerDown:e=>onDown(e,r,c),'data-sq':r+','+c,
      'aria-label':(p?(p[0]==='w'?'white ':'black ')+NAMES[p[1]]+' on ':'')+String.fromCharCode(97+c)+(8-r)},
      ci===0&&h('span',{className:'co r'},8-r),
      ri===7&&h('span',{className:'co f'},String.fromCharCode(97+c)),
      p&&h('span',{key:an?'a'+snap.log.length:'p',className:'pc '+p[0]+(an?' anim':'')+(drag&&drag.moved&&drag.r===r&&drag.c===c?' lift':''),style:an?{'--dx':an[0],'--dy':an[1]}:undefined},GL[p[1]]+'\uFE0E')));
  }));
  return h('div',{className:'board t-'+theme+' p-'+pst},cells,
    promo&&h('div',{className:'ov pr',role:'dialog','aria-label':'Choose promotion piece (Escape to cancel)',onClick:e=>{if(e.target===e.currentTarget)onCancelPromo();}},
      ['Q','R','B','N'].map(t=>h('button',{key:t,autoFocus:t==='Q','aria-label':t,onClick:()=>onPromote(t)},GL[t]+'\uFE0E'))),
    children);
}