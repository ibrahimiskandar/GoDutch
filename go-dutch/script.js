(function(){
var SYM={AZN:'₼',USD:'$'},KEY='go-dutch-v1';
var S={people:[],rate:1.7,view:'AZN'};
try{var raw=localStorage.getItem(KEY);if(raw){var p=JSON.parse(raw);if(p&&Array.isArray(p.people)){S=p}}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function id(){return Date.now().toString(36)+Math.random().toString(36).slice(2,7)}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function toView(a,c){var r=S.rate>0?S.rate:1;if(c===S.view)return a;return c==='USD'?a*r:a/r}
function fmt(v,c){return v.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' '+SYM[c||S.view]}
function total(p){return p.exp.reduce(function(s,e){return s+toView(e.amt,e.cur)},0)}
function $(i){return document.getElementById(i)}
function part(e){var ids=Array.isArray(e.w)?e.w.filter(function(k){return S.people.some(function(p){return p.id===k})}):[];return ids.length?ids:S.people.map(function(p){return p.id})}
function shareTag(e){var ids=part(e);if(ids.length===S.people.length)return '';var nm=S.people.filter(function(p){return ids.indexOf(p.id)>-1}).map(function(p){return esc(p.name)});return ' <small class="for">(shared by '+nm.join(', ')+')</small>'}
function whoBox(pid){return '<div class="who"><span>Shared by</span>'+S.people.map(function(q){return '<label><input type="checkbox" class="w'+pid+'" value="'+q.id+'" checked> '+esc(q.name)+'</label>'}).join('')+'</div>'}

function render(){
  $('vAZN').setAttribute('aria-pressed',S.view==='AZN');
  $('vUSD').setAttribute('aria-pressed',S.view==='USD');
  $('rate').value=S.rate;
  var h='';
  S.people.forEach(function(p){
    h+='<div class="card"><div class="head"><div><b>'+esc(p.name)+'</b><div class="tot">Spent '+fmt(total(p))+'</div></div><button class="x" data-rp="'+p.id+'" aria-label="Remove '+esc(p.name)+'">Remove</button></div><ul>';
    if(!p.exp.length)h+='<li class="empty">No expenses yet</li>';
    p.exp.forEach(function(e){h+='<li><span>'+esc(e.note||'Expense')+shareTag(e)+'</span><span>'+fmt(e.amt,e.cur)+' <button class="x" data-re="'+p.id+'|'+e.id+'" aria-label="Delete expense">✕</button></span></li>'});
    h+='</ul><div class="row"><input type="text" inputmode="decimal" placeholder="Amount" id="a'+p.id+'" aria-label="Amount"><select id="c'+p.id+'" aria-label="Currency"><option>AZN</option><option>USD</option></select><input type="text" id="n'+p.id+'" placeholder="What for? (optional)" maxlength="60" aria-label="Note">'+whoBox(p.id)+'<button data-ae="'+p.id+'">Add expense</button></div></div>';
  });
  $('people').innerHTML=h;
  summary();
}

function summary(){
  var n=S.people.length,o=$('out');
  if(n<2){o.innerHTML='<p class="empty">Add at least two people to see who owes what.</p>';return}
  var tots=S.people.map(total),sum=tots.reduce(function(a,b){return a+b},0),owed={};
  S.people.forEach(function(p){owed[p.id]=0});
  S.people.forEach(function(p){p.exp.forEach(function(e){var ids=part(e),v=toView(e.amt,e.cur);ids.forEach(function(k){owed[k]+=v/ids.length})})});
  var bal=S.people.map(function(p,i){return {name:p.name,sp:tots[i],own:owed[p.id],v:Math.round((tots[i]-owed[p.id])*100)/100}});
  var h='<div class="facts"><span>Total spent <b>'+fmt(sum)+'</b></span></div>';
  var cr=bal.filter(function(b){return b.v>0.004}).map(function(b){return {name:b.name,v:b.v}}).sort(function(a,b){return b.v-a.v});
  var db=bal.filter(function(b){return b.v<-0.004}).map(function(b){return {name:b.name,v:-b.v}}).sort(function(a,b){return b.v-a.v});
  var i=0,j=0,cnt=0;
  while(i<db.length&&j<cr.length){
    var m=Math.min(db[i].v,cr[j].v);
    if(m>0.004){h+='<div class="pay"><span>'+esc(db[i].name)+' pays '+esc(cr[j].name)+'</span><strong>'+fmt(m)+'</strong></div>';cnt++}
    db[i].v-=m;cr[j].v-=m;
    if(db[i].v<0.005)i++;
    if(cr[j].v<0.005)j++;
  }
  if(!cnt)h+='<p class="empty">Everyone is even. Nobody owes anything.</p>';
  h+='<div class="bal">';
  bal.forEach(function(b){h+='<span class="chip">'+esc(b.name)+' (paid '+fmt(b.sp)+', share '+fmt(b.own)+'): <b class="'+(b.v>0.004?'pos':b.v<-0.004?'neg':'')+'">'+(b.v>0?'gets back ':b.v<0?'owes ':'even ')+(Math.abs(b.v)>0.004?fmt(Math.abs(b.v)):'')+'</b></span>'});
  o.innerHTML=h+'</div>';
}

function addPerson(){
  var el=$('pname'),nm=el.value.trim();
  if(!nm){el.focus();return}
  S.people.push({id:id(),name:nm,exp:[]});el.value='';save();render();el.focus();
}
$('addp').onclick=addPerson;
$('pname').onkeydown=function(e){if(e.key==='Enter')addPerson()};
$('vAZN').onclick=function(){S.view='AZN';save();render()};
$('vUSD').onclick=function(){S.view='USD';save();render()};
$('rate').onchange=function(){var v=parseFloat(this.value);if(v>0){S.rate=v;save()}render()};
$('reset').onclick=function(){if(S.people.length&&!confirm('Remove all people and expenses?'))return;S.people=[];save();render()};
$('people').onclick=function(e){
  var t=e.target.closest('button');if(!t)return;
  if(t.dataset.rp){S.people=S.people.filter(function(p){return p.id!==t.dataset.rp})}
  else if(t.dataset.re){var k=t.dataset.re.split('|');S.people.forEach(function(p){if(p.id===k[0])p.exp=p.exp.filter(function(x){return x.id!==k[1]})})}
  else if(t.dataset.ae){
    var pid = t.dataset.ae;
var a = $('a' + pid);
var raw = a.value.trim();

// Allow only positive numbers with up to 2 decimal places
if (!/^\d+(\.\d{1,2})?$/.test(raw) || Number(raw) <= 0) {
    alert('Warning: Please enter a valid numeric amount (e.g. 12 or 12.50).');
    a.focus();
    return;
}

var amt = Number(raw);
    var w=[].slice.call(document.querySelectorAll('.w'+pid+':checked')).map(function(x){return x.value});
    if(!w.length){alert('Tick at least one person who shared this expense.');return}
    S.people.forEach(function(p){if(p.id===pid)p.exp.push({id:id(),amt:amt,cur:$('c'+pid).value,note:$('n'+pid).value.trim(),w:w})});
  } else return;
  save();render();
};
render();
})();
