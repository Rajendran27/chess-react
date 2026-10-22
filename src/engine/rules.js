// move generation, check/mate/draw, SAN notation

const N8=[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
const D8=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
const inB=(r,c)=>r>=0&&r<8&&c>=0&&c<8;

export function init(){
  const b=Array.from({length:8},()=>Array(8).fill(null)), bk='RNBQKBNR';
  for(let c=0;c<8;c++){b[0][c]='b'+bk[c];b[1][c]='bP';b[6][c]='wP';b[7][c]='w'+bk[c];}
  return {b,turn:'w',cast:{wK:1,wQ:1,bK:1,bQ:1},ep:null,half:0};
}
function attacked(b,r,c,by){
  const d=by==='w'?1:-1;
  for(const dc of[-1,1]) if(inB(r+d,c+dc)&&b[r+d][c+dc]===by+'P') return true;
  for(const[x,y]of N8) if(inB(r+x,c+y)&&b[r+x][c+y]===by+'N') return true;
  for(const[x,y]of D8){
    if(inB(r+x,c+y)&&b[r+x][c+y]===by+'K') return true;
    let i=r+x,j=c+y;
    while(inB(i,j)){
      const p=b[i][j];
      if(p){ if(p[0]===by){const t=p[1]; if(t==='Q'||(t==='R'&&(!x||!y))||(t==='B'&&x&&y)) return true;} break; }
      i+=x;j+=y;
    }
  }
  return false;
}
function gen(s,r,c){
  const {b,cast,ep}=s,p=b[r][c],col=p[0],t=p[1],opp=col==='w'?'b':'w',out=[];
  const add=(i,j,f={})=>out.push({fr:r,fc:c,tr:i,tc:j,...f});
  if(t==='P'){
    const d=col==='w'?-1:1,st=col==='w'?6:1,last=col==='w'?0:7;
    const push=(i,j,f)=>add(i,j,i===last?{...f,promo:1}:f);
    if(!b[r+d][c]){ push(r+d,c); if(r===st&&!b[r+2*d][c]) add(r+2*d,c,{dbl:1}); }
    for(const dc of[-1,1]){
      const i=r+d,j=c+dc; if(!inB(i,j)) continue;
      if(b[i][j]&&b[i][j][0]===opp) push(i,j,{cap:1});
      else if(ep&&ep[0]===i&&ep[1]===j) add(i,j,{cap:1,enp:1});
    }
  } else if(t==='N'||t==='K'){
    for(const[x,y]of t==='N'?N8:D8){
      const i=r+x,j=c+y;
      if(inB(i,j)&&(!b[i][j]||b[i][j][0]===opp)) add(i,j,{cap:b[i][j]?1:0});
    }
    if(t==='K'&&c===4&&r===(col==='w'?7:0)&&!attacked(b,r,4,opp)){
      if(cast[col+'K']&&!b[r][5]&&!b[r][6]&&b[r][7]===col+'R'&&!attacked(b,r,5,opp)&&!attacked(b,r,6,opp)) add(r,6,{castle:'K'});
      if(cast[col+'Q']&&!b[r][1]&&!b[r][2]&&!b[r][3]&&b[r][0]===col+'R'&&!attacked(b,r,3,opp)&&!attacked(b,r,2,opp)) add(r,2,{castle:'Q'});
    }
  } else {
    for(const[x,y]of D8){
      if(t==='R'&&x&&y) continue; if(t==='B'&&(!x||!y)) continue;
      let i=r+x,j=c+y;
      while(inB(i,j)){ if(b[i][j]){ if(b[i][j][0]===opp) add(i,j,{cap:1}); break; } add(i,j); i+=x;j+=y; }
    }
  }
  return out;
}
export function apply(s,m,promo='Q'){
  const b=s.b.map(r=>r.slice()),p=b[m.fr][m.fc],col=p[0];
  b[m.fr][m.fc]=null;
  if(m.enp) b[m.fr][m.tc]=null;
  b[m.tr][m.tc]=m.promo?col+promo:p;
  if(m.castle){ if(m.castle==='K'){b[m.fr][5]=b[m.fr][7];b[m.fr][7]=null;} else {b[m.fr][3]=b[m.fr][0];b[m.fr][0]=null;} }
  const cast={...s.cast};
  if(p[1]==='K'){cast[col+'K']=0;cast[col+'Q']=0;}
  const rk=(r,c)=>{if(r===7&&c===0)cast.wQ=0;if(r===7&&c===7)cast.wK=0;if(r===0&&c===0)cast.bQ=0;if(r===0&&c===7)cast.bK=0;};
  rk(m.fr,m.fc);rk(m.tr,m.tc);
  return {b,turn:col==='w'?'b':'w',cast,ep:m.dbl?[(m.fr+m.tr)/2,m.fc]:null,half:p[1]==='P'||m.cap?0:s.half+1};
}
export const kingPos=(b,col)=>{for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(b[r][c]===col+'K')return[r,c];};
export const inCheck=(s,col)=>{const[r,c]=kingPos(s.b,col);return attacked(s.b,r,c,col==='w'?'b':'w');};
export const legal=(s,r,c)=>gen(s,r,c).filter(m=>!inCheck(apply(s,m),s.b[r][c][0]));
export function allLegal(s){
  const o=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++) if(s.b[r][c]&&s.b[r][c][0]===s.turn) o.push(...legal(s,r,c));
  return o;
}
function insuff(b){
  const ps=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++) if(b[r][c]&&b[r][c][1]!=='K') ps.push([b[r][c][1],(r+c)%2]);
  if(!ps.length) return true;
  if(ps.length===1) return ps[0][0]==='N'||ps[0][0]==='B';
  return ps.every(p=>p[0]==='B'&&p[1]===ps[0][1]);
}
/* Can this colour still deliver mate? (used when the OTHER side runs out of time) */
export function canMate(b,col){
  let minors=0;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const p=b[r][c];
    if(!p||p[0]!==col) continue;
    if(p[1]==='P'||p[1]==='R'||p[1]==='Q') return true;
    if(p[1]==='N'||p[1]==='B') minors++;
  }
  return minors>=2;
}
/* En passant square only counts for repetition if an en passant capture is actually legal */
const epKey=s=>{
  if(!s.ep) return '';
  const r=s.ep[0]+(s.turn==='w'?1:-1);
  for(const dc of[-1,1]){
    const c=s.ep[1]+dc;
    if(inB(r,c)&&s.b[r][c]===s.turn+'P'&&legal(s,r,c).some(m=>m.enp)) return s.ep.join();
  }
  return '';
};
export const keyOf=s=>s.b.map(r=>r.map(x=>x||'-').join('')).join('/')+s.turn+Object.values(s.cast).join('')+epKey(s);
export function status(ns,keys){
  const chk=inCheck(ns,ns.turn);
  if(!allLegal(ns).length) return {chk,over:chk?(ns.turn==='w'?'Black':'White')+' wins by checkmate':'Draw by stalemate'};
  if(insuff(ns.b)) return {chk,over:'Draw: insufficient material'};
  if(ns.half>=100) return {chk,over:'Draw: fifty-move rule'};
  if(keys.filter(k=>k===keys[keys.length-1]).length>=3) return {chk,over:'Draw: threefold repetition'};
  return {chk,over:null};
}
export function san(s,m,st){
  const p=s.b[m.fr][m.fc],t=p[1],f=c=>String.fromCharCode(97+c);
  let x;
  if(m.castle) x=m.castle==='K'?'O-O':'O-O-O';
  else{
    let dis='';
    if(t==='P') dis=m.cap?f(m.fc):'';
    else if(t!=='K'){
      const rivals=allLegal(s).filter(o=>o.tr===m.tr&&o.tc===m.tc&&(o.fr!==m.fr||o.fc!==m.fc)&&s.b[o.fr][o.fc][1]===t);
      if(rivals.length){
        if(!rivals.some(o=>o.fc===m.fc)) dis=f(m.fc);
        else if(!rivals.some(o=>o.fr===m.fr)) dis=String(8-m.fr);
        else dis=f(m.fc)+(8-m.fr);
      }
    }
    x=(t==='P'?'':t)+dis+(m.cap?'x':'')+f(m.tc)+(8-m.tr)+(m.promo?'='+m.pr:'');
  }
  return x+(st.over&&st.over.includes('checkmate')?'#':st.chk?'+':'');
}