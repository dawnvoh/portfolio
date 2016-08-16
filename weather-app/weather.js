$(document).ready(function() {
  
  var x = document.getElementById("location");
  var latitude = "";
  var longitude = "";
  
  var fahrenheit = true;
  var temp_F = "";
  var temp_C = "";
  
  var milesPerHour = true;
  var windspeedMiles = "";
  var windspeedKmph = "";
  var winddir = "";

  /* ---------- WEATHER functions ---------- */
  function displayTemperature() {
    if (fahrenheit) {
      $("#temperature").html(temp_F + "° F");
      //set button label for user to request Celcius
      $("#tempUnits").html("Celcius");
    } else {
      $("#temperature").html(temp_C + "° C");
      //set button label for user to request Fahrenheit
      $("#tempUnits").html("Fahrenheit");
    }
  }
  
  function displayWinds() {
    if (milesPerHour) {
      $("#winds").html(winddir + " " + windspeedMiles + "mi/h");
      //change button label for user to request Kilometers per hour
      $("#windUnits").html("Km/h");
    }
    else {
      $("#winds").html(winddir + " " + windspeedKmph + "km/h");
      //change button label for user to request miles per hour
      $("#windUnits").html("mi/h");
    }
  }
  
  function localWeatherCallback(localWeather) {
    temp_F = localWeather.data.current_condition[0].temp_F;
    temp_C = localWeather.data.current_condition[0].temp_C;
    winddir = localWeather.data.current_condition[0].winddir16Point;
    windspeedMiles = localWeather.data.current_condition[0].windspeedMiles;
    windspeedKmph = localWeather.data.current_condition[0].windspeedKmph;
      
    var newIcon = "";
console.log(localWeather.data.current_condition[0])
    switch (localWeather.data.current_condition[0].weatherCode) {
      case "395": /*moderate/heavy snow with thunder*/
      case "392": /*patchy light snow with thunder*/
      case "386": /*patchy light rain with thunder*/
      case "200": /*thundery outbreaks nearby*/
        newIcon = "<i class='wi wi-storm-showers'></i>";
        break;
      case "389": /*moderate/heavy rain with thunder*/
        newIcon = "<i class='wi wi-thunderstorm'></i>";
        break;
      case "377": /*moderate/heavy showers of ice pellets*/
      case "350": /*ice pellets*/
        newIcon = "<i class='wi wi-hail'></i>";
        break;
      case "374": /*light showers of ice pellets*/
      case "365": /*moderate/heavy sleet showers*/
      case "362": /*light sleet showers*/
      case "320": /*moderate/heavy sleet*/
      case "317": /*light sleet*/
      case "314": /*moderate/heavy freezing rain*/
      case "311": /*light freezing rain*/
      case "284": /*heavy freezing drizzle*/
      case "281": /*freezing drizzle*/
      case "185": /*patchy freezing drizzle nearby*/
      case "182": /*patchy sleet nearby*/
        newIcon = "<i class='wi wi-sleet'></i>";
        break;
      case "371": /*moderate/heavy snow showers*/
      case "368": /*light snow showers*/
      case "338": /*heavy snow*/
      case "335": /*patchy heavy snow*/
      case "332": /*moderate snow*/
      case "329": /*patchy moderate snow*/
      case "326": /*light snow*/
      case "323": /*patchy light snow*/
      case "227": /*blowing snow*/
      case "179": /*patchy snow nearby*/
        newIcon = "<i class='wi wi-snow'></i>";
        break;
      case "230": /*blizzard*/
        newIcon = "<i class='wi wi-snow-wind'></i>";
        break;
      case "359": /*torrential rain shower*/
      case "356": /*moderate/heavy rain showers*/
      case "308": /*heavy rain*/
      case "305": /*heavy rain at times*/
        newIcon = "<i class='wi wi-rain'></i>";
        break;
      case "302": /*moderate rain*/
      case "299": /*moderate rain at times*/
        newIcon = "<i class='wi wi-showers'></i>";
        break;
      case "353": /*light rain shower*/
      case "296": /*light rain*/
      case "293": /*patchy light rain*/
      case "266": /*light drizzle*/
      case "263": /*patchy light drizzle*/
      case "176": /*patchy rain nearby*/
      case "143": /*mist*/
        newIcon = "<i class='wi wi-sprinkle'></i>";
        break;
      case "260": /*freezing fog*/
      case "248": /*fog*/
      case "122": /*overcast*/
        newIcon = "<i class='wi wi-fog'></i>";
        break;
      case "119": /*cloudy*/
        newIcon = "<i class='wi wi-cloudy'></i>";
        break;
      case "116": /*partly cloudy*/
        newIcon = "<i class='wi wi-cloud'></i>";
        break;
      case "113": /*clear/sunny*/
      default:
        newIcon = "<i class='wi wi-day-sunny'></i>"
        break;
    }
    $("#currCond").html(newIcon);  
    $("#locale").html(localWeather.data.nearest_area[0].areaName[0].value);
    displayTemperature();
    displayWinds();
    $(".boxToFit").css("color", "black");
  }

  /*build input object for weather request*/
  var reqInput = {
    format: "json",
    num_of_days: 0,
    cc: "yes",
    includelocation: "yes",
    show_comments: "yes"
  };

  var baseApiURL = 'http://api.worldweatheronline.com/free/v2/';
  var myApiKey = 'f9415da8d95f3bad53ff9148a8d03';

  function JSONP_LocalWeather(input) {
    var url = baseApiURL + 'weather.ashx?q=' + input.query + '&format=' + input.format + '&num_of_days=' + input.num_of_days + '&cc=' + input.cc + '&includelocation=' + input.includelocation + '&show_comments=' + input.show_comments + '&key=' + myApiKey;

    $.getJSON(url, localWeatherCallback);
  }

  /* ---------- LOCATION functions ---------- */
  function usePositionGetWeather(position) {
    latitude = position.coords.latitude.toFixed(2).toString();
    longitude = position.coords.longitude.toFixed(2).toString();
    
    reqInput.query = latitude + "," + longitude;
    JSONP_LocalWeather(reqInput);
  }
  
  function showPosition(position) {
    x.innerHTML = latitude + ", " + longitude;	
  }

  function showError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        x.innerHTML = "User denied the request for Geolocation."
        break;
      case error.POSITION_UNAVAILABLE:
        x.innerHTML = "Location information is unavailable."
        break;
      case error.TIMEOUT:
        x.innerHTML = "The request to get user location timed out."
        break;
      case error.UNKNOWN_ERROR:
        x.innerHTML = "An unknown error occurred."
        break;
    }
  }

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(usePositionGetWeather, showError);
    } else {
      x.innerHTML = "Geolocation is not supported by this browser.";
    }
  }

  /* ---------- LIGHTS, CAMERA, ACTION ---------- */
  getLocation();
  
  /* ---------- BUTTON functions ---------- */
  $("#tempUnits").click(function() {
    //toggle between Celcius and Fahrenheit
    fahrenheit = !fahrenheit;
    displayTemperature();
  });
  
  $("#windUnits").click(function() {
    //toggle between mi/h and Km/h
    milesPerHour = !milesPerHour;
    displayWinds();
  });
  
}); //end document ready
