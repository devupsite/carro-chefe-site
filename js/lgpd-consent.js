(function(){
  var b=document.getElementById('lgpd-banner');
  if(!b)return;
  if(!localStorage.getItem('cc_consent')){setTimeout(function(){b.classList.add('visible');},1200);}
  document.getElementById('lgpd-accept').addEventListener('click',function(){localStorage.setItem('cc_consent','accepted');b.classList.remove('visible');});
  document.getElementById('lgpd-decline').addEventListener('click',function(){localStorage.setItem('cc_consent','declined');b.classList.remove('visible');});
}());
