// GL, CPU, MODES, LEVELS, CLOCKS, THEMES, PIECE_STYLES, PREVIEW, PTS

export const GL={P:'♟',N:'♞',B:'♝',R:'♜',Q:'♛',K:'♚'};
export const PTS={P:1,N:3,B:3,R:5,Q:9};
export const CPU={0:['Computer (Easy)',800],2:['Computer (Medium)',1200],3:['Computer (Hard)',1600]};

/* setup-screen options */
export const MODES=[['2p','Two players','Pass and play'],['cpu','vs Computer','Play the engine']];
export const LEVELS=[[0,'Easy','rated 800'],[2,'Medium','rated 1200'],[3,'Hard','rated 1600']];
export const CLOCKS=[[0,'No clock',''],[3,'3 min','each'],[5,'5 min','each'],[10,'10 min','each']];
export const THEMES=[['blue','Blue'],['green','Green'],['wood','Wood'],['dark','Dark'],['bg','Black & white']];
export const PIECE_STYLES=[['classic','Classic'],['bold','Bold outline'],['tone','Gold and navy']];
export const PREVIEW=['wK','bQ','wN','bR','bP','wB','bN','wP'];