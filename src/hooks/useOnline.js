import { useState, useRef } from 'react';
import Peer from 'peerjs';

const PREFIX='chessgame-';                          // keeps our codes apart from other apps on the free PeerJS server
const ALPHABET='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';   // no 0/O or 1/I, so a code is easy to read out
const newCode=()=>Array.from({length:6},()=>ALPHABET[Math.floor(Math.random()*ALPHABET.length)]).join('');

/* Two players on two devices, joined by a short game code. The two browsers talk to each other
   directly through PeerJS (a free matchmaking server only introduces them). onMessage gets every message
   the other player sends.
   status: idle | waiting (host waits for the guest) | joining | connected | closed | error */
export default function useOnline(onMessage){
  const [status,setStatus]=useState('idle');
  const [code,setCode]=useState('');
  const [error,setError]=useState('');
  const peerRef=useRef(null), connRef=useRef(null), cbRef=useRef(onMessage);
  cbRef.current=onMessage;

  const wire=conn=>{
    connRef.current=conn;
    conn.on('data',d=>{ if(cbRef.current) cbRef.current(d); });
    conn.on('close',()=>{ if(connRef.current===conn){ connRef.current=null; setStatus('closed'); } });
    conn.on('error',()=>{ if(connRef.current===conn){ connRef.current=null; setStatus('closed'); } });
  };

  const close=()=>{
    const c=connRef.current, p=peerRef.current;
    connRef.current=null; peerRef.current=null;        // clear first so the close events below are ignored
    try{ if(c) c.close(); }catch(e){}
    try{ if(p) p.destroy(); }catch(e){}
    setStatus('idle'); setCode(''); setError('');
  };

  /* create a game: make a code and wait for the other player */
  const host=()=>{
    close();
    const c=newCode();
    setStatus('waiting'); setCode(c); setError('');
    const peer=new Peer(PREFIX+c);
    peerRef.current=peer;
    peer.on('connection',conn=>{
      if(connRef.current){ conn.close(); return; }    // only one opponent
      wire(conn);
      conn.on('open',()=>setStatus('connected'));
    });
    peer.on('error',err=>{
      if(err&&err.type==='unavailable-id'){ host(); return; }          // code already taken: make another
      if(connRef.current&&connRef.current.open) return;                 // the game itself is still fine
      setError('Could not create a game. Check your internet and try again.');
      setStatus('error');
    });
  };

  /* join a game with the code the other player shared */
  const join=raw=>{
    close();
    const c=String(raw||'').trim().toUpperCase();
    if(!/^[A-Z0-9]{6}$/.test(c)){ setError('Enter the 6-character game code.'); setStatus('error'); return; }
    setStatus('joining'); setCode(c); setError('');
    const peer=new Peer();
    peerRef.current=peer;
    peer.on('open',()=>{
      const conn=peer.connect(PREFIX+c,{reliable:true});
      wire(conn);
      conn.on('open',()=>setStatus('connected'));
    });
    peer.on('error',err=>{
      if(connRef.current&&connRef.current.open) return;
      setError(err&&err.type==='peer-unavailable'?'No game found with that code.':'Could not connect. Check your internet and try again.');
      setStatus('error');
    });
    setTimeout(()=>{                                                    // nothing happened for a while
      if(peerRef.current===peer&&!(connRef.current&&connRef.current.open)){ setError('Could not connect. Check your internet and try again.'); setStatus('error'); }
    },15000);
  };

  const send=msg=>{ const c=connRef.current; if(c&&c.open) c.send(msg); };

  return {status,code,error,host,join,send,close};
}