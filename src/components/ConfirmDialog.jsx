import React, { useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Paper, Typography, Box } from '@mui/material';

/* inline = shown as a card in the side area (wide screens); otherwise a normal pop-up (phones) */
export default function ConfirmDialog({ inline, title, text, confirmLabel, cancelLabel = 'Stay', onConfirm, onCancel }) {
  useEffect(() => {
    if (!inline) return;                       // the pop-up handles Escape by itself
    const k = e => { if (e.key === 'Escape') onCancel(); };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [inline, onCancel]);

  if (inline) {
    return (
      <Paper variant="outlined" role="dialog" aria-label={title} sx={{ p: 3, borderRadius: 3, width: '100%', maxWidth: 420 }}>
        <Typography sx={{ fontFamily: 'Georgia,"Times New Roman",serif', fontSize: 22, fontWeight: 600, color: 'primary.main', mb: 1 }}>{title}</Typography>
        <Typography color="text.secondary" sx={{ mb: 2.5 }}>{text}</Typography>
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
          <Button color="inherit" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant="contained" autoFocus onClick={onConfirm}>{confirmLabel}</Button>
        </Box>
      </Paper>
    );
  }
  return (
    <Dialog open onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontFamily: 'Georgia,"Times New Roman",serif', color: 'primary.main' }}>{title}</DialogTitle>
      <DialogContent><DialogContentText>{text}</DialogContentText></DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button color="inherit" onClick={onCancel}>{cancelLabel}</Button>
        <Button variant="contained" autoFocus onClick={onConfirm}>{confirmLabel}</Button>
      </DialogActions>
    </Dialog>
  );
}