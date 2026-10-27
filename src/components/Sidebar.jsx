import React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import Home from '@mui/icons-material/Home';
import BarChart from '@mui/icons-material/BarChart';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

const ITEMS=[
  {Icon:Home,active:true},
  {Icon:BarChart},
  {Icon:PeopleOutlined},
  {Icon:CalendarMonthOutlined,calendar:true},
  {Icon:SettingsOutlined}
];

/* left side bar: logo + icons, pinned to the left edge of the window.
   compact = narrower version for phones.
   Decoration only, except the calendar icon when onCalendar is given. */
export default function Sidebar({compact,onCalendar}){
  const w=compact?56:88, box=compact?40:50, icon=compact?24:28;
  const look=active=>({width:box,height:box,borderRadius:compact?2:3,display:'flex',alignItems:'center',justifyContent:'center',
    bgcolor:active?'#0f4a43':'transparent',color:active?'#fff':'text.primary'});
  return (
    <Box component="nav" aria-hidden={onCalendar?undefined:'true'} sx={{position:'fixed',left:0,top:0,bottom:0,width:w,zIndex:1,
      display:'flex',flexDirection:'column',alignItems:'center',pt:compact?1.5:2.5,borderRight:'1px solid',borderColor:'divider'}}>
      <Typography component="span" sx={{fontSize:compact?30:38,lineHeight:1,color:'success.main',mb:compact?2.5:3.5}}>{'\u265E\uFE0E'}</Typography>
      <Box sx={{display:'flex',flexDirection:'column',gap:compact?1.5:2}}>
        {ITEMS.map(({Icon,active,calendar},i)=>(
          calendar&&onCalendar
            ? <ButtonBase key={i} onClick={onCalendar} title="Calendar" aria-label="Calendar"
                sx={{...look(active),transition:'background-color .15s','&:hover':{bgcolor:'rgba(255,255,255,.06)'}}}>
                <Icon sx={{fontSize:icon}} />
              </ButtonBase>
            : <Box key={i} sx={look(active)}><Icon sx={{fontSize:icon}} /></Box>
        ))}
      </Box>
    </Box>
  );
}