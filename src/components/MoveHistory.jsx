// paged move list

import React, { useState, useEffect, useRef } from 'react';
import { icon } from './ui';
import { formatMove } from '../utils';

const h=React.createElement;
const PG=12; // moves per page in the small pop-up, so it never needs scrolling

/* fill = the big panel on wide screens: shows every move in a list that follows the latest move.
   otherwise = the small paged pop-up */
export default function MoveHistory({log,onClose,style,fill}){
  const [logPage,setLogPage]=useState(null);
  const listRef=useRef(null);
  useEffect(()=>{
    if(fill||!onClose) return;
    const k=e=>{if(e.key==='Escape')onClose();};
    window.addEventListener('keydown',k);
    return ()=>window.removeEventListener('keydown',k);
  },[fill,onClose]);
  useEffect(()=>{
    if(fill&&listRef.current) listRef.current.scrollTop=listRef.current.scrollHeight;
  },[fill,log.length]);

  const lastIdx=log.length-1, totalFull=Math.ceil(log.length/2);
  const row=n=>{
    const i=n*2;
    return h('div',{key:n,className:'mv'},
      h('span',{className:'n'},n+1),
      h('b',{className:'m'+(i===lastIdx?' cur':'')},formatMove(log[i])),
      h('b',{className:'m'+(i+1===lastIdx?' cur':'')},log[i+1]?formatMove(log[i+1]):''));
  };

  if(fill){
    const rows=[];
    for(let n=0;n<totalFull;n++) rows.push(row(n));
    return h('div',{className:'mpop fill',role:'region','aria-label':'Move history'},
      h('div',{className:'mh'},icon('list',16),'Moves',h('em',null,totalFull)),
      h('div',{className:'mlist',ref:listRef},rows.length?rows:h('div',{className:'empty'},'No moves yet.')));
  }

  const pages=Math.max(1,Math.ceil(totalFull/PG)), pg=logPage==null?pages-1:Math.min(logPage,pages-1);
  const moveCells=[];
  for(let n=pg*PG;n<Math.min(totalFull,pg*PG+PG);n++) moveCells.push(row(n));
  return h('div',{className:'mpop',style,role:'dialog','aria-label':'Move history'},
    h('div',{className:'mh'},icon('list',16),'Moves',h('em',null,totalFull),
      h('button',{className:'xbtn',onClick:onClose,'aria-label':'Close move history'},icon('x',16))),
    h('div',{className:'mgrid'},moveCells.length?moveCells:h('div',{className:'empty'},'No moves yet.')),
    pages>1&&h('div',{className:'mfoot'},
      h('button',{className:'xbtn',disabled:pg===0,onClick:()=>setLogPage(pg-1),'aria-label':'Earlier moves'},icon('left',16)),
      h('span',null,(pg+1)+' / '+pages),
      h('button',{className:'xbtn',disabled:pg>=pages-1,onClick:()=>setLogPage(pg+1>=pages-1?null:pg+1),'aria-label':'Later moves'},icon('right',16))));
}