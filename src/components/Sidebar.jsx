import React from 'react';
import { Box, ButtonBase, Typography } from '@mui/material';
import Home from '@mui/icons-material/Home';
import BarChart from '@mui/icons-material/BarChart';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import ChatIcon from '@mui/icons-material/ChatBubbleOutlined';   // <- replace this line with the import of YOUR chat icon (keep the name ChatIcon)
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

const ITEMS=[
  {Icon:Home,active:false,id:'home',label:'Home'},
  // {Icon:BarChart},
  {Icon:PeopleOutlined},
  {Icon:ChatIcon,id:'chat',label:'Chat'},
  {Icon:CalendarMonthOutlined,id:'calendar',label:'Calendar'},
  // {Icon:SettingsOutlined}
];

/* left side bar: logo + icons, pinned to the left edge of the window.
   compact = narrower version for phones.
   Decoration only, except the icons that have a handler: onChat, onCalendar. */
export default function Sidebar({compact,onHome,onChat,onCalendar,chatUnread,chatEnabled}){
  const w=compact?56:88, box=compact?40:50, icon=compact?24:28;
  const handlers={home:onHome,chat:chatEnabled?onChat:undefined,calendar:onCalendar};   // chat only works in an online game
  const look=active=>({width:box,height:box,borderRadius:compact?2:3,display:'flex',alignItems:'center',justifyContent:'center',
    bgcolor:active?'#0f4a43':'transparent',color:active?'#fff':'text.primary'});
  return (
    <Box component="nav" aria-hidden={(onHome||onChat||onCalendar)?undefined:'true'} sx={{position:'fixed',left:0,top:0,bottom:0,width:w,zIndex:1,
      display:'flex',flexDirection:'column',alignItems:'center',pt:compact?1.5:2.5,borderRight:'1px solid',borderColor:'divider'}}>
      <Typography component="span" sx={{fontSize:compact?30:38,lineHeight:1,color:'success.main',mb:compact?2.5:3.5}}>{'\u265E\uFE0E'}</Typography>
      <Box sx={{display:'flex',flexDirection:'column',gap:compact?1.5:2}}>
        {ITEMS.map(({Icon,active,id,label},i)=>(
          id&&handlers[id]
            ? <ButtonBase key={i} onClick={handlers[id]} title={label} aria-label={label}
                sx={{...look(active),transition: 'background-color .15s','&:hover': {bgcolor: '#0f4a43',color: '#fff'}}}>
                <Box sx={{position:'relative',display:'flex'}}>
                  <Icon sx={{fontSize:icon}} />
                  {id==='chat'&&chatUnread&&<Box sx={{position:'absolute',top:-2,right:-3,width:11,height:11,borderRadius:'50%',bgcolor:'success.main',border:'2px solid',borderColor:'background.default'}} />}
                </Box>
              </ButtonBase>
            : <Box key={i} sx={{...look(active),opacity:id==='chat'?.35:1}}><Icon sx={{fontSize:icon}} /></Box>
        ))}
      </Box>
    </Box>
  );
}