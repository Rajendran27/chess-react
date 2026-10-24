import React from 'react';
import { Box, ButtonBase } from '@mui/material';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import Refresh from '@mui/icons-material/Refresh';
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';
import Tune from '@mui/icons-material/Tune';
import BarChart from '@mui/icons-material/BarChart';
import VolumeUp from '@mui/icons-material/VolumeUp';
import VolumeOff from '@mui/icons-material/VolumeOff';

/* same look as the left bar: 50px rounded square, 28px icon, teal when active */
const Item=({icon,title,onClick,active})=>(
  <ButtonBase onClick={onClick} title={title} aria-label={title} aria-pressed={active}
    sx={{flex:'none',width:50,height:50,borderRadius:3,color:active?'#fff':'text.primary',bgcolor:active?'#0f4a43':'transparent',
      transition:'background-color .15s',
      '&:hover':{bgcolor:active?'#12584f':'rgba(255,255,255,.06)'},'& svg':{fontSize:28}}}>
    {icon}
  </ButtonBase>
);

/* right side bar for wide screens, pinned to the right edge like the left one:
   settings at the top, the game buttons at the bottom (spacing matches the left bar) */
export default function RightBar({sound,showLog,onFlip,onRestart,onToggleLog,onSetup,onStats,onToggleSound,onSettings}){
  return (
    <Box component="aside" sx={{position:'fixed',right:0,top:0,bottom:0,width:88,zIndex:1,boxSizing:'border-box',overflowY:'auto',
      display:'flex',flexDirection:'column',alignItems:'center',pt:1,pb:2.5,borderLeft:'1px solid',borderColor:'divider'}}>
      <Item icon={<SettingsOutlined />} title="Settings" onClick={onSettings} />
      <Box sx={{mt:'auto',display:'flex',flexDirection:'column',gap:2}}>
        <Item icon={<SwapHoriz />} title="Flip board" onClick={onFlip} />
        <Item icon={<Refresh />} title="Restart game" onClick={onRestart} />
        <Item icon={<FormatListBulleted />} title="Move history" onClick={onToggleLog} active={showLog} />
        <Item icon={<Tune />} title="Back to setup" onClick={onSetup} />
        <Item icon={<BarChart />} title="Dashboard" onClick={onStats} />
        <Item icon={sound?<VolumeUp />:<VolumeOff />} title={sound?'Mute sounds':'Turn sounds on'} onClick={onToggleSound} />
      </Box>
    </Box>
  );
}