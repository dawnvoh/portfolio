var quoteArray = [
  "We can do hard things. ~Glennon Doyle Melton",
  "If there is no struggle, there is no progress. ~Frederick Douglas",
  "When you look in the mirror, I hope you see what's inside... and that you are beautiful inside and out. ~Sara", 
  "Travel is fatal to prejudice, bigotry, and narrow mindedness. ~Mark Twain",
  "A flower does not think of competing with the flower next to it. It just blooms.",
  "A ship in port is safe, but that is not what ships are for. Sail out to sea and do new things. ~Grace Hopper",
  "With life as short as a half taken breath, don't plant anything but love. ~Rumi",
  "Fear is the cheapest room in the house. I would like to see you living In better conditions. ~ Hafiz",
  "The words you speak become the house you live in. ~ Hafiz",
  "Be selective with your battles. Sometimes peace is better than being right.",
  "What's the Best that could happen?",
  "Little by little, one travels far. ~J.R.R. Tolkien",
  "If you don't have time to do it right, when will you have time to do it over?",
  "Comparison is the thief of joy.",
  "The highest form of wisdom is kindness.",
  "Something marvelous is always happening. We just have to choose to see it. ~Katrina Mayer",
  "Gratitude is the path to abundance.",
  "Beware the barrenness of a busy life. ~Socrates",
  "Forgiveness is not an occasional act, it is a constant attitude. ~Martin Luther King, Jr.",
  "People generally see what they look for, and hear what they listen for. ~To Kill A Mockingbird",
  "Everyone is a genius. But if you judge a fish by its ability to climb a tree, it will live its whole life believing it is stupid. ~Albert Einstein",
  "No road is long with good friends.",
  "Imperfection is a form of freedom. ~Anh Ngo",
  "The two best times to keep your mouth shut are when you are swimming and when you are angry.",
  "Don't look back. You're not going that way.",
  "When you throw dirt, you lose ground.",
  "Don't judge a man until you've walked two moons in his moccasins. ~Walk Two Moons",
  "At first glance it may appear too hard. Look again. Always look again.",
  "I believe everyone else my age is an adult, whereas I am merely in disguise. ~Margaret Atwood"];

var min = 0;
var max = quoteArray.length;

function getQuote() {
  //get a random whole number in the range of the quote array
  var i = Math.floor(Math.random() * max);
  
  //display that quote
 document.getElementById("quote-text").innerHTML = quoteArray[i];
}