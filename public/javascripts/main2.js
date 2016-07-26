if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw1.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

$( document ).ready(function() {
  $('#submit').click(function(event){
    var budget = $('[name="budget"]').val();
    $('#empty').hide();
    $('#restaurants').html("");
    $('#loader').show();
    $.get('/results', {budget:budget}, function(data){
      $('#loader').hide();
      $('#restaurants').html(data);
    });
  });
});
