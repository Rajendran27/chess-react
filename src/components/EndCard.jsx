// game-over popup

import React from 'react';
import { icon, btn } from './ui';

const h=React.createElement;

export default function EndCard({over,mode,cpuCol,nameOf,ratingNote,onNext,onUndo,onSetup,onStats,onBoard}){
  const draw=over.startsWith('Draw');
  return h('div',{className:'ov end',role:'dialog','aria-label':'Game over'},
    h('div',{className:'card'},
      h('div',{className:'trophy'},icon(draw?'equal':'trophy',24)),
      h('div',{className:'ttl'},over.includes('checkmate')?'Checkmate':over.includes('resign')?'Resignation':over.includes('time')?'Time out':'Game drawn'),
      h('div',{className:'hd'},draw?'Draw':mode==='2p'?nameOf(over[0]==='W'?'w':'b')+' wins!':over.startsWith(cpuCol==='w'?'White':'Black')?'Computer wins':'You win!'),
      h('div',{className:'sub'},over),
      h('div',{className:'sub'},ratingNote),
      h('div',{className:'btns'},
        btn('restart','Next match',onNext,'pri'),
        btn('undo','Undo',onUndo),
        btn('setup','Setup',onSetup),
        btn('chart','Stats',onStats),
        btn('eye','Board',onBoard))));
}