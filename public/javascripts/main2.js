if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw1.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

console.log(document.getElementById("restaurants"));
function doScaledTimeout(i, node) {
   setTimeout(function(){
     document.getElementById("restaurants").appendChild(node).className = "restaurant clearfix animated fadeInUp";
   }, 100 * i);
 }

$( document ).ready(function() {
  $('#submit').click(function(event){
    var budget = $('[name="budget"]').val();
    $('#empty').hide();
    $('#restaurants').html("");
    $('#loader').show();
    $.get('/results', {budget:budget}, function(data){
      $('#loader').hide();
      $(data).each(function(index){
        doScaledTimeout(index, this);
      });
    });
  });
});
