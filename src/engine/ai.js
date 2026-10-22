// the computer player (search, best)

import { allLegal, apply, inCheck } from './rules';

const VAL={P:100,N:320,B:330,R:500,Q:900,K:0};
export function evalS(s){
  let v=0;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const p=s.b[r][c]; if(!p) continue;
    let x=VAL[p[1]];
    if(p[1]==='P'){const adv=p[0]==='w'?6-r:r-1;x+=adv*8+(c>=3&&c<=5?adv*4:0);}
    else if(p[1]==='N'||p[1]==='B') x+=10-(Math.abs(r-3.5)+Math.abs(c-3.5))*3;
    v+=p[0]==='w'?x:-x;
  }
  return v;
}

/* the computer accepts a draw only after 20 plies, and only if it is not better by more than a pawn */
export function acceptsDraw(s,cpuCol,plies){
  if(plies<20) return false;
  const v=evalS(s), mine=cpuCol==='w'?v:-v;
  return mine<=100;
}
function search(s,d,a,b){
  if(d<=0){
    if(inCheck(s,s.turn)&&!allLegal(s).length) return s.turn==='w'?-1e5:1e5;
    return evalS(s);
  }
  const ms=allLegal(s);
  if(!ms.length) return inCheck(s,s.turn)?(s.turn==='w'?-1e5-d:1e5+d):0;
  ms.sort((x,y)=>(y.cap?1:0)-(x.cap?1:0));
  let v;
  if(s.turn==='w'){v=-Infinity;for(const m of ms){v=Math.max(v,search(apply(s,m),d-1,a,b));a=Math.max(a,v);if(a>=b)break;}}
  else{v=Infinity;for(const m of ms){v=Math.min(v,search(apply(s,m),d-1,a,b));b=Math.min(b,v);if(a>=b)break;}}
  return v;
}
export function best(s,d){
  const ms=allLegal(s),w=s.turn==='w';
  ms.sort((x,y)=>(y.cap?1:0)-(x.cap?1:0));
  let bm=null,bv=w?-Infinity:Infinity;
  for(const m of ms){
    const v=search(apply(s,m),d-1,-Infinity,Infinity)+Math.random()*6;
    if(w?v>bv:v<bv){bv=v;bm=m;}
  }
  return bm;
}