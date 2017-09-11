console.group('Tracker :');
console.log('--------');

var EVENT_LOG_URL = 'http://localhost:8081/eventlog/'
var data;
var didScroll = false;
var CurrentScroll = 0;

window.onscroll = doThisStuffOnScroll;

function doThisStuffOnScroll() {
    didScroll = true;
}

setInterval(function() {
    if(didScroll) {
        didScroll = false;

      	var NextScroll = window.pageYOffset || document.documentElement.scrollTop;

      	if (NextScroll > CurrentScroll) {
			data = {'event_type' : 'scroll_down'};
		}
		else {
			data = {'event_type' : 'scroll_up'};
		}
        sendEventData(data);
      	CurrentScroll = NextScroll;  //Updates current scroll position
    }
}, 1000);


var voteButtons = document.querySelectorAll('a[class^="vote-"]');
voteButtons.forEach(function (button) {
  addClickListenerForVote(button);
});


var searchButton = document.getElementsByClassName('js-search-submit')[0];
addClickListenerForSearch(searchButton);

var askQuestion = document.getElementsByClassName('aside-cta')[0];
if (askQuestion) {
  addGeneralClickListener(askQuestion.getElementsByClassName('btn-outlined')[0], 'ask_question');
}


function addGeneralClickListener(ele, type) {
  if (ele) {
    ele.addEventListener("click", function(event) {
        var data = { 
          event_type : type,
        };
        sendEventData(data);
    });
  }
}

function addClickListenerForVote(ele) {
  if (ele) {
    ele.addEventListener("click", function(event) {
        var isAnswer = ele.title && ele.title.includes('answer');
        var isQuestion = ele.title && ele.title.includes('question');
         
        var vote = ele.className.includes('vote-up-') ? 'up_vote' : 'down_vote';
      
        //var value = ele.previousElementSibling && ele.previousElementSibling.value;
        
        var value = ele.parentElement && ele.parentElement.firstElementChild.value;
        
        var data = { 
          event_type : vote,
          element : isAnswer ? 'answer' : isQuestion ? 'question' : 'unknown',
          value : value
        };
      
        sendEventData(data);
        
    }); 
  }
}

function addClickListenerForSearch(ele) {
  if (ele) {
    ele.addEventListener("click", function(event) {
      var value = ele.previousElementSibling && ele.previousElementSibling.value;
      var data = {
        event_type : 'search',
        value : value
      };
      sendEventData(data);
    });
  }
}

console.groupEnd();


function sendEventData(data) {
    data.url = window.location.href;
	chrome.runtime.sendMessage({
        method: 'POST',
        action: 'xhttp',
        url: EVENT_LOG_URL,
        data: data
    });
}
