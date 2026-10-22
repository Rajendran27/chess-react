// setup screen

import React from 'react';
import { MODES, LEVELS, CLOCKS, THEMES, PIECE_STYLES, PREVIEW } from '../constants';
import { icon, glyph, seg } from './ui';
import { save } from '../utils';

const h=React.createElement;

export default function Setup({cfg,setCfg,names,setNames,theme,setTheme,pst,setPst,onStart,onDash}){
  const set=p=>setCfg(c=>({...c,...p}));
  const cpuMode=cfg.mode==='cpu';
  const setName=(k,v)=>{const n={...names,[k]:v};setNames(n);save('chess-names',n);};
  const sideOpts=[
    ['w',h('span',{className:'gbox p-'+pst},glyph('w','K')),'White'],
    ['b',h('span',{className:'gbox p-'+pst},glyph('b','K')),'Black'],
    ['r',h('span',{className:'gbox rnd'},'?'),'Random']
  ];
  return h('div',{className:'app'},h('div',{className:'setup'},
    h('div',{className:'hero'},h('h1',null,'Chess'),h('p',null,'Set up your match, then press Start.')),
    h('div',{className:'cols'},
      h('div',{className:'col'},
        h('div',{className:'sg'},h('div',{className:'lbl'},'Game mode'),
          seg(cfg.mode,MODES.map(([v,l,s])=>[v,h('span',{className:'cl'},icon(v==='2p'?'users':'cpu',16),l),s]),v=>set({mode:v}))),
        cpuMode&&h('div',{className:'sg'},h('div',{className:'lbl'},'Difficulty'),seg(cfg.level,LEVELS,v=>set({level:v}))),
        cpuMode&&h('div',{className:'sg'},h('div',{className:'lbl'},'You play as'),seg(cfg.side,sideOpts,v=>set({side:v}))),
        h('div',{className:'sg'},h('div',{className:'lbl'},cpuMode?'Your name':'Players'),
          h('div',{className:'names'},
            h('label',null,cpuMode?'Name':'White',h('input',{value:names.a,maxLength:14,'aria-label':cpuMode?'Your name':'White player name',onChange:e=>setName('a',e.target.value)})),
            !cpuMode&&h('label',null,'Black',h('input',{value:names.b,maxLength:14,'aria-label':'Black player name',onChange:e=>setName('b',e.target.value)})))),
        h('div',{className:'sg'},h('div',{className:'lbl'},'Clock'),seg(cfg.tc,CLOCKS,v=>set({tc:v}),'sm'))),
      h('div',{className:'col'},
        h('div',{className:'sg'},h('div',{className:'lbl'},'Board'),
          seg(theme,THEMES.map(([v,l])=>[v,h('span',{className:'sw t-'+v},h('i'),h('i'),h('i'),h('i')),l]),v=>{setTheme(v);save('chess-theme',v);},'sm')),
        h('div',{className:'sg'},h('div',{className:'lbl'},'Pieces'),
          seg(pst,PIECE_STYLES.map(([v,l])=>[v,h('span',{className:'pv p-'+v},glyph('w','N'),glyph('b','N')),l]),v=>{setPst(v);save('chess-pieces',v);},'sm')),
        h('div',{className:'prev t-'+theme+' p-'+pst,'aria-hidden':true},
          PREVIEW.map((x,i)=>h('div',{key:i,className:'pq '+(((i>>2)+(i&3))%2?'d':'l')},glyph(x[0],x[1])))))),
    h('div',{className:'btns go-row'},
      h('button',{className:'b pri go',onClick:onStart},'Start game'),
      h('button',{className:'b',onClick:onDash},'Dashboard'))));
}