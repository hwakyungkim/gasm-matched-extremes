// Theorem 4.3 of gasm_match_01 (one entry per column for m <= n), checked
// directly: I and L are rebuilt from hi / lo by inverse differences, checked
// to be members of the class, and every column is checked to hold exactly one
// nonzero entry, equal to -u_j. Also reports how often the property FAILS
// for m > n (where it must hold for rows instead).
import {bounds} from './hasse-tikz.mjs';
const bits=(k,t)=>{const a=[];for(let j=0;j<k;j++)a.push((t>>j)&1?1:-1);return a;};
function nonempty(u,v){const Vp=v.filter(x=>x>0).length,Vm=v.length-Vp,Up=u.filter(x=>x>0).length,Um=u.length-Up;
 let U=0;for(const x of u){U+=x<0?1:-1;if(U>Vm||U<-Vp)return false;}let V=0;for(const x of v){V+=x<0?1:-1;if(V>Um||V<-Up)return false;}return U===V;}
const inv=(S)=>S.map((r,i)=>r.map((x,j)=>x-(i?S[i-1][j]:0)-(j?r[j-1]:0)+(i&&j?S[i-1][j-1]:0)));
const alt=(seq)=>{let last=0;for(const x of seq){if(x!==0){if(last!==0&&x*last!==-1)return false;last=x;}}return true;};
const member=(A,u,v)=>A.every((r,i)=>alt([v[i],...r,v[i]])&&r.every(x=>x>=-1&&x<=1))&&u.every((uj,j)=>alt([uj,...A.map(r=>r[j]),uj]));
let classes=0,bad=0,notMember=0,colsMulti_mGTn=0,rowsBad_mGTn=0,cl2=0;
for(let m=1;m<=9;m++)for(let n=1;n<=9;n++){if((m+n)%2||m+n>16)continue;
 for(let tu=0;tu<(1<<n);tu++)for(let tv=0;tv<(1<<m);tv++){const u=bits(n,tu),v=bits(m,tv);if(!nonempty(u,v))continue;
  const {hi,lo}=bounds(u,v);const I=inv(hi),L=inv(lo);
  if(!member(I,u,v)||!member(L,u,v)){notMember++;continue;}
  const onePerCol=(A)=>u.every((uj,j)=>{const nz=A.map(r=>r[j]).filter(x=>x!==0);return nz.length===1&&nz[0]===-uj;});
  const onePerRow=(A)=>v.every((vi,i)=>{const nz=A[i].filter(x=>x!==0);return nz.length===1&&nz[0]===-vi;});
  if(m<=n){classes++;if(!onePerCol(I)||!onePerCol(L))bad++;}
  else{cl2++;if(!onePerCol(I)||!onePerCol(L))colsMulti_mGTn++;if(!onePerRow(I)||!onePerRow(L))rowsBad_mGTn++;}
 }}
console.log({classes_m_le_n:classes,violations:bad,notMember,classes_m_gt_n:cl2,
  m_gt_n_with_a_multi_entry_column:colsMulti_mGTn,m_gt_n_rows_violations:rowsBad_mGTn});
