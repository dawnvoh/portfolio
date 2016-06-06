$(document).ready(function () {
 
  var initialClick = true;
  var isPaused = true;
  var inSession = true;  //false===on break
  
  var sessionLen = $("#session-len").html();  //minutes
  var breakLen = $("#break-len").html();  //minutes
  var countSec = 0;  //seconds
  
  //this line seems to be necessary to avoid creating multiple instances
  var $clock = $('#countdown').countdown(0);
  
  function myCountdown(countTime) {
    
    $clock.countdown(countTime)
      .on('update.countdown', 
        function(event) {
          //update display
          $(this).html(event.strftime('%M:%S'));
          //animation?

          //save countdown for pausing, since 'stop' callback isn't firing
          if (isPaused) {
            countSec = (event.offset.minutes*60) 
                      + event.offset.seconds;
            $("#countdown").countdown('pause');
            $("#timer").css("opacity", 0.4);
          }
        })
   /* This callback doesn't seem to get Called Back.
        .on('stop.countdown', 
          function(event) {
            isPaused = true;
            //timer was paused, save countdown information
            countSec = (event.offset.minutes*60) 
                        + event.offset.seconds;
          })
    */
      .on('finish.countdown',    
        function(event) {
          //play sound
          document.getElementById("chirp").play();

          //transition between session and break
          var bgColor = "#ffffff";           
          if (inSession) {
            //we are now on break
            countSec = breakLen*60;
            inSession = false;
            bgColor = "#CF143A";
          }            
          else {
            //begin new session
            countSec = sessionLen * 60;
            inSession = true;
            bgColor = "#40DBE5";
          }

          //change background color and start timer
          $("#timer").css("background-color", bgColor);
          dateTime = new Date();
          countTime = dateTime.getTime()
                      + (countSec * 1000);   //milliseconds
          isPaused = false;
          $clock.countdown(countTime);
        });
  }
  
  //on click, get state information, and pause current timer if needed
  $("#timer").click(function(event) {
    
    if (initialClick) {
      initialClick = false;
      isPaused = false;
      var dateTime = new Date();
      countSec = sessionLen*60;
      var countTime = dateTime.getTime()
                    + (countSec*1000);  //milliseconds
      myCountdown(countTime);  //create only one instance
    }  
    else if (isPaused === true) {
    //we were paused - unpause and start countdown
      isPaused = false;
      $("#timer").css("opacity", 0.7);
      
      var dateTime = new Date();
      var countTime = dateTime.getTime()
                    + (countSec*1000);    //milliseconds
      $clock.countdown(countTime);
    }
    else {
    //if timer wasn't paused, then we need to. Do handling in update callback, though.
      isPaused = true;
    }
  });
 
  $("#session-decrease").click(function() {
    if (sessionLen > 1) {
      sessionLen--;
      $("#session-len").html(sessionLen);
    }
  });

  $("#session-increase").click(function() { 
    if (sessionLen < 60) {
      sessionLen++;
      $("#session-len").html(sessionLen);
    }
  });

  $("#break-decrease").click(function() { 
    if (breakLen > 1) {
      breakLen--;
      $("#break-len").html(breakLen);
    }
  });

  $("#break-increase").click(function() {
    if (breakLen < 60) {
      breakLen++;
      $("#break-len").html(breakLen);
    }
  });
});
