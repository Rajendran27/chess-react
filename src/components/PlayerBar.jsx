// name, rating, clock

import React from 'react';
import { icon, glyph } from './ui';
import { fmt } from '../utils';

const h=React.createElement;

export default function PlayerBar({name,color,rating,isCpu,adv,on,tc,ms}){
  return h('div',{className:'pbar'+(on?' on':'')},
    h('div',{className:'av'+(isCpu?' bot':'')},isCpu?icon('cpu',20):glyph(color,'K')),
    h('div',{className:'pi'},
      h('b',null,name),
      h('span',null,(color==='w'?'White':'Black')+' · '+rating,adv>0&&h('i',{className:'adv'},'+'+adv))),
    tc>0
      ?h('div',{className:'ck'+(on?' on':'')+(ms<30000?' low':'')},icon('clock',16),fmt(ms))
      :(on&&h('span',{className:'turn','aria-hidden':true})));
}