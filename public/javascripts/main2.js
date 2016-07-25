if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw1.js').then(function(registration) {
    // Registration was successful
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

// function urlParam(){
//     var hashes = window.location.href.slice(window.location.href.indexOf('=') + 1).split('&');
//     return hashes;
// }

// function urlParam(){
//   var hashes = $('[name="budget"]').val();
//   return hashes;
// }
$('#submit').click(function(event){
  var budget = $('[name="budget"]').val();

  console.log(budget + " is your budget amount");

  $.get('/results', {budget:budget}, function(data){
    $('#loader').hide();
    $('#results').html(data);
  });
});
