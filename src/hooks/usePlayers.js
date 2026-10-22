import { useState, useRef } from 'react';
import { CPU } from '../constants';
import { load, save, saveRes, elo } from '../utils';

/* who is playing, their ratings, and the saved match history */
export default function usePlayers({names,mode,level}){
  const [results,setResults]=useState(()=>{try{return JSON.parse(localStorage.getItem('chess-results'))||[];}catch(e){return [];}});
  const [ratings,setRatings]=useState(()=>load('chess-ratings',{}));
  const recRef=useRef(null);
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

  /* a game just finished: store the result and update ratings */
  const record=(snap,tc)=>{
    const o=snap.over,wn=o.startsWith('White')?1:o.startsWith('Black')?0:.5;
    const W=nameOf('w'),B=nameOf('b'),rw=ratOf('w'),rb=ratOf('b'),dl={w:null,b:null},nr={...ratings};
    const bump=(c,name,own,opp,sc)=>{const cur=nr[name]||{r:1200,w:0,l:0,d:0},r2=elo(own,opp,sc);dl[c]=r2-own;nr[name]={r:r2,w:cur.w+(sc===1?1:0),l:cur.l+(sc===0?1:0),d:cur.d+(sc===.5?1:0)};};
    if(W!==B){ if(mode==='2p'||cpuCol!=='w') bump('w',W,rw,rb,wn); if(mode==='2p'||cpuCol!=='b') bump('b',B,rb,rw,1-wn); }
    setRatings(nr);save('chess-ratings',nr);
    const id=Date.now()+Math.random();recRef.current={id,prev:ratings};
    const rec={id,r:wn===1?'White':wn===0?'Black':'Draw',msg:o,n:Math.ceil(snap.log.length/2),t:tc,w:W,b:B,dl};
    setResults(rs=>{const n=[rec,...rs].slice(0,50);saveRes(n);return n;});
  };

  /* taking back a finished game: also take back its result + rating change */
  const retract=()=>{
    if(!recRef.current) return;
    const {id,prev}=recRef.current; recRef.current=null;
    setRatings(prev);save('chess-ratings',prev);
    setResults(rs=>{const n=rs.filter(x=>x.id!==id);saveRes(n);return n;});
  };

  const clearHistory=()=>{setResults([]);saveRes([]);setRatings({});save('chess-ratings',{});};

  return {results,ratings,cpuCol,nameOf,ratOf,record,retract,clearHistory};
}