import React from 'react';
import { MODES, LEVELS, CLOCKS, THEMES, PIECE_STYLES, PREVIEW } from '../constants';
import { icon, glyph, seg } from './ui';
import { save } from '../utils';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import InsertChartIcon from '@mui/icons-material/InsertChart';

const h=React.createElement;

export default function Setup({cfg,setCfg,names,setNames,theme,setTheme,pst,setPst,onStart,onDash,onHome}){
  const set=p=>setCfg(c=>({...c,...p}));
  const cpuMode=cfg.mode==='cpu', online=cfg.mode==='online', joining=online&&cfg.online==='join', solo=cpuMode||online;   // solo = only one name to type
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
          seg(cfg.mode,MODES.map(([v,l,s])=>[v,h('span',{className:'cl'},icon(v==='cpu'?'cpu':'users',16),l),s]),v=>set({mode:v}))),
        cpuMode&&h('div',{className:'sg'},h('div',{className:'lbl'},'Difficulty'),seg(cfg.level,LEVELS,v=>set({level:v}))),
        online&&h('div',{className:'sg'},h('div',{className:'lbl'},'Online game'),
          seg(cfg.online||'create',[['create','Create game','get a code'],['join','Join game','enter a code']],v=>set({online:v})),
          joining&&h('div',{className:'names'},h('label',null,'Game code',h('input',{value:cfg.code||'',maxLength:6,placeholder:'ABC123','aria-label':'Game code',autoCapitalize:'characters',style:{textTransform:'uppercase',letterSpacing:'.15em'},onChange:e=>set({code:e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,'')})})))),
        (cpuMode||(online&&!joining))&&h('div',{className:'sg'},h('div',{className:'lbl'},'You play as'),seg(cfg.side,sideOpts,v=>set({side:v}))),
        h('div',{className:'sg'},h('div',{className:'lbl'},solo?'Your name':'Players'),
          h('div',{className:'names'},
            h('label',null,solo?'Name':'White',h('input',{value:names.a,maxLength:14,'aria-label':solo?'Your name':'White player name',onChange:e=>setName('a',e.target.value)})),
            !solo&&h('label',null,'Black',h('input',{value:names.b,maxLength:14,'aria-label':'Black player name',onChange:e=>setName('b',e.target.value)})))),
        !joining&&h('div',{className:'sg'},h('div',{className:'lbl'},'Clock'),seg(cfg.tc,CLOCKS,v=>set({tc:v}),'sm'))),
      h('div',{className:'col'},
        h('div',{className:'sg'},h('div',{className:'lbl'},'Board'),
          seg(theme,THEMES.map(([v,l])=>[v,h('span',{className:'sw t-'+v},h('i'),h('i'),h('i'),h('i')),l]),v=>{setTheme(v);save('chess-theme',v);},'sm')),
        h('div',{className:'sg'},h('div',{className:'lbl'},'Pieces'),
          seg(pst,PIECE_STYLES.map(([v,l])=>[v,h('span',{className:'pv p-'+v},glyph('w','N'),glyph('b','N')),l]),v=>{setPst(v);save('chess-pieces',v);},'sm')),
        h('div',{className:'prev t-'+theme+' p-'+pst,'aria-hidden':true},
          PREVIEW.map((x,i)=>h('div',{key:i,className:'pq '+(((i>>2)+(i&3))%2?'d':'l')},glyph(x[0],x[1])))))),
    h('div',{className:'btns go-row'},
      onHome&&h('button',{className:'b',onClick:onHome,'aria-label':'Back to home'},<ArrowCircleLeftIcon/>),
      h('button',{className:'b pri go',onClick:onStart},online?(joining?'Join game':'Create game'):'Start game'),
      h('button',{className:'b',onClick:onDash},<InsertChartIcon/>))));
}