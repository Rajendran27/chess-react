import React from 'react';
import { Box, ButtonBase } from '@mui/material';
import HomeOutlined from '@mui/icons-material/HomeOutlined';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';

const ICONS={home:HomeOutlined,calendar:CalendarMonthOutlined,settings:SettingsOutlined};

/* round icon from the mockup. Only clickable when onClick is given (the settings icon);
   the others are decoration only */
export default function CornerIcon({name,size=44,onClick,label}){
  const Icon=ICONS[name];
  const sx={flex:'none',width:size,height:size,borderRadius:'50%',border:'1px solid',borderColor:'divider',
    bgcolor:'background.paper',display:'flex',alignItems:'center',justifyContent:'center'};
  if(onClick) return (
    <ButtonBase onClick={onClick} aria-label={label||name} title={label||name}
      sx={{...sx,transition:'border-color .15s, background-color .15s','&:hover':{borderColor:'rgba(61,220,132,.55)',bgcolor:'#14292b'}}}>
      <Icon fontSize="small" />
    </ButtonBase>
  );
  return (
    <Box aria-hidden="true" sx={sx}>
      <Icon fontSize="small" />
    </Box>
  );
}