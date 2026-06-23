(function(){
  var hdr=document.getElementById('hdr');
  window.addEventListener('scroll',function(){
    hdr.classList.toggle('s',window.scrollY>48);
  },{passive:true});
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click',function(){
      var a=this.nextElementSibling,open=this.classList.contains('open');
      document.querySelectorAll('.faq-q').forEach(function(x){
        x.classList.remove('open');
        x.nextElementSibling.classList.remove('open');
      });
      if(!open){this.classList.add('open');a.classList.add('open');}
    });
    q.addEventListener('keydown',function(e){
      if(e.key==='Enter'||e.key===' '){e.preventDefault();this.click();}
    });
  });
}());
