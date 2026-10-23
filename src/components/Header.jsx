import React from 'react';
import { Box, Typography } from '@mui/material';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import Add from '@mui/icons-material/Add';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

const box={border:'1px solid',borderColor:'divider',bgcolor:'background.paper',borderRadius:999,display:'flex',alignItems:'center'};

/* top bar from the mockup: icons only, nothing here is clickable */
export default function Header(){
  return (
    <Box sx={{display:'flex',alignItems:'center',gap:1}}>
      <Box sx={{...box,width:40,height:40,justifyContent:'center'}} aria-hidden="true"><HomeOutlined fontSize="small" /></Box>
      <Box sx={{...box,flex:1,height:48,gap:1.25,pl:1.75,pr:1.5}}>
        <Typography component="span" sx={{fontSize:28,lineHeight:1,color:'primary.main'}} aria-hidden="true">♞</Typography>
        <Box sx={{flex:1,minWidth:0}}>
          <Typography sx={{fontFamily:'Georgia,"Times New Roman",serif',fontWeight:600,fontSize:20,lineHeight:1.1}}>Chess</Typography>
          <Typography noWrap sx={{fontSize:11,color:'text.secondary'}}>Play · Learn · Improve</Typography>
        </Box>
        <Box sx={{display:'flex',gap:1.5,color:'text.primary'}} aria-hidden="true">
          <Add fontSize="small" />
          <CalendarMonthOutlined fontSize="small" />
          <SettingsOutlined fontSize="small" />
        </Box>
      </Box>
    </Box>
  );
}