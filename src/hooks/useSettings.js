import { useState } from 'react';
import { load } from '../utils';
import { isMuted, setMuted } from '../sound';
import { THEMES } from '../constants';

/* everything the player picks on the setup screen, remembered in localStorage */
export default function useSettings(){
  const [cfg,setCfg]=useState(()=>({mode:'2p',side:'w',level:2,tc:0,...load('chess-setup',{})}));
  const [theme,setTheme]=useState(()=>{const t=load('chess-theme','blue');return THEMES.some(x=>x[0]===t)?t:'blue';});
  const [pst,setPst]=useState(()=>load('chess-pieces','classic'));
  const [hints,setHints]=useState(()=>load('chess-hints',true));   // show possible moves when a piece is selected
  const [undoOn,setUndoOn]=useState(()=>load('chess-undo',true));   // allow taking moves back
  const [names,setNames]=useState(()=>load('chess-names',{a:'Player 1',b:'Player 2'}));
  const [sound,setSound]=useState(()=>!isMuted());
  const toggleSound=()=>{setMuted(sound);setSound(!sound);};
  return {cfg,setCfg,theme,setTheme,pst,setPst,hints,setHints,undoOn,setUndoOn,names,setNames,sound,toggleSound};
}