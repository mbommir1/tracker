chrome.runtime.onMessage.addListener(function(request, sender, callback) {
  if (request.action == "xhttp") {

    var xhttp = new XMLHttpRequest();
        var method = request.method ? request.method.toUpperCase() : 'GET';

        xhttp.onload = function() {
            callback(xhttp.responseText);
        };
        xhttp.onerror = function() {
            // Do whatever you want on error. Don't forget to invoke the
            // callback to clean up the communication port.
            callback();
        };
        xhttp.open(method, request.url, true);
        if (method == 'POST') {
            xhttp.setRequestHeader('Content-Type', 'application/json');
        }
        console.log(chrome.cookies.get({url: 'http://localhost:8081/', name: 'user'}, function (cookie) {
          if (cookie.value)
            request.data.user = cookie.value;
          xhttp.send(JSON.stringify({data : request.data}));
          return true;
        }));
  }
});