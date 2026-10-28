import React, { useEffect } from 'react';
import { Box } from '@mui/material';

// elegant italic serif font from Google Fonts (loaded once; Georgia italic is used until it arrives or if offline)
let fontRequested=false;
const loadFont=()=>{
  if(fontRequested||typeof document==='undefined') return;
  fontRequested=true;
  const l=document.createElement('link');
  l.rel='stylesheet';
  l.href='https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700;1,900&display=swap';
  document.head.appendChild(l);
};

/* chess pieces tucked behind the letters: faint at first, they show up when you move the mouse over the title */
const PIECES=[
  {g:'\u265E',left:'-40%',top:'-30%',size:'1.7em',rot:-12},   // knight behind the C
  {g:'\u265F',left:'31%',top:'82%',size:'1.1em',rot:120},      // pawn under h and e
  {g:'\u265C',left:'43%',top:'-36%',size:'1.35em',rot:10},   // rook above the second s
  {g:'\u265B',left:'94%',top:'-10%',size:'1.4em',rot:29}      // queen at the end
];

/* "Chess" title: elegant italic serif with a layered 70s/80s retro shadow, and hidden chess pieces */
export default function Wordmark(){
  useEffect(loadFont,[]);
  return (
    <Box component="h1" sx={{
      m:0,position:'relative',display:'inline-block',lineHeight:1,fontSize:'clamp(38px,3.6vw,56px)',
      fontFamily:'"Playfair Display",Georgia,"Times New Roman",serif',fontStyle:'italic',fontWeight:900,letterSpacing:'.02em',whiteSpace:'nowrap',
      color:'#fff3d1',
      // layered offset shadows: gold -> orange -> red, like the retro text effects
      textShadow:'1px 1px 0 #f0c36a, 2px 2px 0 #e9b44c, 3px 3px 0 #dd8a2e, 4px 4px 0 #c9602b, 5px 5px 0 #a8402a, 7px 8px 7px rgba(0,0,0,.45)',
      '& .hid':{position:'absolute',zIndex:0,color:'#35cc86',opacity:.13,fontStyle:'normal',fontWeight:400,textShadow:'none',pointerEvents:'none',
        transition:'opacity .35s ease, transform .35s ease'},
      '&:hover .hid':{opacity:.6,transform:'translateY(-3px) rotate(var(--r))'}
    }}>
      {PIECES.map((p,i)=>(
        <span key={i} className="hid" aria-hidden="true" style={{left:p.left,top:p.top,fontSize:p.size,'--r':p.rot+'deg',transform:'rotate('+p.rot+'deg)'}}>{p.g+'\uFE0E'}</span>
      ))}
      <span style={{position:'relative',zIndex:1}}>Chess</span>
    </Box>
  );
}