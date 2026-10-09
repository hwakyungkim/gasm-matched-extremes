// Black-and-white version of the Example 4.4 lattice (Figure 1 of the LAA submission).
import {hasse} from './hasse-tikz.mjs';
import {writeFileSync} from 'fs';
const B=String.fromCharCode(92);
const one=(A)=>A[0].every((_,j)=>A.reduce((s,r)=>s+(r[j]!==0),0)===1);
const res=hasse('-+-+-','-+-',{mode:'mat',dx:2.15,dy:1.9,labelIL:true,levels:true,levelGap:1.55,lw:'0.6pt',edge:'black!55',
  nodeStyle:(k,A,a)=>{let s='';if(one(A))s+=',fill=black!12';if(k===a.Ik||k===a.Lk)s+=',line width=1.4pt';return s;}});
const doc=[B+'documentclass[border=2pt]{standalone}',B+'usepackage{amsmath}',B+'usepackage{tikz}',B+'begin{document}',res.tex,B+'end{document}',''].join('\n');
writeFileSync(process.argv[2],'% Figure 1 (Example 4.4, the 41-element lattice), black and white.\n'+doc);
console.log(res.size,res.rank);
