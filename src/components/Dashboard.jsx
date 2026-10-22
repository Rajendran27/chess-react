// stats screen

import React from 'react';

const h=React.createElement;

export default function Dashboard({results,ratings,dashFrom,onBack,onNext,onClear}){
  const cnt=k=>results.filter(x=>x.r===k).length;
  const hasRatings=Object.keys(ratings).length>0;
  return h('div',{className:'app'},h('div',{className:'side dash'},
    h('h1',null,'Dashboard'),
    h('div',{className:'tiles'},[['White wins',cnt('White')],['Black wins',cnt('Black')],['Draws',cnt('Draw')],['Matches played',results.length]].map(([k,v])=>h('div',{key:k,className:'tile'},h('b',null,v),h('span',null,k)))),
    hasRatings&&h('div',{className:'sec'},'Player ratings'),
    hasRatings&&h('div',{className:'hist'},Object.entries(ratings).sort((a,b)=>b[1].r-a[1].r).slice(0,5).map(([n,v])=>h('div',{key:n,className:'hrow'},h('b',null,n+' — '+v.r),h('span',null,v.w+' won · '+v.l+' lost · '+v.d+' drawn')))),
    h('div',{className:'sec'},'Recent matches'),
    h('div',{className:'hist'},results.length?results.slice(0,10).map((x,i)=>h('div',{key:i,className:'hrow'},h('b',null,(x.w||'White')+' vs '+(x.b||'Black')+' — '+(x.r==='Draw'?'draw':(x.r==='White'?(x.w||'White'):(x.b||'Black'))+' won')),h('span',null,x.msg+' · '+x.n+' moves'+(x.t?' · '+x.t+' min clock':'')))):h('div',{className:'empty'},'No matches yet. Finish a game and the result will show up here.')),
    h('div',{className:'btns'},
      h('button',{className:'b pri',onClick:onBack},dashFrom==='game'?'Back to game':'Back to setup'),
      dashFrom==='game'&&h('button',{className:'b',onClick:onNext},'Next match'),
      results.length>0&&h('button',{className:'b',onClick:onClear},'Clear history & ratings'))));
}