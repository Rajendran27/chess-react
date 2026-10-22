// bottom action buttons

import React from 'react';
import { icon } from './ui';

const h=React.createElement;

const dk=(ic,label,title,onClick,dis,on)=>h('button',{className:'dk'+(on?' on':''),onClick,disabled:dis,title,'aria-label':title,'aria-pressed':on},icon(ic,20),h('span',null,label));

export default function Dock({canUndo,showLog,onUndo,onFlip,onRestart,onToggleLog,onSetup,onStats}){
  return h('div',{className:'dock'},
    dk('undo','Undo','Undo move',onUndo,!canUndo),
    dk('flip','Flip','Flip board',onFlip),
    dk('restart','Restart','Restart game',onRestart),
    dk('list','Moves','Move history',onToggleLog,false,showLog),
    dk('setup','Setup','Back to setup',onSetup),
    dk('chart','Stats','Dashboard',onStats));
}