import { createTheme } from '@mui/material/styles';

/* colours taken from the mockup: gold accent, green glow */
export default createTheme({
  palette:{
    mode:'dark',
    primary:{main:'#e9b44c',contrastText:'#17212b'},
    success:{main:'#3ddc84'},
    error:{main:'#e5484d'},
    // page background is the original flat dark blue (#101820); cards keep the darker teal
    background:{default:'#101820',paper:'#0f1f20'},
    text:{primary:'#e8edf1',secondary:'#8fa1b0'},
    divider:'rgba(255,255,255,.08)'
  },
  shape:{borderRadius:16},
  typography:{
    fontFamily:'system-ui,-apple-system,"Segoe UI",sans-serif',
    button:{textTransform:'none',fontWeight:600}
  },
  components:{
    // every card, bar and dialog gets a light top sheen and a soft shadow
    MuiPaper:{styleOverrides:{root:{
      backgroundImage:'linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,0))',
      '&.MuiPaper-outlined':{boxShadow:'0 6px 18px rgba(0,0,0,.25)'}
    }}}
  }
});