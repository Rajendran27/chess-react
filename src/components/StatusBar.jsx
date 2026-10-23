import React from 'react';
import { Box, IconButton, Typography, CircularProgress } from '@mui/material';
import Handshake from '@mui/icons-material/Handshake';
import OutlinedFlag from '@mui/icons-material/OutlinedFlag';

const round={flex:'none',width:34,height:34,border:'1px solid',borderColor:'divider',bgcolor:'background.paper',
  transition:'border-color .15s, background-color .15s','&:hover:not(:disabled)':{borderColor:'rgba(61,220,132,.55)',bgcolor:'#14292b'}};

/* the pill glows green normally, red when in check, gold when the game is over */
const glow={
  chk:{border:'1px solid rgba(229,72,77,.6)',boxShadow:'0 0 14px rgba(229,72,77,.18)'},
  over:{border:'1px solid rgba(233,180,76,.6)',boxShadow:'0 0 14px rgba(233,180,76,.16)'},
  '':{border:'1px solid rgba(61,220,132,.5)',boxShadow:'0 0 14px rgba(61,220,132,.12)'}
};

/* "White to move" pill + offer-draw and resign buttons. grow = pill fills the free width (phones) */
export default function StatusBar({turn,text,tone,thinking,grow,canOffer,canResign,onOffer,onResign}){
  const color=tone==='over'?'primary.main':tone==='chk'?'error.light':'text.primary';
  return (
    <Box sx={{display:'flex',alignItems:'center',gap:1,minWidth:0,flex:grow?1:'none'}}>
      <Box aria-live="polite" sx={{display:'inline-flex',alignItems:'center',justifyContent:grow?'center':'flex-start',gap:1,height:34,px:1.75,borderRadius:999,
        bgcolor:'background.paper',color,minWidth:0,flex:grow?1:'none',transition:'box-shadow .2s, border-color .2s',...glow[tone||'']}}>
        {thinking
          ? <CircularProgress size={14} color="inherit" sx={{flex:'none'}} />
          : <Box sx={{flex:'none',width:12,height:12,borderRadius:'50%',bgcolor:turn==='w'?'#fff':'#111',border:'2px solid #7f8f9d'}} />}
        <Typography noWrap sx={{fontSize:14,fontWeight:500}}>{text}</Typography>
      </Box>
      <IconButton aria-label="Offer draw" title="Offer draw" disabled={!canOffer} onClick={onOffer} sx={round}><Handshake sx={{fontSize:18}} /></IconButton>
      <IconButton aria-label="Resign" title="Resign" disabled={!canResign} onClick={onResign} sx={round}><OutlinedFlag sx={{fontSize:18}} /></IconButton>
    </Box>
  );
}