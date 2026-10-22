import React, { useState } from 'react';
import './style.css';
import { GL } from './constants';
import { save, material } from './utils';
import { icon } from './components/ui';
import Setup from './components/Setup';
import Dashboard from './components/Dashboard';
import Board from './components/Board';
import PlayerBar from './components/PlayerBar';
import EndCard from './components/EndCard';
import MoveHistory from './components/MoveHistory';
import Dock from './components/Dock';
import ConfirmDialog from './components/ConfirmDialog';
import useSettings from './hooks/useSettings';
import useGame from './hooks/useGame';
import useBoardInput from './hooks/useBoardInput';

const h=React.createElement;

export default function App(){
  const S=useSettings();
  // which screen is showing + small pieces of screen state
  const [view,setView]=useState('setup'), [dashFrom,setDashFrom]=useState('setup');
  const [showLog,setShowLog]=useState(false), [askLeave,setAskLeave]=useState(false);
  const [ask,setAsk]=useState(null), [notice,setNotice]=useState(null);   // ask: 'resign' | 'draw' | null
  const g=useGame({names:S.names,active:view==='game'});
  const input=useBoardInput(g);
  const {snap,mode,tc,clocks,flip,setFlip,sel,targets,promo,setPromo,showEnd,setShowEnd,cpuTurn,cpuCol,nameOf,ratOf,results,ratings,hist,undo,play,
    canOffer,canResign,resigner,resign,agreeDraw,declineDraw,cpuDrawAnswer}=g;
  const {drag}=input;

  const startNew=(m,t=tc)=>{g.newGame(m,t);setView('game');};
  /* start a game from the setup screen */
  const startGame=()=>{
    const {cfg}=S;
    const m=cfg.mode==='2p'?'2p':(cfg.side==='r'?(Math.random()<.5?'w':'b'):cfg.side);
    save('chess-setup',cfg);
    g.setLevel(cfg.level);
    startNew(m,cfg.tc);
  };
  const goSetup=()=>{
    g.setSel(null);setPromo(null);setShowEnd(false);setAskLeave(false);
    setView('setup');
  };
  const toSetup=()=>{
    if(g.live) setAskLeave(true);   // game in progress: ask first
    else goSetup();                 // nothing to lose: just go
  };
  const openDash=()=>{setDashFrom(view==='dash'?dashFrom:view);setView('dash');};

  /* short message in the status bar */
  const flash=m=>{setNotice(m);setTimeout(()=>setNotice(null),3000);};
  const offerDraw=()=>{
    if(mode==='2p'){setAsk('draw');return;}      // two players: ask the other side
    if(cpuDrawAnswer()) agreeDraw();              // computer decides
    else{declineDraw();flash('Computer declined the draw offer');}
  };

  const ratingNote=()=>{
    const lr=snap.over&&results[0];
    if(!lr||!lr.dl) return '';
    return ['w','b'].filter(c=>lr.dl[c]!==null).map(c=>nameOf(c)+' '+ratOf(c)+' ('+(lr.dl[c]>=0?'+':'')+lr.dl[c]+')').join('  ·  ');
  };

  /* ---------- Screens ---------- */
  if(view==='setup') return h(Setup,{...S,onStart:startGame,onDash:openDash});

  if(view==='dash') return h(Dashboard,{
    results,ratings,dashFrom,
    onBack:()=>setView(dashFrom),
    onNext:()=>startNew(mode,tc),
    onClear:g.clearHistory
  });

  /* ---------- Game screen ---------- */
  const {theme,pst}=S;
  const barProps=c=>({
    name:nameOf(c), color:c, rating:ratOf(c),
    isCpu:mode!=='2p'&&c===cpuCol,
    adv:material(snap.s.b,c)-material(snap.s.b,c==='w'?'b':'w'),
    on:snap.s.turn===c&&!snap.over,
    tc, ms:clocks[c]
  });
  const msg=snap.over||((snap.s.turn==='w'?'White':'Black')+' to move'+(snap.chk?' — check':''));
  const stIcon=snap.over?(snap.over.startsWith('Draw')?'equal':'trophy'):cpuTurn?'loader':snap.chk?'alert':null;
  const other=snap.s.turn==='w'?'b':'w';

  return h('div',{className:'app game p-'+pst},
    h('div',{className:'topbar'},
      h('div',{className:'status'+(snap.over?' over':snap.chk?' chk':''),'aria-live':'polite'},
        stIcon?icon(stIcon,16,stIcon==='loader'?'spin':''):h('span',{className:'dot '+snap.s.turn}),
        h('span',null,cpuTurn?'Computer is thinking…':(notice||msg))),
      h('button',{className:'tb',disabled:!canOffer,onClick:offerDraw,title:'Offer draw','aria-label':'Offer draw'},icon('handshake',18)),
      h('button',{className:'tb',disabled:!canResign,onClick:()=>setAsk('resign'),title:'Resign','aria-label':'Resign'},icon('flag',18))),
    h('div',{className:'stage'},
      h(PlayerBar,barProps(flip?'w':'b')),
      h(Board,{
        snap,sel,targets,flip,drag,promo,theme,pst,
        onSquare:input.click,onDown:input.onDown,
        onPromote:t=>play(promo,t),
        onCancelPromo:()=>setPromo(null)
      },
        snap.over&&showEnd&&h(EndCard,{
          over:snap.over,mode,cpuCol,nameOf,ratingNote:ratingNote(),
          onNext:()=>startNew(mode,tc),onUndo:undo,onSetup:toSetup,onStats:openDash,onBoard:()=>setShowEnd(false)
        })),
      h(PlayerBar,barProps(flip?'b':'w'))),
    h('div',{className:'dockwrap'},
      showLog&&h(MoveHistory,{log:snap.log,onClose:()=>setShowLog(false)}),
      h(Dock,{
        canUndo:hist.length>0&&!cpuTurn,showLog,sound:S.sound,
        onUndo:undo,onFlip:()=>setFlip(!flip),onRestart:()=>startNew(mode,tc),
        onToggleLog:()=>setShowLog(v=>!v),onSetup:toSetup,onStats:openDash,
        onToggleSound:S.toggleSound
      })),
    drag&&drag.moved&&h('div',{className:'gw p-'+pst},h('span',{className:'pc ghost '+snap.s.b[drag.r][drag.c][0],style:{left:drag.x,top:drag.y}},GL[snap.s.b[drag.r][drag.c][1]]+'\uFE0E')),
    ask==='resign'&&h(ConfirmDialog,{
      title:'Resign?',
      text:nameOf(resigner)+' will lose this game.',
      confirmLabel:'Resign',
      onConfirm:()=>{setAsk(null);resign();},
      onCancel:()=>setAsk(null)
    }),
    ask==='draw'&&h(ConfirmDialog,{
      title:'Draw offer',
      text:nameOf(snap.s.turn)+' offers a draw. '+nameOf(other)+', do you accept?',
      confirmLabel:'Accept',
      cancelLabel:'Decline',
      onConfirm:()=>{setAsk(null);agreeDraw();},
      onCancel:()=>{setAsk(null);declineDraw();flash('Draw offer declined');}
    }),
    askLeave&&h(ConfirmDialog,{
      title:'Leave this game?',
      text:'Your current game will be lost.',
      confirmLabel:'Leave',
      onConfirm:goSetup,
      onCancel:()=>setAskLeave(false)
    }));
}