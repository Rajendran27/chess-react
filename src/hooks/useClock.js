import { useState, useEffect, useRef } from 'react';
import { canMate } from '../engine/rules';
import { startClocks } from '../utils';

/* chess clocks: ticks the side to move, and ends the game when a flag falls.
   active = the game board is showing */
export default function useClock({tc,snap,setSnap,active}){
  const [clocks,setClocks]=useState({w:0,b:0});
  const clocksRef=useRef(clocks); clocksRef.current=clocks;
  const flagged=tc>0&&clocks[snap.s.turn]<=0;               // side to move has no time left
  const reset=t=>setClocks(startClocks(t));

  // clock only runs after the first move
  useEffect(()=>{
    if(!tc||snap.over||!active||!snap.log.length) return;
    let last=Date.now();
    const id=setInterval(()=>{const n=Date.now(),d=n-last;last=n;setClocks(c=>({...c,[snap.s.turn]:Math.max(0,c[snap.s.turn]-d)}));},100);
    return ()=>clearInterval(id);
  },[tc,snap,active]);

  // flag fall: win on time, or draw if the other side cannot mate
  useEffect(()=>{
    if(!tc||snap.over||clocks[snap.s.turn]>0) return;
    const loser=snap.s.turn, winner=loser==='w'?'b':'w';
    setSnap(sn=>({...sn,over:canMate(sn.s.b,winner)?(loser==='w'?'Black':'White')+' wins on time':'Draw: time ran out, insufficient mating material'}));
  },[clocks]);

  return {clocks,setClocks,clocksRef,flagged,reset};
}