import React from 'react';
import { Box, Typography } from '@mui/material';
import Home from '@mui/icons-material/Home';
import BarChart from '@mui/icons-material/BarChart';
import PeopleOutlined from '@mui/icons-material/PeopleOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

const ITEMS=[
  {Icon:Home,active:true},
  {Icon:BarChart},
  {Icon:PeopleOutlined},
  {Icon:CalendarMonthOutlined},
  {Icon:SettingsOutlined}
];

/* left side bar for wide screens: logo + icons, pinned to the left edge of the window.
   Decoration only for now, nothing happens when you click an icon. */
export default function Sidebar(){
  return (
    <Box component="nav" aria-hidden="true" sx={{position:'fixed',left:0,top:0,bottom:0,width:88,zIndex:1,
      display:'flex',flexDirection:'column',alignItems:'center',pt:2.5,borderRight:'1px solid',borderColor:'divider'}}>
      <Typography component="span" sx={{fontSize:38,lineHeight:1,color:'success.main',mb:3.5}}>{'\u265E\uFE0E'}</Typography>
      <Box sx={{display:'flex',flexDirection:'column',gap:2}}>
        {ITEMS.map(({Icon,active},i)=>(
          <Box key={i} sx={{width:50,height:50,borderRadius:3,display:'flex',alignItems:'center',justifyContent:'center',
            bgcolor:active?'#0f4a43':'transparent',color:active?'#fff':'text.primary'}}>
            <Icon sx={{fontSize:28}} />
          </Box>
        ))}
      </Box>
    </Box>
  );
}