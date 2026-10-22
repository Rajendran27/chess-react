// icons, btn, glyph, seg (shared helpers)

import React from 'react';
import { GL } from '../constants';

const h=React.createElement;

/* One consistent icon set: 24px grid, 2px round stroke, inline SVG */
const IC={
  undo:['M9 14 4 9l5-5','M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11'],
  flip:['m21 16-4 4-4-4','M17 20V4','m3 8 4-4 4 4','M7 4v16'],
  restart:['M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8','M21 3v5h-5','M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16','M8 16H3v5'],
  setup:['M21 4h-7','M10 4H3','M21 12h-9','M8 12H3','M21 20h-5','M12 20H3','M14 2v4','M8 10v4','M16 18v4'],
  chart:['M3 3v18h18','M18 17V9','M13 17V5','M8 17v-3'],
  list:['M8 6h13','M8 12h13','M8 18h13','M3 6h.01','M3 12h.01','M3 18h.01'],
  trophy:['M6 9H4.5a2.5 2.5 0 0 1 0-5H6','M18 9h1.5a2.5 2.5 0 0 0 0-5H18','M4 22h16','M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22','M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22','M18 2H6v7a6 6 0 0 0 12 0V2Z'],
  equal:['M5 9h14','M5 15h14'],
  alert:['m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3','M12 9v4','M12 17h.01'],
  clock:['M22 12a10 10 0 1 1-20 0 10 10 0 0 1 20 0z','M12 6v6l4 2'],
  cpu:['M12 8V4H8','M6 8h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2z','M2 14h2','M20 14h2','M15 13v2','M9 13v2'],
  users:['M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2','M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z','M22 21v-2a4 4 0 0 0-3-3.87','M16 3.13a4 4 0 0 1 0 7.75'],
  eye:['M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z','M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z'],
  loader:['M21 12a9 9 0 1 1-6.219-8.56'],
  left:['m15 18-6-6 6-6'],
  right:['m9 18 6-6-6-6'],
  x:['M18 6 6 18','m6 6 12 12'],
  flag:['M4 22V3','M4 4h13l-2 4 2 4H4'],
  volume:['M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z','M16 9a5 5 0 0 1 0 6','M19.364 18.364a9 9 0 0 0 0-12.728'],
  mute:['M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z','m22 9-6 6','m16 9 6 6'],
  handshake:['m11 17 2 2a1 1 0 1 0 3-3','m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4','m21 3 1 11h-2','M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3','M3 4h8'],
};
export const icon=(n,s=16,cls='')=>h('svg',{className:'ic'+(cls?' '+cls:''),width:s,height:s,viewBox:'0 0 24 24',fill:'none',stroke:'currentColor',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round','aria-hidden':true},IC[n].map((d,k)=>h('path',{key:k,d})));
export const btn=(ic,label,onClick,cls='')=>h('button',{className:'b '+cls,onClick},icon(ic,16),label);
export const glyph=(col,t)=>h('span',{className:'pc '+col},GL[t]+'\uFE0E');

/* a row of selectable chips: opts = [value, label (text or node), small caption] */
export const seg=(val,opts,onChange,cls='')=>h('div',{className:'seg '+cls,role:'group'},opts.map(([v,l,sub])=>
  h('button',{key:String(v),type:'button',className:'chip'+(val===v?' on':''),'aria-pressed':val===v,onClick:()=>onChange(v)},
    l,sub?h('small',null,sub):null)));