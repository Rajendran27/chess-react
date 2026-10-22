// paged move list

import React, { useState, useEffect } from 'react';
import { icon } from './ui';
import { formatMove } from '../utils';

const h=React.createElement;
const PG=12; // moves per page, so the list never needs scrolling

export default function MoveHistory({log,onClose}){
  const [logPage,setLogPage]=useState(null);
  useEffect(()=>{
    const k=e=>{if(e.key==='Escape')onClose();};
    window.addEventListener('keydown',k);
    return ()=>window.removeEventListener('keydown',k);
  },[onClose]);
  const lastIdx=log.length-1, totalFull=Math.ceil(log.length/2);
  const pages=Math.max(1,Math.ceil(totalFull/PG)), pg=logPage==null?pages-1:Math.min(logPage,pages-1);
  const moveCells=[];
  for(let n=pg*PG;n<Math.min(totalFull,pg*PG+PG);n++){
    const i=n*2;
    moveCells.push(h('div',{key:n,className:'mv'},
      h('span',{className:'n'},n+1),
      h('b',{className:'m'+(i===lastIdx?' cur':'')},formatMove(log[i])),
      h('b',{className:'m'+(i+1===lastIdx?' cur':'')},log[i+1]?formatMove(log[i+1]):'')));
  }
  return h('div',{className:'mpop',role:'dialog','aria-label':'Move history'},
    h('div',{className:'mh'},icon('list',16),'Moves',h('em',null,totalFull),
      h('button',{className:'xbtn',onClick:onClose,'aria-label':'Close move history'},icon('x',16))),
    h('div',{className:'mgrid'},moveCells.length?moveCells:h('div',{className:'empty'},'No moves yet.')),
    pages>1&&h('div',{className:'mfoot'},
      h('button',{className:'xbtn',disabled:pg===0,onClick:()=>setLogPage(pg-1),'aria-label':'Earlier moves'},icon('left',16)),
      h('span',null,(pg+1)+' / '+pages),
      h('button',{className:'xbtn',disabled:pg>=pages-1,onClick:()=>setLogPage(pg+1>=pages-1?null:pg+1),'aria-label':'Later moves'},icon('right',16))));
}