import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, IconButton, Switch, Typography, Box } from '@mui/material';
import SettingsOutlined from '@mui/icons-material/SettingsOutlined';
import Close from '@mui/icons-material/Close';
import LightbulbOutlined from '@mui/icons-material/LightbulbOutlined';
import Undo from '@mui/icons-material/Undo';
import VolumeUp from '@mui/icons-material/VolumeUp';
import { save } from '../utils';

/* one line of the list: round icon, title + short description, on/off switch */
const Row=({icon,title,text,checked,onChange,last})=>(
  <Box sx={{display:'flex',alignItems:'center',gap:2,py:1.75,borderBottom:last?0:'1px solid',borderColor:'divider'}}>
    <Box sx={{flex:'none',width:42,height:42,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
      bgcolor:'rgba(233,180,76,.12)',color:'primary.main'}}>{icon}</Box>
    <Box sx={{flex:1,minWidth:0}}>
      <Typography sx={{fontWeight:600,lineHeight:1.3}}>{title}</Typography>
      <Typography variant="body2" color="text.secondary">{text}</Typography>
    </Box>
    <Switch checked={checked} onChange={e=>onChange(e.target.checked)} inputProps={{'aria-label':title}} />
  </Box>
);

/* opened from the settings icon */
export default function SettingsDialog({open,onClose,hints,setHints,undoOn,setUndoOn,sound,toggleSound}){
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth
      sx={{'& .MuiDialog-paper':{borderRadius:4,border:'1px solid',borderColor:'divider'}}}>
      <Box sx={{display:'flex',alignItems:'center',gap:1.5,px:3,pt:2.5,pb:1.5}}>
        <SettingsOutlined sx={{color:'primary.main'}} />
        <Typography sx={{flex:1,fontFamily:'Georgia,"Times New Roman",serif',fontWeight:600,fontSize:24}}>Settings</Typography>
        <IconButton aria-label="Close settings" onClick={onClose} size="small"><Close fontSize="small" /></IconButton>
      </Box>
      <DialogContent sx={{pt:0,pb:1}}>
        <Row icon={<LightbulbOutlined />} title="Move hints" text="Show where a piece can move when you select it"
          checked={hints!==false} onChange={v=>{setHints(v);save('chess-hints',v);}} />
        <Row icon={<Undo />} title="Undo" text="Allow taking back moves"
          checked={undoOn!==false} onChange={v=>{setUndoOn(v);save('chess-undo',v);}} />
        <Row last icon={<VolumeUp />} title="Sound" text="Play sounds for moves, captures and check"
          checked={!!sound} onChange={toggleSound} />
      </DialogContent>
      <DialogActions sx={{px:3,pb:2.5,pt:1}}>
        <Button variant="contained" fullWidth onClick={onClose}>Done</Button>
      </DialogActions>
    </Dialog>
  );
}