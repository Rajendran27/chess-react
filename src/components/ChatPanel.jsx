import React, { useState, useEffect, useRef } from 'react';
import { Box, ButtonBase, IconButton, InputBase, Typography } from '@mui/material';
import ChatBubbleOutlined from '@mui/icons-material/ChatBubbleOutlined';
import Send from '@mui/icons-material/Send';

/* chat box for the match being played, shown in the left space (same box as the calendar).
   players = who can type: both players in a two-player game, only you against the computer */
export default function ChatPanel({messages,players,onSend}){
  const [text,setText]=useState('');
  const [picked,setPicked]=useState(players[0].side);
  const side=players.some(p=>p.side===picked)?picked:players[0].side;     // who is typing
  const me=players.find(p=>p.side===side);
  const two=players.length>1;
  const listRef=useRef(null);
  // keep the newest message in view
  useEffect(()=>{ if(listRef.current) listRef.current.scrollTop=listRef.current.scrollHeight; },[messages.length]);

  const submit=e=>{
    e.preventDefault();
    const t=text.trim();
    if(!t) return;
    onSend(t,me.side,me.name);
    setText('');
  };

  return (
    <div className="mpop fill" role="region" aria-label="Chat">
      <div className="mh"><ChatBubbleOutlined sx={{fontSize:16}} />Chat<em>{messages.length}</em></div>

      <Box ref={listRef} sx={{flex:1,minHeight:0,overflowY:'auto',p:2,display:'flex',flexDirection:'column',gap:1}}>
        {messages.length?messages.map(m=>{
          const right=!two||m.side==='b';          // black (or you, against the computer) on the right, white on the left
          return (
            <Box key={m.id} sx={{alignSelf:right?'flex-end':'flex-start',maxWidth:'82%',px:1.5,py:.75,
              bgcolor:right?'rgba(233,180,76,.16)':'rgba(255,255,255,.07)',
              border:'1px solid',borderColor:right?'rgba(233,180,76,.25)':'divider',
              borderRadius:right?'14px 14px 4px 14px':'14px 14px 14px 4px'}}>
              <Typography sx={{fontSize:11,fontWeight:600,color:right?'primary.main':'text.secondary',mb:.25}}>{m.name}</Typography>
              <Typography sx={{fontSize:14,wordBreak:'break-word',whiteSpace:'pre-wrap'}}>{m.text}</Typography>
              <Typography sx={{fontSize:11,color:'text.secondary',textAlign:right?'right':'left',mt:.25}}>
                {new Date(m.at).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'})}
              </Typography>
            </Box>
          );
        }):(
          <Typography variant="body2" color="text.secondary">No messages yet. The chat is cleared when the match ends.</Typography>
        )}
      </Box>

      <Box sx={{borderTop:'1px solid',borderColor:'divider',p:1.25,display:'flex',flexDirection:'column',gap:1}}>
        {two&&(
          <Box sx={{display:'flex',alignItems:'center',gap:.75}}>
            <Typography sx={{fontSize:12,color:'text.secondary'}}>Sending as</Typography>
            {players.map(p=>(
              <ButtonBase key={p.side} onClick={()=>setPicked(p.side)} aria-pressed={side===p.side}
                sx={{px:1.25,py:.4,borderRadius:999,fontSize:12,fontWeight:600,maxWidth:120,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap',
                  border:'1px solid',borderColor:side===p.side?'primary.main':'divider',
                  bgcolor:side===p.side?'rgba(233,180,76,.16)':'transparent',color:side===p.side?'primary.main':'text.primary'}}>
                {p.name}
              </ButtonBase>
            ))}
          </Box>
        )}
        <Box component="form" onSubmit={submit} sx={{display:'flex',alignItems:'center',gap:1}}>
          <InputBase value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message…" fullWidth inputProps={{'aria-label':'Message',maxLength:500}}
            sx={{px:1.75,py:.75,borderRadius:999,bgcolor:'#142029',border:'1px solid',borderColor:'divider',fontSize:14}} />
          <IconButton type="submit" aria-label="Send message" disabled={!text.trim()}
            sx={{flex:'none',width:40,height:40,bgcolor:'primary.main',color:'primary.contrastText','&:hover':{bgcolor:'#f0c36a'},
              '&.Mui-disabled':{bgcolor:'rgba(255,255,255,.06)',color:'text.disabled'}}}>
            <Send sx={{fontSize:20}} />
          </IconButton>
        </Box>
      </Box>
    </div>
  );
}