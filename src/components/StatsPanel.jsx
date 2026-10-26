import React from 'react';
import { icon } from './ui';

const h=React.createElement;

/* the dashboard shown where the move list is shown.
   popup = small pop-up above the buttons on phones (has a close button); otherwise the big side panel */
export default function StatsPanel({results,ratings,onClear,popup,onClose}){
  const cnt=k=>results.filter(x=>x.r===k).length;
  const hasRatings=Object.keys(ratings).length>0;
  return h('div',{className:popup?'mpop':'mpop fill',style:popup?{display:'flex',flexDirection:'column',maxHeight:'65vh'}:undefined,role:'region','aria-label':'Dashboard'},
    h('div',{className:'mh'},icon('chart',16),'Dashboard',
      onClose&&h('button',{className:'xbtn',style:{marginLeft:'auto'},onClick:onClose,'aria-label':'Close dashboard'},icon('x',16))),
    h('div',{className:'mlist stats'},
      h('div',{className:'tiles'},[['White wins',cnt('White')],['Black wins',cnt('Black')],['Draws',cnt('Draw')],['Matches played',results.length]].map(([k,v])=>h('div',{key:k,className:'tile'},h('b',null,v),h('span',null,k)))),
      hasRatings&&h('div',{className:'sec'},'Player ratings'),
      hasRatings&&h('div',{className:'hist'},Object.entries(ratings).sort((a,b)=>b[1].r-a[1].r).slice(0,5).map(([n,v])=>h('div',{key:n,className:'hrow'},h('b',null,n+' — '+v.r),h('span',null,v.w+' won · '+v.l+' lost · '+v.d+' drawn')))),
      h('div',{className:'sec'},'Recent matches'),
      h('div',{className:'hist'},results.length?results.slice(0,10).map((x,i)=>h('div',{key:i,className:'hrow'},h('b',null,(x.w||'White')+' vs '+(x.b||'Black')+' — '+(x.r==='Draw'?'draw':(x.r==='White'?(x.w||'White'):(x.b||'Black'))+' won')),h('span',null,x.msg+' · '+x.n+' moves'+(x.t?' · '+x.t+' min clock':'')))):h('div',{className:'empty'},'No matches yet. Finish a game and the result will show up here.')),
      results.length>0&&h('div',{className:'btns'},h('button',{className:'b',onClick:onClear},'Clear history & ratings'))));
}