$(document).ready(function() {
  var numStories = 60;
  
  function newsCallback(data) {
    //console.log(data);
    if (data.length < numStories) {
      numStories = data.length;
    }
    
    for (i=0; i < numStories; i++) {
      var story = data[i];
      var date = new Date(story.timePosted);
      //var image = (story.image!='') ? story.image : story.author.picture;
      var image = story.author.picture;
      var headline = story.headline;
      if (headline.length > 50) {
          headline = headline.substring(0,47) + "...";
      }
      var name = story.author.username;
      if (name.length > 14) {
          name = name.substring(0,11) + "...";
      }
      var profile = "http://www.freecodecamp.com/" + story.author.username;
      var upvotes = story.upVotes.length;
      
      //add date
      var display = "<div class='newsBox'><div class='dateBox'>" + date.toDateString() + "</div>";
      //add image
      display += "<img class='picture' src='" + image + "'>"
      //add headline
      display += "<a href='" + story.link + "' target='_blank'><strong>" + headline + "</strong></a>"
      //add user and upvotes
      display += "<div class='infoBox'><div class='user'>From: <a href='" + profile + "' target='_blank'>" + name + "</a></div><div class='upvoteBox'>Upvotes: " + upvotes + "</div></div>";
      $(display).appendTo('#newsArea');
    }
  }
 
  $.getJSON("http://www.freecodecamp.com/news/hot", newsCallback);

}); //end document ready
