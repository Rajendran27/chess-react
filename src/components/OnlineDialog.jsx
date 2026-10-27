import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, CircularProgress, Box, Typography } from '@mui/material';

/* shown on the setup screen while creating or joining an online game */
export default function OnlineDialog({status,code,error,onCancel}){
  const copy=()=>{ try{ navigator.clipboard.writeText(code); }catch(e){} };
  return (
    <Dialog open onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{fontFamily:'Georgia,"Times New Roman",serif',color:'primary.main'}}>
        {status==='waiting'?'Waiting for your opponent':status==='joining'?'Joining game':'Could not start'}
      </DialogTitle>
      <DialogContent>
        {status==='waiting'&&(
          <>
            <DialogContentText>Send this code to the other player. They choose Play online, then Join game, and type it in.</DialogContentText>
            <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',gap:1.5,my:2.5}}>
              <Typography sx={{fontFamily:'ui-monospace,Menlo,Consolas,monospace',fontSize:36,fontWeight:700,letterSpacing:'.2em',pl:'.2em'}}>{code}</Typography>
            </Box>
            <Box sx={{display:'flex',justifyContent:'center',mb:2}}><Button variant="outlined" onClick={copy}>Copy code</Button></Box>
            <Box sx={{display:'flex',alignItems:'center',justifyContent:'center',gap:1,color:'text.secondary'}}>
              <CircularProgress size={16} color="inherit" /><Typography variant="body2">Waiting for them to join…</Typography>
            </Box>
          </>
        )}
        {status==='joining'&&(
          <Box sx={{display:'flex',alignItems:'center',gap:1.5,py:1}}><CircularProgress size={20} /><Typography>Connecting to game {code}…</Typography></Box>
        )}
        {status==='error'&&<DialogContentText>{error}</DialogContentText>}
      </DialogContent>
      <DialogActions sx={{px:3,pb:2}}>
        <Button variant={status==='error'?'contained':'text'} color={status==='error'?'primary':'inherit'} onClick={onCancel}>{status==='error'?'Close':'Cancel'}</Button>
      </DialogActions>
    </Dialog>
  );
}