import React, { useState, useEffect, useRef } from 'react';
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
import OnlineDialog from './components/OnlineDialog';
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
import useOnline from './hooks/useOnline';

const h=React.createElement;

export default function App(){
  const S=useSettings();
  const chat=useChat();
  // which screen is showing + small pieces of screen state
  const [view,setView]=useState('setup'), [dashFrom,setDashFrom]=useState('setup');
  const [showLog,setShowLog]=useState(false), [wideView,setWideView]=useState('moves'), [showStats,setShowStats]=useState(false), [showCal,setShowCal]=useState(false), [leftView,setLeftView]=useState(null), [showSettings,setShowSettings]=useState(false);
  const [unread,setUnread]=useState(0);   // messages from the other player that you have not opened yet
  const [ask,setAsk]=useState(null), [notice,setNotice]=useState(null);   // ask: 'resign' | 'draw' | 'leave' | null
  const wide=useMediaQuery('(min-width:900px) and (min-aspect-ratio:5/4)',{noSsr:true});   // big screen layout
  const sendRef=useRef(()=>{}), handlerRef=useRef(()=>{});   // online: send to / receive from the other player
  const hostRef=useRef(null), roleRef=useRef(null);          // what the creator chose on setup; did I create or join the game
  const online=useOnline(msg=>handlerRef.current(msg));
  sendRef.current=online.send;
  const g=useGame({names:S.names,active:view==='game',onLocalMove:(m,pr)=>sendRef.current({type:'move',fr:m.fr,fc:m.fc,tr:m.tr,tc:m.tc,pr})});
  const input=useBoardInput(g);
  const {snap,mode,tc,clocks,flip,setFlip,sel,targets,promo,setPromo,showEnd,setShowEnd,cpuTurn,cpuCol,nameOf,ratOf,results,ratings,hist,undo,play,
    canOffer,canResign,resigner,resign,resignAs,agreeDraw,declineDraw,cpuDrawAnswer,remote}=g;
  const {drag}=input;
  // joining player: say hello as soon as the connection opens
  useEffect(()=>{
    if(online.status==='connected'&&roleRef.current==='guest'){
      roleRef.current='guest-sent';
      online.send({type:'hello',name:(S.names.a||'').trim().slice(0,14)||'Player 1'});
    }
  },[online.status]);
  // the other player's connection dropped
  useEffect(()=>{ if(online.status==='closed') flash('Your opponent disconnected'); },[online.status]);

  const startNew=(m,t=tc,r=null)=>{chat.clear();setUnread(0);g.newGame(m,t,r);setView('game');};
  /* start a game from the setup screen */
  const startGame=()=>{
    const {cfg}=S;
    if(cfg.mode==='online'){                                  // game code: create a game, or join one
      save('chess-setup',cfg);
      const name=(S.names.a||'').trim().slice(0,14)||'Player 1';
      if(cfg.online==='join'){ roleRef.current='guest'; online.join(cfg.code); }
      else{ roleRef.current='host'; hostRef.current={side:cfg.side,tc:cfg.tc,name}; online.host(); }
      return;
    }
    const m=cfg.mode==='2p'?'2p':(cfg.side==='r'?(Math.random()<.5?'w':'b'):cfg.side);
    save('chess-setup',cfg);
    g.setLevel(cfg.level);
    startNew(m,cfg.tc);
  };
  const goSetup=()=>{
    online.send({type:'left'}); setTimeout(()=>online.close(),200);   // leave an online game
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
  const toggleChat=()=>{setUnread(0);setLeftView(v=>v==='chat'?null:'chat');};
  const showStatsNow=()=>wide?setWideView('stats'):(setShowLog(false),setShowCal(false),setShowStats(true));

  /* short message in the status pill */
  const flash=m=>{setNotice(m);setTimeout(()=>setNotice(null),3000);};
  const restart=()=>{
    if(!remote) return startNew(mode,tc);
    if(!snap.over){ flash('Finish or resign this match first'); return; }
    online.send({type:'new',side:remote.me,tc});                          // the other player starts the next match too, colours swapped
    startNew('2p',tc,{me:remote.me==='w'?'b':'w',oppName:remote.oppName});
  };
  const offerDraw=()=>{
    if(remote){ online.send({type:'draw-offer'}); flash('Draw offer sent'); return; }
    if(mode==='2p'){setAsk('draw');return;}      // two players: ask the other side
    if(cpuDrawAnswer()) agreeDraw();              // computer decides
    else{declineDraw();flash('Computer declined the draw offer');}
  };

  handlerRef.current=msg=>{
    if(!msg||typeof msg!=='object') return;
    const tcOk=[0,3,5,10].includes(msg.tc)?msg.tc:0, sideOk=msg.side==='b'?'b':'w';
    switch(msg.type){
      case 'hello': {                                      // (creator) the other player joined: pick sides and start
        const cfg=hostRef.current; if(!cfg) break;
        const mine=cfg.side==='r'?(Math.random()<.5?'w':'b'):cfg.side;
        online.send({type:'start',side:mine==='w'?'b':'w',tc:cfg.tc,hostName:cfg.name});
        startNew('2p',cfg.tc,{me:mine,oppName:String(msg.name||'Player 2').slice(0,14)});
        break; }
      case 'start': startNew('2p',tcOk,{me:sideOk,oppName:String(msg.hostName||'Player 1').slice(0,14)}); break;
      case 'new': startNew('2p',tcOk,{me:sideOk,oppName:remote?remote.oppName:'Opponent'}); break;
      case 'move': g.playRemote(msg); break;
      case 'resign': if(remote) resignAs(remote.me==='w'?'b':'w'); break;
      case 'draw-offer': setAsk('draw-in'); break;
      case 'draw-accept': agreeDraw(); break;
      case 'draw-decline': declineDraw(); flash('Draw offer declined'); break;
      case 'chat':
        chat.send(String(msg.text||'').slice(0,500),msg.side==='b'?'b':'w',String(msg.name||'').slice(0,14));
        if(leftView!=='chat') setUnread(n=>n+1);                   // chat box is closed: show the dot on the chat icon
        break;
      case 'left': flash('Your opponent left the game'); break;
      default: break;
    }
  };

  const ratingNote=()=>{
    const lr=snap.over&&results[0];
    if(!lr||!lr.dl) return '';
    return ['w','b'].filter(c=>lr.dl[c]!==null).map(c=>nameOf(c)+' '+ratOf(c)+' ('+(lr.dl[c]>=0?'+':'')+lr.dl[c]+')').join('  ·  ');
  };

  /* ---------- Screens ---------- */
  if(view==='setup') return h(React.Fragment,null,
    h(Setup,{...S,onStart:startGame,onDash:openDash}),
    ['waiting','joining','error'].includes(online.status)&&h(OnlineDialog,{status:online.status,code:online.code,error:online.error,onCancel:online.close}));

  if(view==='dash') return h(Dashboard,{
    results,ratings,dashFrom,
    onBack:()=>setView(dashFrom),
    onNext:()=>restart(),
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
  const sendChat=(t,side,name)=>{ chat.send(t,side,name); if(remote) online.send({type:'chat',text:t,side,name}); };
  const chatPlayers=remote?[{side:remote.me,name:nameOf(remote.me)}]:mode==='2p'?[{side:'w',name:nameOf('w')},{side:'b',name:nameOf('b')}]:[{side:humanCol,name:nameOf(humanCol)}];
  const gp=snap.s.b[drag?drag.r:0][drag?drag.c:0];

  /* the question being asked (resign / draw offer / leave), if any */
  const confirm=
    ask==='resign'?{title:'Resign?',text:nameOf(resigner)+' will lose this game.',confirmLabel:'Resign',
      onConfirm:()=>{setAsk(null);resign();if(remote)online.send({type:'resign'});},onCancel:()=>setAsk(null)}
    :ask==='draw'?{title:'Draw offer',text:nameOf(snap.s.turn)+' offers a draw. '+nameOf(other)+', do you accept?',confirmLabel:'Accept',cancelLabel:'Decline',
      onConfirm:()=>{setAsk(null);agreeDraw();},onCancel:()=>{setAsk(null);declineDraw();flash('Draw offer declined');}}
    :ask==='draw-in'?{title:'Draw offer',text:(remote?remote.oppName:'Your opponent')+' offers a draw. Do you accept?',confirmLabel:'Accept',cancelLabel:'Decline',
      onConfirm:()=>{setAsk(null);online.send({type:'draw-accept'});agreeDraw();},onCancel:()=>{setAsk(null);online.send({type:'draw-decline'});declineDraw();}}
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
          onNext={()=>restart()} onUndo={S.undoOn&&!remote?undo:null} onSetup={toSetup} onStats={showStatsNow} onBoard={()=>setShowEnd(false)} />
      )}
    </Board>
  );
  const undoBtn=<UndoButton disabled={!S.undoOn||!!remote||!(hist.length>0&&!cpuTurn)} onClick={undo} />;
  const dock=(
    <Dock showLog={wide?wideView==='moves':showLog} sound={S.sound} onFlip={()=>setFlip(!flip)} onRestart={()=>restart()}
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
      <Sidebar onCalendar={toggleCal} onChat={toggleChat} chatUnread={unread>0} />
      <RightBar sound={S.sound} showLog={wideView==='moves'} showStats={wideView==='stats'}
        onFlip={()=>setFlip(!flip)} onRestart={()=>restart()} onToggleLog={toggleMoves}
        onSetup={toSetup} onStats={toggleStats} onToggleSound={S.toggleSound} onSettings={()=>setShowSettings(true)} />
      <Box sx={{gridColumn:2,gridRow:1}}>{topBar}</Box>
      <Box sx={{gridColumn:3,gridRow:1,display:'flex',alignItems:'center',justifyContent:'space-between',gap:1}}>
        {status}
      </Box>

      {leftView&&(
        <Box sx={{gridColumn:1,gridRow:2,alignSelf:'stretch',width:'100%',minWidth:0,minHeight:0,display:'flex'}}>
          {leftView==='chat'
            ? <ChatPanel messages={chat.messages} players={chatPlayers} mineSide={remote?remote.me:null} onSend={sendChat} />
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