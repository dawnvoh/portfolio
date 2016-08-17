$(document).ready(function() {
  function convertSize(bytes) {
    var sizeStr = "";
    if (bytes < 1024) {
      sizeStr = bytes.toString() + " bytes";
    }
    else if (bytes < 1048576) {
      sizeStr = (bytes/1024).toFixed(0).toString() + " KB";
    }
    else {
      sizeStr = (bytes/1048576).toFixed(0).toString() + " MB";
    }
    return sizeStr;
  }
  
  function getMonth(month){
    return {0: "January",
            1: "February",
            2: "March",
            3: "April",
            4: "May",
            5: "June",
            6: "July",
            7: "August",
            8: "September",
            9: "October",
            10: "November",
            11: "December"
           }[month];
  }  
  function convertTimestamp(time) {
    var date = new Date(time);
    
    var hour = date.getUTCHours();
    if (hour < 10) { hour = '0' + hour; }
    
    var minutes = date.getUTCMinutes();
    if (minutes < 10) { minutes = '0' + minutes; }
    
    var month = date.getUTCMonth();
    month = getMonth(month);
    
    var timestamp = hour + ':' + minutes + ', ' + date.getUTCDate() + ' ' + month + ' ' + date.getUTCFullYear();
    
    return timestamp;
  }
  
  function displaySearchHit(obj) {
    var title = '<a href="https://en.wikipedia.org/wiki/' + obj.title + '" target="_blank">' + '<h4>'+ obj.title +'</h4></a>';
    var snippet = '<p>' + obj.snippet + '</p>';
    var size = convertSize(obj.size);
    var timestamp = convertTimestamp(obj.timestamp);
    
    var info = '<p class="searchHitData">' + size + ' (' + obj.wordcount + ' words) - ' + timestamp + '</p>';
    
    var newHit = '<li>' + title + snippet + info + '</li>';
    $('#newsArea').append(newHit);
    
  }
  function parseSearchHits(data) {
    console.log(data); 
    //data.query.search[i].size | snippet | timestamp | title | wordcount

    var info = "";
    var numHits = data.query.search.length;
    if (numHits > 0) {
      info = "Showing " + numHits + " of " + data.query.searchinfo.totalhits + " pages:";
    }
    else {
      info = "Sorry, no matches were found.";
    }
    $('#hitCount').html(info);
  
    $('#newsArea').empty();
    for (var i = 0; i < numHits; i++) {
      displaySearchHit(data.query.search[i]);
    }
  };
  
  function getData(searchStr) {
    var url = 'https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&format=json&srsearch=' + searchStr + '&srlimit=10&callback=?';
     
    $.getJSON(url, parseSearchHits);
    console.log("here");
  }
  
  function getSearch() {
    var searchString = document.forms["searchBar"]["searchText"].value;
    
    getData(searchString);
  }
  
  $('#searchIcon').click(function() {
    getSearch();
    return false;
  });
  
  // $("#searchText").keypress(function(event){ 
  //   if (event.which == 13) {
  //     getSearch();
  //   }
  // });
  
  $('#searchBar').on('submit',function(){
    getSearch();
    return false;
  });

}); //end document ready
