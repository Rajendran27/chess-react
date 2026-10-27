import React, { useState } from 'react';
import { Box, ButtonBase, IconButton, Typography } from '@mui/material';
import CalendarMonthOutlined from '@mui/icons-material/CalendarMonthOutlined';
import ChevronLeft from '@mui/icons-material/ChevronLeft';
import ChevronRight from '@mui/icons-material/ChevronRight';
import Close from '@mui/icons-material/Close';

const WEEK=['S','M','T','W','T','F','S'];
const keyOf=d=>d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();   // one key per local day
const sgn=n=>(n>=0?'+':'')+n;
const score=r=>r==='White'?'1–0':r==='Black'?'0–1':'½–½';          // classic chess result

/* month calendar of the games you played. A dot marks a day with games; pick a day to list them.
   Shown in the free space on the left (wide screens) or as a pop-up on phones. */
export default function CalendarPanel({results,popup,onClose}){
  const today=new Date();
  const [month,setMonth]=useState(()=>new Date(today.getFullYear(),today.getMonth(),1));
  const [picked,setPicked]=useState(today);

  // group saved games by the day they were played (a game's id starts with the time it finished)
  const byDay={};
  results.forEach(x=>{
    const t=Math.floor(x.id);
    if(!t) return;
    const k=keyOf(new Date(t));
    (byDay[k]=byDay[k]||[]).push(x);
  });

  const y=month.getFullYear(), m=month.getMonth();
  const lead=new Date(y,m,1).getDay(), count=new Date(y,m+1,0).getDate();
  const cells=[...Array(lead).fill(null),...Array.from({length:count},(_,i)=>i+1)];
  const games=byDay[keyOf(picked)]||[];
  const go=n=>setMonth(new Date(y,m+n,1));
  const arrow={width:34,height:34,border:'1px solid',borderColor:'divider',bgcolor:'rgba(255,255,255,.03)'};

  return (
    <div className={popup?'mpop':'mpop fill'} style={popup?{display:'flex',flexDirection:'column',maxHeight:'70vh'}:undefined} role="region" aria-label="Calendar">
      <div className="mh">
        <CalendarMonthOutlined sx={{fontSize:16}} />Calendar
        {onClose&&<button className="xbtn" style={{marginLeft:'auto'}} onClick={onClose} aria-label="Close calendar"><Close sx={{fontSize:16}} /></button>}
      </div>
      <Box sx={{flex:1,minHeight:0,overflowY:'auto',p:2,display:'flex',flexDirection:'column'}}>

        {/* month title with arrows */}
        <Box sx={{display:'flex',alignItems:'center',justifyContent:'space-between',mb:2}}>
          <IconButton aria-label="Previous month" onClick={()=>go(-1)} sx={arrow}><ChevronLeft /></IconButton>
          <Box sx={{textAlign:'center'}}>
            <Typography sx={{fontFamily:'Georgia,"Times New Roman",serif',fontWeight:600,fontSize:22,lineHeight:1.1}}>
              {month.toLocaleDateString(undefined,{month:'long'})}
            </Typography>
            <Typography variant="body2" color="text.secondary">{y}</Typography>
          </Box>
          <IconButton aria-label="Next month" onClick={()=>go(1)} sx={arrow}><ChevronRight /></IconButton>
        </Box>

        {/* days */}
        <Box sx={{display:'grid',gridTemplateColumns:'repeat(7,1fr)',gap:.75,mb:2.5}}>
          {WEEK.map((d,i)=><Typography key={'w'+i} sx={{textAlign:'center',fontSize:12,fontWeight:600,color:'text.secondary',pb:.5}}>{d}</Typography>)}
          {cells.map((d,i)=>{
            if(!d) return <Box key={'e'+i} />;
            const date=new Date(y,m,d), played=(byDay[keyOf(date)]||[]).length>0;
            const isPicked=keyOf(date)===keyOf(picked), isToday=keyOf(date)===keyOf(today);
            return (
              <ButtonBase key={d} onClick={()=>setPicked(date)} aria-label={date.toDateString()+(played?', games played':'')}
                sx={{aspectRatio:'1 / 1',maxHeight:52,borderRadius:3,flexDirection:'column',gap:.25,fontSize:15,fontWeight:isToday?700:500,
                  border:'2px solid',borderColor:isPicked?'success.main':'transparent',
                  bgcolor:isToday?'primary.main':'rgba(255,255,255,.03)',color:isToday?'primary.contrastText':'text.primary',
                  transition:'background-color .15s, border-color .15s',
                  '&:hover':{bgcolor:isToday?'#f0c36a':'rgba(255,255,255,.09)'}}}>
                {d}
                <Box sx={{width:6,height:6,borderRadius:'50%',bgcolor:played?(isToday?'primary.contrastText':'success.main'):'transparent'}} />
              </ButtonBase>
            );
          })}
        </Box>

        {/* games on the picked day */}
        <Box sx={{display:'flex',alignItems:'baseline',justifyContent:'space-between',mb:1}}>
          <Typography sx={{fontWeight:600}}>{picked.toLocaleDateString(undefined,{weekday:'long',day:'numeric',month:'long'})}</Typography>
          <Typography variant="body2" color="text.secondary">{games.length+(games.length===1?' game':' games')}</Typography>
        </Box>
        <Box sx={{display:'flex',flexDirection:'column',gap:1}}>
          {games.length?games.map((x,i)=>{
            const t=new Date(Math.floor(x.id)).toLocaleTimeString(undefined,{hour:'2-digit',minute:'2-digit'});
            const deltas=['w','b'].filter(c=>x.dl&&x.dl[c]!=null);
            return (
              <Box key={i} sx={{display:'flex',alignItems:'center',gap:1.5,p:1.25,borderRadius:2.5,bgcolor:'#142029',border:'1px solid',borderColor:'divider'}}>
                <Box sx={{flex:'none',minWidth:48,textAlign:'center',py:.75,borderRadius:2,fontWeight:700,fontSize:14,
                  bgcolor:x.r==='Draw'?'rgba(143,161,176,.18)':'rgba(233,180,76,.16)',color:x.r==='Draw'?'text.secondary':'primary.main'}}>{score(x.r)}</Box>
                <Box sx={{minWidth:0,flex:1}}>
                  <Typography noWrap sx={{fontSize:14,fontWeight:600}}>{(x.w||'White')+' vs '+(x.b||'Black')}</Typography>
                  <Typography noWrap sx={{fontSize:12,color:'text.secondary'}}>{x.msg+' · '+x.n+' moves'+(x.t?' · '+x.t+' min':'')+' · '+t}</Typography>
                  {deltas.length>0&&(
                    <Box sx={{display:'flex',gap:1,mt:.25,flexWrap:'wrap'}}>
                      {deltas.map(c=>(
                        <Typography key={c} component="span" sx={{fontSize:12,fontWeight:600,color:x.dl[c]>=0?'success.main':'error.light'}}>
                          {(c==='w'?(x.w||'White'):(x.b||'Black'))+' '+sgn(x.dl[c])}
                        </Typography>
                      ))}
                    </Box>
                  )}
                </Box>
              </Box>
            );
          }):<Typography variant="body2" color="text.secondary">No games on this day.</Typography>}
        </Box>
      </Box>
    </div>
  );
}