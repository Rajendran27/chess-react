import React from 'react';
import { Box, Paper, ButtonBase, Typography } from '@mui/material';
import Undo from '@mui/icons-material/Undo';
import SwapHoriz from '@mui/icons-material/SwapHoriz';
import Refresh from '@mui/icons-material/Refresh';
import FormatListBulleted from '@mui/icons-material/FormatListBulleted';
import Tune from '@mui/icons-material/Tune';
import BarChart from '@mui/icons-material/BarChart';
import ChatIcon from '@mui/icons-material/ChatBubbleOutlined';   // <- replace this line with the import of YOUR chat icon (keep the name ChatIcon)

const Item=({icon,label,title,onClick,disabled,active,first,dot})=>(
  <ButtonBase onClick={onClick} disabled={disabled} title={title} aria-label={title} aria-pressed={active}
    sx={{flex:1,minWidth:0,flexDirection:'column',gap:.25,height:48,borderRadius:0,borderLeft:first?0:'1px solid',borderColor:'divider',
      color:active?'primary.main':'text.primary',opacity:disabled?.35:1,'& svg':{fontSize:20},transition:'background-color .15s','&:hover':{bgcolor:'rgba(255,255,255,.05)'}}}>
    <Box sx={{position:'relative',display:'flex'}}>
      {icon}
      {dot&&<Box sx={{position:'absolute',top:-2,right:-3,width:9,height:9,borderRadius:'50%',bgcolor:'success.main',border:'2px solid',borderColor:'background.paper'}} />}
    </Box>
    <Typography sx={{fontSize:11,lineHeight:1}}>{label}</Typography>
  </ButtonBase>
);

/* round Undo button that sits next to the bar */
export function UndoButton({disabled,onClick}){
  return (
    <ButtonBase onClick={onClick} disabled={disabled} title="Undo move" aria-label="Undo move"
      sx={{flex:'none',width:48,height:48,borderRadius:'50%',flexDirection:'column',gap:.25,border:'1px solid',borderColor:'divider',
        bgcolor:'background.paper',opacity:disabled?.3:1,'& svg':{fontSize:20},transition:'background-color .15s','&:hover:not(:disabled)':{bgcolor:'#14292b'}}}>
      {/* stroke makes the arrow bolder: raise strokeWidth for bolder, lower it for lighter */}
      <Undo sx={{stroke:'currentColor',strokeWidth:1.2}} />
      <Typography sx={{fontSize:11,lineHeight:1}}>Undo</Typography>
    </ButtonBase>
  );
}

/* the other actions: Flip, Restart, Moves, Setup, Stats, Chat (Chat only works in an online game) */
export default function Dock({showLog,onFlip,onRestart,onToggleLog,onSetup,onStats,onChat,chatEnabled,chatUnread}){
  return (
    <Paper variant="outlined" sx={{display:'flex',flex:1,minWidth:0,borderRadius:3,overflow:'hidden'}}>
      <Item first icon={<SwapHoriz />} label="Flip" title="Flip board" onClick={onFlip} />
      <Item icon={<Refresh />} label="Restart" title="Restart game" onClick={onRestart} />
      <Item icon={<FormatListBulleted />} label="Moves" title="Move history" onClick={onToggleLog} active={showLog} />
      <Item icon={<Tune />} label="Setup" title="Back to setup" onClick={onSetup} />
      <Item icon={<BarChart />} label="Stats" title="Dashboard" onClick={onStats} />
      <Item icon={<ChatIcon />} label="Chat" title={chatEnabled?'Chat':'Chat (online games only)'} onClick={onChat} disabled={!chatEnabled} dot={chatUnread} />
    </Paper>
  );
}