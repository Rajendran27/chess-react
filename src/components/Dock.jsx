import React from 'react';
import { Paper, ButtonBase, Typography } from '@mui/material';
import Undo from '@mui/icons-material/Undo';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import Refresh from '@mui/icons-material/Refresh';
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';
import Tune from '@mui/icons-material/Tune';
import BarChart from '@mui/icons-material/BarChart';
import VolumeUp from '@mui/icons-material/VolumeUp';
import VolumeOff from '@mui/icons-material/VolumeOff';

const Item=({icon,label,title,onClick,active,first})=>(
  <ButtonBase onClick={onClick} title={title} aria-label={title} aria-pressed={active}
    sx={{flex:1,minWidth:0,flexDirection:'column',gap:.25,height:48,borderRadius:0,borderLeft:first?0:'1px solid',borderColor:'divider',
      color:active?'primary.main':'text.primary','& svg':{fontSize:20},transition:'background-color .15s','&:hover':{bgcolor:'rgba(255,255,255,.05)'}}}>
    {icon}
    <Typography sx={{fontSize:11,lineHeight:1}}>{label}</Typography>
  </ButtonBase>
);

/* round Undo button that sits next to the bar */
export function UndoButton({disabled,onClick}){
  return (
    <ButtonBase onClick={onClick} disabled={disabled} title="Undo move" aria-label="Undo move"
      sx={{flex:'none',width:48,height:48,borderRadius:'50%',flexDirection:'column',gap:.25,border:'1px solid',borderColor:'divider',
        bgcolor:'background.paper',opacity:disabled?.3:1,'& svg':{fontSize:20},transition:'background-color .15s','&:hover:not(:disabled)':{bgcolor:'#14292b'}}}>
      <Undo />
      <Typography sx={{fontSize:11,lineHeight:1}}>Undo</Typography>
    </ButtonBase>
  );
}

/* the other actions: Flip, Restart, Moves, Setup, Stats, Sound */
export default function Dock({showLog,sound,onFlip,onRestart,onToggleLog,onSetup,onStats,onToggleSound}){
  return (
    <Paper variant="outlined" sx={{display:'flex',flex:1,minWidth:0,borderRadius:3,overflow:'hidden'}}>
      <Item first icon={<SwapHoriz />} label="Flip" title="Flip board" onClick={onFlip} />
      <Item icon={<Refresh />} label="Restart" title="Restart game" onClick={onRestart} />
      <Item icon={<FormatListBulleted />} label="Moves" title="Move history" onClick={onToggleLog} active={showLog} />
      <Item icon={<Tune />} label="Setup" title="Back to setup" onClick={onSetup} />
      <Item icon={<BarChart />} label="Stats" title="Dashboard" onClick={onStats} />
      <Item icon={sound?<VolumeUp />:<VolumeOff />} label="Sound" title={sound?'Mute sounds':'Turn sounds on'} onClick={onToggleSound} />
    </Paper>
  );
}