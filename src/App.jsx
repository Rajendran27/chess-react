import React, { useState, useMemo, useEffect, useRef } from 'react';
import './style.css';
import { GL, CPU } from './constants';
import { legal, allLegal, apply, keyOf, status, san, canMate } from './engine/rules';
import { best } from './engine/ai';
import { startClocks, saveRes, load, save, elo, fresh, material } from './utils';
import { icon } from './components/ui';
import Setup from './components/Setup';
import Dashboard from './components/Dashboard';
import Board from './components/Board';
import PlayerBar from './components/PlayerBar';
import EndCard from './components/EndCard';
import MoveHistory from './components/MoveHistory';
import Dock from './components/Dock';
import ConfirmDialog from './components/ConfirmDialog';

const h=React.createElement;

export default function App(){
  const [snap,setSnap]=useState(fresh), [hist,setHist]=useState([]);
  const [mode,setMode]=useState('2p'), [level,setLevel]=useState(2);
  const [tc,setTc]=useState(0), [clocks,setClocks]=useState({w:0,b:0});
  const clocksRef=useRef(clocks); clocksRef.current=clocks;
  const [view,setView]=useState('setup'), [dashFrom,setDashFrom]=useState('setup'), [showEnd,setShowEnd]=useState(false);
  const [cfg,setCfg]=useState(()=>({mode:'2p',side:'w',level:2,tc:0,...load('chess-setup',{})}));
  const [results,setResults]=useState(()=>{try{return JSON.parse(localStorage.getItem('chess-results'))||[];}catch(e){return [];}});
  const [theme,setTheme]=useState(()=>load('chess-theme','blue')), [pst,setPst]=useState(()=>load('chess-pieces','classic'));
  const [names,setNames]=useState(()=>load('chess-names',{a:'Player 1',b:'Player 2'})), [ratings,setRatings]=useState(()=>load('chess-ratings',{}));
  const [drag,setDrag]=useState(null);
  const dropRef=useRef();
  const wasSel=useRef(false);
  const recRef=useRef(null);
  const [showLog,setShowLog]=useState(false);
  const [askLeave, setAskLeave] = useState(false);
  const cpuCol=mode==='w'?'b':'w';
  const nameOf=c=>{
    if(mode==='2p'){
      const w=names.a.trim()||'Player 1', b=names.b.trim()||'Player 2';
      if(c==='w') return w;
      return b.toLowerCase()===w.toLowerCase()?b+' (2)':b; // never let both sides share one rating
    }
    if(c===cpuCol) return CPU[level][0];
    const n=names.a.trim()||'Player 1';
    return n===CPU[level][0]?n+' (you)':n;
  };
  const ratOf=c=>mode!=='2p'&&c===cpuCol?CPU[level][1]:(ratings[nameOf(c)]?ratings[nameOf(c)].r:1200);
  const cpuTurn=mode!=='2p'&&!snap.over&&snap.s.turn===cpuCol;
  const flagged=tc>0&&clocks[snap.s.turn]<=0;               // side to move has no time left
  const live=snap.log.length>0&&!snap.over;                 // a game is in progress
  const [sel,setSel]=useState(null), [promo,setPromo]=useState(null), [flip,setFlip]=useState(false);
  const targets=useMemo(()=>sel?legal(snap.s,sel[0],sel[1]):[],[sel,snap]);
  const play=(m,pr='Q',na)=>{
    const ck=clocksRef.current;
    if(snap.over||(tc&&ck[snap.s.turn]<=0)) return;          // no moves after game end / flag fall
    const ns=apply(snap.s,m,pr), keys=[...snap.keys,keyOf(ns)], st=status(ns,keys);
    setHist([...hist,snap]);
    setSnap({s:ns,keys,log:[...snap.log,san(snap.s,{...m,pr},st)],over:st.over,chk:st.chk,last:[m.fr,m.fc,m.tr,m.tc],clk:ck,noanim:!!na});
    setSel(null);setPromo(null);
  };
  const click=(r,c)=>{
    const ws=wasSel.current; wasSel.current=false;
    if(snap.over||promo||cpuTurn||flagged) return;
    const mv=sel&&targets.find(m=>m.tr===r&&m.tc===c);
    if(mv){ mv.promo?setPromo(mv):play(mv); return; }
    if(ws&&sel&&sel[0]===r&&sel[1]===c){ setSel(null); return; } // click selected piece again = deselect
    const p=snap.s.b[r][c];
    setSel(p&&p[0]===snap.s.turn?[r,c]:null);
  };
  const undo=()=>{
    if(!hist.length||cpuTurn) return;
    if(snap.over&&recRef.current){                          // taking back a finished game: also take back its result + rating change
      const {id,prev}=recRef.current; recRef.current=null;
      setRatings(prev);save('chess-ratings',prev);
      setResults(rs=>{const n=rs.filter(x=>x.id!==id);saveRes(n);return n;});
    }
    setShowEnd(false);
    let i=hist.length-1;
    if(mode!=='2p'&&hist[i].s.turn===cpuCol&&i>0) i--;
    setSnap({...hist[i],noanim:true});setClocks(hist[i].clk||startClocks(tc));setHist(hist.slice(0,i));setSel(null);setPromo(null);
  };
  const newGame=(m,t=tc)=>{setMode(m);setTc(t);setClocks(startClocks(t));setSnap(fresh());setHist([]);setSel(null);setPromo(null);setFlip(m==='b');setShowEnd(false);setView('game');};
  /* start a game from the setup screen */
  const startGame=()=>{
    const m=cfg.mode==='2p'?'2p':(cfg.side==='r'?(Math.random()<.5?'w':'b'):cfg.side);
    save('chess-setup',cfg);
    setLevel(cfg.level);
    newGame(m,cfg.tc);
  };
 const goSetup = () => {
  setSel(null); setPromo(null); setShowEnd(false); setAskLeave(false);
  setView('setup');
};
const toSetup = () => {
  if (live) setAskLeave(true);   // game in progress: ask first
  else goSetup();                // nothing to lose: just go
};
  const openDash=()=>{setDashFrom(view==='dash'?dashFrom:view);setView('dash');};
  // clock only runs after the first move
  useEffect(()=>{
    if(!tc||snap.over||view!=='game'||!snap.log.length) return;
    let last=Date.now();
    const id=setInterval(()=>{const n=Date.now(),d=n-last;last=n;setClocks(c=>({...c,[snap.s.turn]:Math.max(0,c[snap.s.turn]-d)}));},100);
    return ()=>clearInterval(id);
  },[tc,snap,view]);
  // flag fall: win on time, or draw if the other side cannot mate
  useEffect(()=>{
    if(!tc||snap.over||clocks[snap.s.turn]>0) return;
    const loser=snap.s.turn, winner=loser==='w'?'b':'w';
    setSnap(sn=>({...sn,over:canMate(sn.s.b,winner)?(loser==='w'?'Black':'White')+' wins on time':'Draw: time ran out, insufficient mating material'}));
  },[clocks]);
  // game finished: record result + update ratings
  useEffect(()=>{
    if(!snap.over) return;
    const o=snap.over,wn=o.startsWith('White')?1:o.startsWith('Black')?0:.5;
    const W=nameOf('w'),B=nameOf('b'),rw=ratOf('w'),rb=ratOf('b'),dl={w:null,b:null},nr={...ratings};
    const bump=(c,name,own,opp,sc)=>{const cur=nr[name]||{r:1200,w:0,l:0,d:0},r2=elo(own,opp,sc);dl[c]=r2-own;nr[name]={r:r2,w:cur.w+(sc===1?1:0),l:cur.l+(sc===0?1:0),d:cur.d+(sc===.5?1:0)};};
    if(W!==B){ if(mode==='2p'||cpuCol!=='w') bump('w',W,rw,rb,wn); if(mode==='2p'||cpuCol!=='b') bump('b',B,rb,rw,1-wn); }
    setRatings(nr);save('chess-ratings',nr);
    const id=Date.now()+Math.random();recRef.current={id,prev:ratings};
    const rec={id,r:wn===1?'White':wn===0?'Black':'Draw',msg:o,n:Math.ceil(snap.log.length/2),t:tc,w:W,b:B,dl};
    setResults(rs=>{const n=[rec,...rs].slice(0,50);saveRes(n);return n;});
    setShowEnd(true);
  },[snap.over]);
  // Escape cancels the promotion dialog
  useEffect(()=>{
    if(!promo) return;
    const k=e=>{if(e.key==='Escape')setPromo(null);};
    window.addEventListener('keydown',k);
    return ()=>window.removeEventListener('keydown',k);
  },[promo]);
  const onDown=(e,r,c)=>{
    if(snap.over||promo||cpuTurn||flagged||e.button>0) return;
    const p=snap.s.b[r][c];
    if(!p||p[0]!==snap.s.turn) return;
    wasSel.current=!!(sel&&sel[0]===r&&sel[1]===c);
    setSel([r,c]);
    setDrag({r,c,x:e.clientX,y:e.clientY,sx:e.clientX,sy:e.clientY,moved:false});
  };
  dropRef.current=e=>{
    const d=drag; setDrag(null);
    if(!d||!d.moved) return;
    wasSel.current=false;
    const el=document.elementFromPoint(e.clientX,e.clientY), sq=el&&el.closest('[data-sq]');
    if(!sq) return;
    const [r,c]=sq.dataset.sq.split(',').map(Number);
    const mv=targets.find(m=>m.tr===r&&m.tc===c);
    if(mv){ if(mv.promo) setPromo(mv); else play(mv,'Q',true); }
  };
  const dragging=!!drag;
  useEffect(()=>{
    if(!dragging) return;
    const mv=e=>setDrag(d=>d&&{...d,x:e.clientX,y:e.clientY,moved:d.moved||Math.hypot(e.clientX-d.sx,e.clientY-d.sy)>6});
    const up=e=>dropRef.current(e), cancel=()=>setDrag(null);
    window.addEventListener('pointermove',mv);window.addEventListener('pointerup',up);window.addEventListener('pointercancel',cancel);
    return ()=>{window.removeEventListener('pointermove',mv);window.removeEventListener('pointerup',up);window.removeEventListener('pointercancel',cancel);};
  },[dragging]);
  // computer moves only while the game board is showing
  useEffect(()=>{
    if(!cpuTurn||view!=='game') return;
    const t=setTimeout(()=>{
      const ms=allLegal(snap.s);
      if(!ms.length) return;
      play(level?best(snap.s,level):ms[Math.floor(Math.random()*ms.length)]);
    },350);
    return ()=>clearTimeout(t);
  },[snap,mode,level,view]);

  const ratingNote=()=>{
    const lr=snap.over&&results[0];
    if(!lr||!lr.dl) return '';
    return ['w','b'].filter(c=>lr.dl[c]!==null).map(c=>nameOf(c)+' '+ratOf(c)+' ('+(lr.dl[c]>=0?'+':'')+lr.dl[c]+')').join('  ·  ');
  };

  /* ---------- Screens ---------- */
  if(view==='setup') return h(Setup,{cfg,setCfg,names,setNames,theme,setTheme,pst,setPst,onStart:startGame,onDash:openDash});

  if(view==='dash') return h(Dashboard,{
    results,ratings,dashFrom,
    onBack:()=>setView(dashFrom),
    onNext:()=>newGame(mode,tc),
    onClear:()=>{setResults([]);saveRes([]);setRatings({});save('chess-ratings',{});}
  });

  /* ---------- Game screen ---------- */
  const barProps=c=>({
    name:nameOf(c), color:c, rating:ratOf(c),
    isCpu:mode!=='2p'&&c===cpuCol,
    adv:material(snap.s.b,c)-material(snap.s.b,c==='w'?'b':'w'),
    on:snap.s.turn===c&&!snap.over,
    tc, ms:clocks[c]
  });
  const msg=snap.over||((snap.s.turn==='w'?'White':'Black')+' to move'+(snap.chk?' — check':''));
  const stIcon=snap.over?(snap.over.startsWith('Draw')?'equal':'trophy'):cpuTurn?'loader':snap.chk?'alert':null;

  return h('div',{className:'app game p-'+pst},
    h('div',{className:'status'+(snap.over?' over':snap.chk?' chk':''),'aria-live':'polite'},
      stIcon?icon(stIcon,16,stIcon==='loader'?'spin':''):h('span',{className:'dot '+snap.s.turn}),
      h('span',null,cpuTurn?'Computer is thinking…':msg)),
    h('div',{className:'stage'},
      h(PlayerBar,barProps(flip?'w':'b')),
      h(Board,{
        snap,sel,targets,flip,drag,promo,theme,pst,
        onSquare:click,onDown,
        onPromote:t=>play(promo,t),
        onCancelPromo:()=>setPromo(null)
      },
        snap.over&&showEnd&&h(EndCard,{
          over:snap.over,mode,cpuCol,nameOf,ratingNote:ratingNote(),
          onNext:()=>newGame(mode,tc),onUndo:undo,onSetup:toSetup,onStats:openDash,onBoard:()=>setShowEnd(false)
        })),
      h(PlayerBar,barProps(flip?'b':'w'))),
    h('div',{className:'dockwrap'},
      showLog&&h(MoveHistory,{log:snap.log,onClose:()=>setShowLog(false)}),
      h(Dock,{
        canUndo:hist.length>0&&!cpuTurn,showLog,
        onUndo:undo,onFlip:()=>setFlip(!flip),onRestart:()=>newGame(mode,tc),
        onToggleLog:()=>setShowLog(v=>!v),onSetup:toSetup,onStats:openDash
      })),
    drag&&drag.moved&&h('div',{className:'gw p-'+pst},h('span',{className:'pc ghost '+snap.s.b[drag.r][drag.c][0],style:{left:drag.x,top:drag.y}},GL[snap.s.b[drag.r][drag.c][1]]+'\uFE0E')),
     askLeave&&h(ConfirmDialog,{
      title:'Leave this game?',
      text:'Your current game will be lost.',
      confirmLabel:'Leave',
      onConfirm:goSetup,
      onCancel:()=>setAskLeave(false)
    }));
}