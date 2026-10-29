import React from 'react';
import { Box, Button, IconButton } from '@mui/material';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import Wordmark from './Wordmark';

const NAV=[
  {Icon:PeopleOutlined,label:'Friends'},
  {Icon:CalendarMonthOutlined,label:'Calendar'},
  {Icon:SettingsOutlined,label:'Settings'}
];

const round={width:46,height:46,border:'1px solid',borderColor:'divider',bgcolor:'background.paper',color:'text.primary',
  transition:'border-color .15s, background-color .15s','&:hover':{borderColor:'rgba(61,220,132,.55)',bgcolor:'#14292b'}};

/* Home page: a navbar with icons on top and the big Chess heading. Design only for now:
   the icons do not do anything yet; Play opens the setup screen. */
export default function Home({onPlay}){
  return (
    <Box sx={{minHeight:'100dvh',display:'flex',flexDirection:'column'}}>

      {/* navbar */}
      <Box component="nav" aria-label="Main menu" sx={{display:'flex',justifyContent:'flex-end',alignItems:'center',gap:1.5,px:{xs:2,md:4},py:2,
        borderBottom:'1px solid',borderColor:'divider'}}>
        {NAV.map(({Icon,label})=>(
          <IconButton key={label} aria-label={label} title={label} sx={round}><Icon /></IconButton>
        ))}
      </Box>

      {/* heading */}
      <Box sx={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',gap:{xs:5,md:7},pb:{xs:8,md:10},px:2,
        '& h1':{fontSize:'clamp(64px,11vw,132px)'}}}>
        <Wordmark />
        <Button variant="contained" size="large" onClick={onPlay} sx={{px:7,py:1.5,fontSize:18,borderRadius:999}}>Play</Button>
      </Box>

    </Box>
  );
}