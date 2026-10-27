import { useState } from 'react';

/* chat for the match being played. Kept in memory only (never saved), and cleared by the app
   when the match ends or a new one starts */
export default function useChat(){
  const [messages,setMessages]=useState([]);
  const send=(text,side,name)=>setMessages(m=>[...m,{id:Date.now()+Math.random(),text,side,name,at:Date.now()}].slice(-200));
  const clear=()=>setMessages([]);
  return {messages,send,clear};
}