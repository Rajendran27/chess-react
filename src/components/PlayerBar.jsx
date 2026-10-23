// name, rating, clock

import React from 'react';
import { Box, Paper, Avatar, Badge, Typography, Chip } from '@mui/material';
import SmartToy from '@mui/icons-material/SmartToy';
import Person from '@mui/icons-material/Person';
import AccessTime from '@mui/icons-material/AccessTime';
import { GL } from '../constants';
import { fmt } from '../utils';

const ORDER='QRBNP';   // biggest pieces first
const FONT='"Segoe UI Symbol","Noto Sans Symbols 2","DejaVu Sans",sans-serif';

/* small row of the pieces this player has captured */
const Captured=({caps})=>{
  const list=[...caps].sort((a,b)=>ORDER.indexOf(a[1])-ORDER.indexOf(b[1]));
  return (
    <Box aria-label="Captured pieces" sx={{flex:1,minWidth:0,display:'flex',alignItems:'center',overflow:'hidden',whiteSpace:'nowrap',px:1,
      fontFamily:FONT,fontSize:18,lineHeight:1,letterSpacing:'-0.25em'}}>
      {list.map((p,i)=>(
        <span key={i} style={p[0]==='w'
          ?{color:'#fff',textShadow:'0 0 2px #000, 0 1px 2px #000'}
          :{color:'#17212b',textShadow:'0 0 1px rgba(255,255,255,.9), 0 0 2px rgba(255,255,255,.5)'}}>{GL[p[1]]+'\uFE0E'}</span>
      ))}
    </Box>
  );
};

/* player card: avatar, name, colour + rating, captured pieces, clock */
export default function PlayerBar({name,color,rating,isCpu,adv,on,caps=[],tc,ms}){
  const low=ms<30000;
  return (
    <Paper variant="outlined" sx={{display:'flex',alignItems:'center',gap:1.25,height:48,px:1,borderRadius:3,
      borderColor:on?'rgba(61,220,132,.5)':'divider',boxShadow:on?'0 0 14px rgba(61,220,132,.12)':'none'}}>
      <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{vertical:'bottom',horizontal:'right'}}>
        <Avatar sx={{width:36,height:36,bgcolor:isCpu?'#2a3a4a':'#4d7566',color:isCpu?'primary.main':'#fff'}}>
          {isCpu?<SmartToy fontSize="small" />:<Person fontSize="small" />}
        </Avatar>
      </Badge>
      <Box sx={{flex:'0 1 auto',minWidth:0}}>
        <Typography noWrap sx={{fontSize:14,fontWeight:600,lineHeight:1.25}} color={on?'primary.main':'text.primary'}>{name}</Typography>
        <Typography component="span" sx={{fontSize:12,color:'text.secondary',display:'flex',alignItems:'center'}}>
          {(color==='w'?'White':'Black')+' · '+rating}
          {adv>0&&<Chip size="small" color="primary" variant="outlined" label={'+'+adv} sx={{ml:1,height:16,fontSize:11}} />}
        </Typography>
      </Box>
      <Captured caps={caps} />
      {tc>0&&(
        <Box className={on&&low?'clk-low':undefined} sx={{flex:'none',display:'flex',alignItems:'center',gap:.75,height:34,px:1.25,borderRadius:2,border:'1px solid',
          borderColor:on?(low?'error.main':'primary.main'):'divider',
          bgcolor:on?(low?'error.main':'primary.main'):'transparent',
          color:on?(low?'#fff':'primary.contrastText'):(low?'error.light':'text.secondary'),
          fontFamily:'ui-monospace,Menlo,Consolas,monospace',fontWeight:600,fontSize:18,fontVariantNumeric:'tabular-nums'}}>
          <AccessTime sx={{fontSize:16}} />{fmt(ms)}
        </Box>
      )}
    </Paper>
  );
}