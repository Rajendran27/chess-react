import React, { useState } from 'react';
import './style.css';
import { Box, useMediaQuery } from '@mui/material';
import { GL } from './constants';
import { save, material } from './utils';
import Setup from './components/Setup';
import Dashboard from './components/Dashboard';
import CornerIcon from './components/CornerIcon';
import Sidebar from './components/Sidebar';
import RightBar from './components/RightBar';
import StatsPanel from './components/StatsPanel';
import CalendarPanel from './components/CalendarPanel';
import ChatPanel from './components/ChatPanel';
import StatusBar from './components/StatusBar';
import Board from './components/Board';
import PlayerBar from './components/PlayerBar';
import EndCard from './components/EndCard';
import MoveHistory from './components/MoveHistory';
import Dock, { UndoButton } from './components/Dock';
import ConfirmDialog from './components/ConfirmDialog';
import SettingsDialog from './components/SettingsDialog';
import useSettings from './hooks/useSettings';
import useGame from './hooks/useGame';
import useBoardInput from './hooks/useBoardInput';
import useChat from './hooks/useChat';

const h=React.createElement;

export default function App(){
  const S=useSettings();
  const chat=useChat();
  // which screen is showing + small pieces of screen state
  const [view,setView]=useState('setup'), [dashFrom,setDashFrom]=useState('setup');
  const [showLog,setShowLog]=useState(false), [wideView,setWideView]=useState('moves'), [showStats,setShowStats]=useState(false), [showCal,setShowCal]=useState(false), [leftView,setLeftView]=useState(null), [showSettings,setShowSettings]=useState(false);
  const [ask,setAsk]=useState(null), [notice,setNotice]=useState(null);   // ask: 'resign' | 'draw' | 'leave' | null
  const wide=useMediaQuery('(min-width:900px) and (min-aspect-ratio:5/4)',{noSsr:true});   // big screen layout
  const g=useGame({names:S.names,active:view==='game'});
  const input=useBoardInput(g);
  const {snap,mode,tc,clocks,flip,setFlip,sel,targets,promo,setPromo,showEnd,setShowEnd,cpuTurn,cpuCol,nameOf,ratOf,results,ratings,hist,undo,play,
    canOffer,canResign,resigner,resign,agreeDraw,declineDraw,cpuDrawAnswer}=g;
  const {drag}=input;

  const startNew=(m,t=tc)=>{chat.clear();g.newGame(m,t);setView('game');};
  /* start a game from the setup screen */
  const startGame=()=>{
    const {cfg}=S;
    const m=cfg.mode==='2p'?'2p':(cfg.side==='r'?(Math.random()<.5?'w':'b'):cfg.side);
    save('chess-setup',cfg);
    g.setLevel(cfg.level);
    startNew(m,cfg.tc);
  };
  const goSetup=()=>{
    chat.clear();
    g.setSel(null);setPromo(null);setShowEnd(false);setAsk(null);
    setView('setup');
  };
  const toSetup=()=>{
    if(g.live) setAsk('leave');     // game in progress: ask first
    else goSetup();                 // nothing to lose: just go
  };
  const openDash=()=>{setDashFrom(view==='dash'?dashFrom:view);setView('dash');};
  // during a game the dashboard opens where the moves are shown (side panel on wide screens, pop-up on phones)
  const toggleMoves=()=>wide?setWideView(v=>v==='moves'?null:'moves'):(setShowStats(false),setShowCal(false),setShowLog(v=>!v));
  const toggleStats=()=>wide?setWideView(v=>v==='stats'?null:'stats'):(setShowLog(false),setShowCal(false),setShowStats(v=>!v));
  const toggleCal=()=>wide?setLeftView(v=>v==='calendar'?null:'calendar'):(setShowLog(false),setShowStats(false),setShowCal(v=>!v));
  const toggleChat=()=>setLeftView(v=>v==='chat'?null:'chat');
  const showStatsNow=()=>wide?setWideView('stats'):(setShowLog(false),setShowCal(false),setShowStats(true));

  /* short message in the status pill */
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
    caps:(snap.caps||[]).filter(p=>p[0]!==c),   // pieces this player has captured
    tc, ms:clocks[c]
  });
  const msg=snap.over||((snap.s.turn==='w'?'White':'Black')+' to move'+(snap.chk?' — check':''));
  const other=snap.s.turn==='w'?'b':'w';
  // who can type in the chat: both players, or only you against the computer
  const humanCol=cpuCol==='w'?'b':'w';
  const chatPlayers=mode==='2p'?[{side:'w',name:nameOf('w')},{side:'b',name:nameOf('b')}]:[{side:humanCol,name:nameOf(humanCol)}];
  const gp=snap.s.b[drag?drag.r:0][drag?drag.c:0];

  /* the question being asked (resign / draw offer / leave), if any */
  const confirm=
    ask==='resign'?{title:'Resign?',text:nameOf(resigner)+' will lose this game.',confirmLabel:'Resign',
      onConfirm:()=>{setAsk(null);resign();},onCancel:()=>setAsk(null)}
    :ask==='draw'?{title:'Draw offer',text:nameOf(snap.s.turn)+' offers a draw. '+nameOf(other)+', do you accept?',confirmLabel:'Accept',cancelLabel:'Decline',
      onConfirm:()=>{setAsk(null);agreeDraw();},onCancel:()=>{setAsk(null);declineDraw();flash('Draw offer declined');}}
    :ask==='leave'?{title:'Leave this game?',text:'Your current game will be lost.',confirmLabel:'Leave',
      onConfirm:goSetup,onCancel:()=>setAsk(null)}
    :null;

  const status=(
    <StatusBar turn={snap.s.turn} text={notice||(cpuTurn?'Computer is thinking…':msg)} tone={snap.over?'over':snap.chk?'chk':''}
      thinking={cpuTurn&&!notice} grow={!wide} canOffer={canOffer} canResign={canResign}
      onOffer={offerDraw} onResign={()=>setAsk('resign')} />
  );
  const topBar=<PlayerBar {...barProps(flip?'w':'b')} />;
  const bottomBar=<PlayerBar {...barProps(flip?'b':'w')} />;
  const boardEl=(
    <Board snap={snap} sel={sel} targets={targets} flip={flip} drag={drag} promo={promo} theme={theme} pst={pst} hints={S.hints}
      onSquare={input.click} onDown={input.onDown} onPromote={t=>play(promo,t)} onCancelPromo={()=>setPromo(null)}>
      {snap.over&&showEnd&&(
        <EndCard over={snap.over} mode={mode} cpuCol={cpuCol} nameOf={nameOf} ratingNote={ratingNote()}
          onNext={()=>startNew(mode,tc)} onUndo={S.undoOn?undo:null} onSetup={toSetup} onStats={showStatsNow} onBoard={()=>setShowEnd(false)} />
      )}
    </Board>
  );
  const undoBtn=<UndoButton disabled={!S.undoOn||!(hist.length>0&&!cpuTurn)} onClick={undo} />;
  const dock=(
    <Dock showLog={wide?wideView==='moves':showLog} sound={S.sound} onFlip={()=>setFlip(!flip)} onRestart={()=>startNew(mode,tc)}
      onToggleLog={toggleMoves} onSetup={toSetup} onStats={toggleStats} onToggleSound={S.toggleSound} />
  );
  const ghost=drag&&drag.moved&&(
    <div className={'gw p-'+pst}>
      <span className={'pc ghost '+gp[0]} style={{left:drag.x,top:drag.y}}>{GL[gp[1]]+'\uFE0E'}</span>
    </div>
  );

  /* ----- big screens: three rows, each lined up across the whole window -----
     top    : (empty / calendar) | top player    | status, draw, resign
     middle : calendar           | board         | move history (or the question being asked)
     bottom : (empty / calendar) | bottom player | undo
     the board sits in the middle of the window, with a calendar box and a move box of the same size beside it
     the left bar and the right bar (settings + game buttons) are pinned to the window edges */
  if(wide) return (
    <Box sx={{
      '--b':'min(calc(100dvh - 136px), calc(100vw - 760px), 900px)',
      '--side':'clamp(240px, calc((100vw - 208px - 48px - var(--b)) / 2), 560px)',   // width of the calendar box and the moves box
      height:'100dvh',boxSizing:'border-box',pl:'104px',pr:'104px',py:1,display:'grid',alignContent:'center',alignItems:'center',columnGap:3,rowGap:1,
      justifyContent:'center',gridTemplateColumns:'var(--side) var(--b) var(--side)',
      gridTemplateRows:'48px var(--b) 48px'
    }}>
      <Sidebar onCalendar={toggleCal} onChat={toggleChat} />
      <RightBar sound={S.sound} showLog={wideView==='moves'} showStats={wideView==='stats'}
        onFlip={()=>setFlip(!flip)} onRestart={()=>startNew(mode,tc)} onToggleLog={toggleMoves}
        onSetup={toSetup} onStats={toggleStats} onToggleSound={S.toggleSound} onSettings={()=>setShowSettings(true)} />
      <Box sx={{gridColumn:2,gridRow:1}}>{topBar}</Box>
      <Box sx={{gridColumn:3,gridRow:1,display:'flex',alignItems:'center',justifyContent:'space-between',gap:1}}>
        {status}
      </Box>

      {leftView&&(
        <Box sx={{gridColumn:1,gridRow:2,alignSelf:'stretch',width:'100%',minWidth:0,minHeight:0,display:'flex'}}>
          {leftView==='chat'
            ? <ChatPanel messages={chat.messages} players={chatPlayers} onSend={chat.send} />
            : <CalendarPanel results={results} />}
        </Box>
      )}
      <Box sx={{gridColumn:2,gridRow:2}}>{boardEl}</Box>
      <Box sx={{gridColumn:3,gridRow:2,alignSelf:'stretch',width:'100%',minWidth:0,minHeight:0,display:'flex',alignItems:confirm?'center':'stretch',justifyContent:'center'}}>
        {confirm
          ? <ConfirmDialog inline {...confirm} />
          : wideView==='moves' ? <MoveHistory fill log={snap.log} />
          : wideView==='stats' && <StatsPanel results={results} ratings={ratings} onClear={g.clearHistory} />}
      </Box>

      <Box sx={{gridColumn:2,gridRow:3}}>{bottomBar}</Box>
      <Box sx={{gridColumn:3,gridRow:3,display:'flex',alignItems:'center',gap:1}}>{undoBtn}</Box>
      {ghost}
      <SettingsDialog open={showSettings} onClose={()=>setShowSettings(false)} hints={S.hints} setHints={S.setHints} undoOn={S.undoOn} setUndoOn={S.setUndoOn} sound={S.sound} toggleSound={S.toggleSound} />
    </Box>
  );

  /* ----- phones and narrow windows: one column ----- */
  return (
    <Box sx={{'--b':'min(96vw, calc(100dvh - 250px), 640px)',width:'var(--b)',mx:'auto',py:1,display:'flex',flexDirection:'column',gap:1}}>
      <Box sx={{display:'flex',alignItems:'center',gap:1}}>
        <CornerIcon name="home" size={40} />
        {status}
        <CornerIcon name="settings" size={40} label="Settings" onClick={()=>setShowSettings(true)} />
      </Box>
      <div className="stage">{topBar}{boardEl}{bottomBar}</div>
      <Box sx={{display:'flex',alignItems:'center',gap:1,position:'relative'}}>
        {showLog&&!confirm&&<MoveHistory log={snap.log} onClose={()=>setShowLog(false)} />}
        {showStats&&!confirm&&<StatsPanel popup results={results} ratings={ratings} onClear={g.clearHistory} onClose={()=>setShowStats(false)} />}
        {showCal&&!confirm&&<CalendarPanel popup results={results} onClose={()=>setShowCal(false)} />}
        <CornerIcon name="calendar" size={40} label="Calendar" onClick={toggleCal} />
        {undoBtn}
        {dock}
      </Box>
      {ghost}
      <SettingsDialog open={showSettings} onClose={()=>setShowSettings(false)} hints={S.hints} setHints={S.setHints} undoOn={S.undoOn} setUndoOn={S.setUndoOn} sound={S.sound} toggleSound={S.toggleSound} />
      {confirm&&<ConfirmDialog {...confirm} />}
    </Box>
  );
}