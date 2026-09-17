/* Pure prototype calculations: no network calls or production credentials. */
(function(root){
const range=(a,b)=>Array.from({length:b-a+1},(_,i)=>a+i);
const groups=[
 {id:'pk10',name:'PK10',icon:'icon_pk10.png',games:['比特币一分赛车','比特币三分赛车','比特币飞艇','极速赛车','一分赛车','三分赛车','IG赛车','IG飞艇','新幸运飞艇','幸运飞艇','澳洲赛车']},
 {id:'ssc',name:'时时彩',icon:'icon_ssc.png',games:['比特币一分','极速','一分','三分','IG','河内一分','河内五分']},
 {id:'x115',name:'11选5',icon:'icon_115.png',games:['极速','三分','罗马','巴黎']},
 {id:'k3',name:'快3',icon:'icon_k3.png',games:['秒速快3','一分快3','极速快3','三分快3','马德里快3','莫斯科快3']},
 {id:'3d',name:'3D',icon:'icon_3d.png',games:['极速3D','三分3D','日内瓦3D','维也纳3D','福彩3D','排列五']}
];
const racePositions=['冠军','亚军','第三名','第四名','第五名','第六名','第七名','第八名','第九名','第十名'];
const digitPositions=['万位','千位','百位','十位','个位'];
function play(label,rows,opts={}){return {label,rows,values:range(0,9),mode:'product',prize:1980,...opts}}
const configs={
 pk10:['猜冠军','猜冠亚军','猜前三名','猜前四名','猜前五名','定位胆'].map((label,i)=>play(label,racePositions.slice(0,i===5?10:i+1),{values:range(1,10),mode:i===5?'sum':'unique',prize:[19.8,178,1425,9980,59800,19.8][i],subs:[label]})),
 ssc:[play('五星',digitPositions,{prize:198000}),play('后四',digitPositions.slice(1),{prize:19800}),play('前四',digitPositions.slice(0,4),{prize:19800}),play('后三',digitPositions.slice(2)),play('中三',digitPositions.slice(1,4)),play('前三',digitPositions.slice(0,3)),play('后二',digitPositions.slice(3),{prize:198}),play('前二',digitPositions.slice(0,2),{prize:198}),play('一星',digitPositions,{mode:'sum',prize:19.8}),play('不定位',['选号'],{mode:'sum',prize:5.3}),play('任选',digitPositions,{mode:'optional',choose:2,prize:198}),play('大小单双',['十位','个位'],{values:['大','小','单','双'],prize:7.8}),play('龙虎',['万千'],{values:['龙','虎','和'],mode:'sum',prize:3.96}),play('棋牌',[],{unsupported:true})],
 x115:[play('三码',['第一位','第二位','第三位'],{values:range(1,11),mode:'unique',prize:1960,subs:['前三直选','前三组选','前三组选胆拖']}),play('二码',['第一位','第二位'],{values:range(1,11),mode:'unique',prize:218,subs:['前二直选','前二组选']}),play('不定位',['选号'],{values:range(1,11),mode:'sum',prize:7.2}),play('定位胆',['第一位','第二位','第三位'],{values:range(1,11),mode:'sum',prize:21.8}),play('趣味性',[],{unsupported:true}),play('任选复式',['选号'],{values:range(1,11),mode:'choose',choose:2,prize:6,subs:['任选二中二','任选三中三','任选四中四','任选五中五','任选六中五','任选七中五','任选八中五']})],
 k3:[play('和值',['和值'],{values:range(3,18),mode:'sum',prize:198}),play('二同号单选',['同号','不同号'],{values:range(1,6),mode:'unique',prize:71}),play('二同号复选',['同号'],{values:['11','22','33','44','55','66'],mode:'sum',prize:14}),play('二不同号',['选号'],{values:range(1,6),mode:'choose',choose:2,prize:7}),play('三同号单选',['选号'],{values:['111','222','333','444','555','666'],mode:'sum',prize:198}),play('通选',['选号'],{values:['三同号通选'],mode:'sum',prize:33}),play('三不同号',['选号'],{values:range(1,6),mode:'choose',choose:3,prize:33}),play('三连号通选',['选号'],{values:['三连号通选'],mode:'sum',prize:8}),play('猜必出',['选号'],{values:range(1,6),mode:'sum',prize:4}),play('猜必不出',['选号'],{values:range(1,6),mode:'sum',prize:3})],
 '3d':[play('三星',['百位','十位','个位']),play('二星',['十位','个位'],{prize:198}),play('定位胆',['百位','十位','个位'],{mode:'sum',prize:19.8}),play('不定位',['选号'],{mode:'sum',prize:5.3})]
};
function choose(n,k){if(n<k||k<0)return 0;let r=1;for(let i=1;i<=k;i++)r=r*(n-i+1)/i;return Math.round(r)}
function uniqueCount(rows){let memo=new Map();function walk(i,mask){if(i===rows.length)return 1;let key=i+':'+mask;if(memo.has(key))return memo.get(key);let n=0;for(const value of rows[i]){let bit=1<<Number(value);if(!(mask&bit))n+=walk(i+1,mask|bit)}memo.set(key,n);return n}return rows.length?walk(0,0):0}
function count(rows,cfg){if(cfg.unsupported)return 0;let a=rows.map(r=>[...r]);if(cfg.mode==='sum')return a.reduce((n,r)=>n+r.length,0);if(cfg.mode==='choose')return choose(a[0]?.length||0,cfg.choose);if(cfg.mode==='optional'){let dp=Array(cfg.choose+1).fill(0);dp[0]=1;for(const row of a)for(let k=cfg.choose;k>0;k--)dp[k]+=dp[k-1]*row.length;return dp[cfg.choose]}if(cfg.mode==='unique')return uniqueCount(a);return a.length?a.reduce((n,r)=>n*r.length,1):0}
function amount(n,mult,unit){return Math.round(n*2*mult*unit*100)/100}
const model={groups,configs,range,choose,count,amount,racePositions,digitPositions};root.LotteryModel=model;if(typeof module!=='undefined')module.exports=model;
})(typeof window!=='undefined'?window:globalThis);
