var findString;

$(document).ready(function() {
  var all = [];
  var online = [];
  var offline = [];
  var state = 'all';

  var channelArray = ["nocopyrightsounds", "noobs2ninjas", "FreeCodeCamp", "beohoff", "brunofin", "comster404", "habathcx", "robotcaleb", "storbeck", "terakilobyte", "thomasballinger"];

  var loadChannels = function() {
    var baseURL = "https://api.twitch.tv/kraken/streams/";

    //ready the display
    $('#channelList').empty();
    state = 'all';
    document.getElementById('triangle1').style.display = 'flex';
    document.getElementById('triangle2').style.display = 'none';
    document.getElementById('triangle3').style.display = 'none';

    //get twitch info
    for (var i = 0; i < channelArray.length; i++) {
      var twitchURL = baseURL + channelArray[i] + "?callback=?";

      //set up a closure for the callback
      function displayChannel() {
        var channelName = channelArray[i];
        return (function(data) {
          var display = '<li><i class="fa';
          if (data.status === 422) {
            display = display + ' fa-medkit"></i>   ' + channelName + '</li><em>' + 'this channel has gone missing' + '</em>';
            all.push(display);
          } else if (data.stream === null) {
            display = display + ' fa-bed"></i>   <a href="http://www.twitch.tv/' + channelName + '" target="_blank">' + channelName + '</a>' + '</li><em>currently offline</em>';
            //save to display in offline list
            offline.push(display);
            all.push(display);
          } else {
            display = display + ' fa-television"></i>   <a href="http://www.twitch.tv/' + channelName + '" target="_blank">' + channelName + '</a>' + '</li><em>' + 'now streaming ' + data.stream.game + '</em>';
            //save to display in online list
            online.push(display);
            all.push(display);
          }
          $(display).appendTo('#channelList');
        });
      }

      var displayCallback = displayChannel();
      $.getJSON(twitchURL, displayCallback);
    }
  };

  document.getElementById('all').onclick = function() {
    state = 'all';
    document.getElementById('triangle1').style.display = 'flex';
    document.getElementById('triangle2').style.display = 'none';
    document.getElementById('triangle3').style.display = 'none';

    $('#channelList').empty();
    for (i = 0; i < all.length; i++) {
      $(all[i]).appendTo('#channelList');
    }
  };

  document.getElementById('online').onclick = function() {
    state = 'online';
    document.getElementById('triangle2').style.display = 'flex';
    document.getElementById('triangle1').style.display = 'none';
    document.getElementById('triangle3').style.display = 'none';

    $('#channelList').empty();
    for (var i = 0; i < online.length; i++) {
      $(online[i]).appendTo('#channelList');
    }
  };

  document.getElementById('offline').onclick = function() {
    state = 'offline';
    document.getElementById('triangle3').style.display = 'flex';
    document.getElementById('triangle1').style.display = 'none';
    document.getElementById('triangle2').style.display = 'none';

    $('#channelList').empty();
    for (i = 0; i < offline.length; i++) {
      $(offline[i]).appendTo('#channelList');
    }
  };

  document.getElementById('reload').onclick = function() {
    all = [];
    online = [];
    offline = [];
    loadChannels();
  };

  loadChannels();
    
  findString = function(userStr) {
    var searchArray;
    var resultArray = [];

    if (state === 'all') {
      searchArray = all;
    } else if (state === 'online') {
      searchArray = online;
    } else {
      searchArray = offline;
    }

    for (i = 0; i < searchArray.length; i++) {
      if (searchArray[i].search(userStr) != -1) {
        resultArray.push(searchArray[i])
      }
    }
    console.log(userStr);
    console.log(resultArray);

    $('#channelList').empty();
    console.log("HERE resultArray.length=", resultArray.length);
    for (j = 0; j < resultArray.length; j++) {
      $(resultArray[j]).appendTo('#channelList');
    }
  return false;
  };
});