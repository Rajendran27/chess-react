import { useState, useEffect, useRef } from 'react';

/* mouse/touch input on the board: click to select and move, or drag a piece.
   g = the object returned by useGame */
export default function useBoardInput(g){
  const {snap,promo,cpuTurn,flagged,sel,setSel,targets,play,setPromo}=g;
  const [drag,setDrag]=useState(null);
  const dropRef=useRef();
  const wasSel=useRef(false);

  const click=(r,c)=>{
    const ws=wasSel.current; wasSel.current=false;
    if(snap.over||promo||cpuTurn||flagged) return;
    const mv=sel&&targets.find(m=>m.tr===r&&m.tc===c);
    if(mv){ mv.promo?setPromo(mv):play(mv); return; }
    if(ws&&sel&&sel[0]===r&&sel[1]===c){ setSel(null); return; } // click selected piece again = deselect
    const p=snap.s.b[r][c];
    setSel(p&&p[0]===snap.s.turn?[r,c]:null);
  };

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

  return {drag,click,onDown};
}