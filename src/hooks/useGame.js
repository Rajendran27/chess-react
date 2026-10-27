import { useState, useMemo, useEffect } from 'react';
import { legal, allLegal, apply, keyOf, status, san } from '../engine/rules';
import { best, acceptsDraw } from '../engine/ai';
import { fresh, startClocks } from '../utils';
import { playSound } from '../sound';
import useClock from './useClock';
import usePlayers from './usePlayers';

/* the game itself: board state, moves, undo, computer replies, results.
   active = the game board is showing (the computer only moves then) */
export default function useGame({names,active,onLocalMove}){
  const [snap,setSnap]=useState(fresh), [hist,setHist]=useState([]);
  const [mode,setMode]=useState('2p'), [level,setLevel]=useState(2), [tc,setTc]=useState(0);
  const [sel,setSel]=useState(null), [promo,setPromo]=useState(null), [flip,setFlip]=useState(false);
  const [showEnd,setShowEnd]=useState(false);
  const [offerAfter,setOfferAfter]=useState(0);   // no new draw offers until this many plies
  const [remote,setRemote]=useState(null);         // online game: {me:'w'|'b', oppName}

  const clock=useClock({tc,snap,setSnap,active});
  const players=usePlayers({names,mode,level,remote});
  const {cpuCol}=players;

  const cpuTurn=mode!=='2p'&&!snap.over&&snap.s.turn===cpuCol;
  const remoteTurn=!!remote&&!snap.over&&snap.s.turn!==remote.me;   // online: waiting for the other player
  const locked=cpuTurn||remoteTurn;                          // the board ignores clicks
  const live=snap.log.length>0&&!snap.over;                 // a game is in progress
  const canOffer=live&&!cpuTurn&&snap.log.length>=offerAfter;
  const canResign=live&&!cpuTurn;
  const resigner=remote?remote.me:(mode==='2p'?snap.s.turn:(cpuCol==='w'?'b':'w'));   // who loses if resigning
  const targets=useMemo(()=>sel?legal(snap.s,sel[0],sel[1]):[],[sel,snap]);

  const play=(m,pr='Q',na,fromRemote)=>{
    const ck=clock.clocksRef.current;
    if(snap.over||(tc&&ck[snap.s.turn]<=0)) return;          // no moves after game end / flag fall
    if(remote&&!fromRemote&&snap.s.turn!==remote.me) return;   // online: only move on your own turn
    const ns=apply(snap.s,m,pr), keys=[...snap.keys,keyOf(ns)], st=status(ns,keys);
    if(!st.over) playSound(st.chk?'check':m.castle?'castle':m.cap?'capture':'move');
    const taken=m.cap?(m.enp?snap.s.b[m.fr][m.tc]:snap.s.b[m.tr][m.tc]):null;   // the piece that was captured
    if(remote&&!fromRemote&&onLocalMove) onLocalMove(m,pr);   // tell the other player
    setHist([...hist,snap]);
    setSnap({s:ns,keys,log:[...snap.log,san(snap.s,{...m,pr},st)],caps:taken?[...(snap.caps||[]),taken]:(snap.caps||[]),over:st.over,chk:st.chk,last:[m.fr,m.fc,m.tr,m.tc],clk:ck,noanim:!!na});
    setSel(null);setPromo(null);
  };

  const undo=()=>{
    if(!hist.length||cpuTurn||remote) return;                // no undo in online games
    if(snap.over) players.retract();
    setShowEnd(false);
    let i=hist.length-1;
    if(mode!=='2p'&&hist[i].s.turn===cpuCol&&i>0) i--;
    setSnap({...hist[i],noanim:true});clock.setClocks(hist[i].clk||startClocks(tc));setHist(hist.slice(0,i));setSel(null);setPromo(null);
  };

  /* reset everything for a new game (App switches to the board screen) */
  const newGame=(m,t=tc,r=null)=>{
    setMode(m);setTc(t);setRemote(r);clock.reset(t);setSnap(fresh());setHist([]);
    setSel(null);setPromo(null);setFlip(r?r.me==='b':m==='b');setShowEnd(false);
    setOfferAfter(0);
  };

  /* ending a game by resignation or agreement */
  const endGame=msg=>{setSel(null);setPromo(null);setSnap(sn=>sn.over?sn:{...sn,over:msg});};
  const resignAs=color=>endGame((color==='w'?'Black':'White')+' wins by resignation');
  const resign=()=>resignAs(resigner);
  const agreeDraw=()=>endGame('Draw by agreement');
  const declineDraw=()=>setOfferAfter(snap.log.length+10);   // no new offers for 10 plies
  const cpuDrawAnswer=()=>acceptsDraw(snap.s,cpuCol,snap.log.length);

  /* online: the other player made a move (checked against the rules before it is used) */
  const playRemote=d=>{
    if(!remote||!d||snap.over||snap.s.turn===remote.me) return;      // only the opponent may move now
    const m=allLegal(snap.s).find(x=>x.fr===d.fr&&x.fc===d.fc&&x.tr===d.tr&&x.tc===d.tc);
    if(m) play(m,'QRBN'.includes(d.pr)?d.pr:'Q',false,true);
  };

  // game finished: sound, record result + ratings, show the end card
  useEffect(()=>{
    if(!snap.over) return;
    playSound('end');
    players.record(snap,tc);
    setShowEnd(true);
  },[snap.over]);

  // Escape cancels the promotion dialog
  useEffect(()=>{
    if(!promo) return;
    const k=e=>{if(e.key==='Escape')setPromo(null);};
    window.addEventListener('keydown',k);
    return ()=>window.removeEventListener('keydown',k);
  },[promo]);

  // computer moves only while the game board is showing
  useEffect(()=>{
    if(!cpuTurn||!active) return;
    const t=setTimeout(()=>{
      const ms=allLegal(snap.s);
      if(!ms.length) return;
      play(level?best(snap.s,level):ms[Math.floor(Math.random()*ms.length)]);
    },350);
    return ()=>clearTimeout(t);
  },[snap,mode,level,active]);

  return {
    snap,hist,mode,level,setLevel,tc,
    sel,setSel,promo,setPromo,flip,setFlip,showEnd,setShowEnd,
    targets,cpuTurn,remote,remoteTurn,locked,live,flagged:clock.flagged,clocks:clock.clocks,
    play,playRemote,undo,newGame,
    canOffer,canResign,resigner,resign,resignAs,agreeDraw,declineDraw,cpuDrawAnswer,
    cpuCol,nameOf:players.nameOf,ratOf:players.ratOf,
    results:players.results,ratings:players.ratings,clearHistory:players.clearHistory
  };
}