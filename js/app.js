$(document).ready(init);

var celsius;
var fahrenheit;
var pressure;
var humidity;
var wind;
var isCelsius = true;

function setTemperature(a){
	$(".temperature").text(a);
}

function init() {
	getLocation();

	var input = document.getElementById('searchTextField');
	var autocomplete = new google.maps.places.Autocomplete(input);

	google.maps.event.addListener(autocomplete, 'place_changed', function() { 
		var place = autocomplete.getPlace();
		var coords = {
			latitude:  place.geometry.location.lat(),
			longitude: place.geometry.location.lng()
		}
		
		getDataByCoords(coords);
	});

	$("#searchTextField").on("click", function(){
		$(this).val("")}
	);

	$(".click").click(convertTemp);
}

function convertTemp() {

	if (isCelsius) {
		setTemperature(fahrenheit);
		$(".click").text("F");
	} else {
		setTemperature(celsius);
		$(".click").text("C");	
	}

	isCelsius = !isCelsius;
};

function weatherExtras(){
	$(".pressure").text("Pressure " + pressure);
	$(".humidity").text("Humidity " + humidity);
	$(".wind").text("Wind " + wind);
}

var weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Satruday"];

function getWeathetForSevenDays(id){
	$.getJSON("http://api.openweathermap.org/data/2.5/forecast/daily?id="+id+"&units=metric&appid=24d0855e0f65dbda82f8b42cab34d9ad", function(json){
	
		var content = "";
			
		for (var i = 0; i < json.list.length; i++) {
			content += creatDay(json.list[i], i === 0);
		}
		
		$('#weather-for-7days').html(content);
		console.log(content);
	});
 }

function creatDay(x, isToday){
	var date = new Date(x.dt * 1000);
	var day = isToday? "Today" : weekday[date.getDay()];
	var newDiv ='<div class="row">' +
					'<div class="col-md-12">' +
						'<div class="col-md-4"><h3>'+ day +'</h3></div>' +
						'<div class="col-md-4 weather-image '+ getWeatherClass(x.weather[0].id)+'"></div>' +
						'<div class="col-md-4 '+ weekday[date.getDay()].toLowerCase() +'">' +
							'<span class="max-temp">'+ Math.floor(x.temp.max) +'</span>' +
							'<span class="min-temp">'+ Math.floor(x.temp.min) +'</span>' +
						'</div>' +
					'</div>' +
				'</div>' ;
	return newDiv;
}

function getLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
		   getDataByCoords(position.coords);
		});
	} else {
		console.log("geolocation IS NOT available!")
	}
}

function getDataByCoords(coords) {
	$.getJSON("http://api.openweathermap.org/data/2.5/weather?lat="+coords.latitude+"&lon="+coords.longitude+"&units=metric&appid=24d0855e0f65dbda82f8b42cab34d9ad",function(json){
		console.log(json);

		$(".location").text(json.name);
		$(".description").text(json.weather[0].description);

		celsius = Math.floor(json.main.temp);
		fahrenheit = Math.floor(celsius * 1.8 + 32);
		pressure = Math.floor(json.main.pressure) + ("hPa");
		humidity = json.main.humidity + ("%");
		wind = json.wind.speed + ("km/h");

		setTemperature(celsius);
		weatherExtras();
		getWeathetForSevenDays(json.id);
	});
}

function getWeatherClass(id) {
	switch (id) {
		case 200:
		case 201:
		case 202:
		case 210:
		case 211:
		case 212:
		case 221:
		case 230:
		case 231:
		case 232: {
			return 'thunderstorm '
		}
		case 300:
		case 301:
		case 302:
		case 310:
		case 311:
		case 312:
		case 313:
		case 314:
		case 321: {
			return 'drizzle'
		}
		case 500: 
		case 501:
		case 502:
		case 503:
		case 504: {
			return 'light-rain'
		}
		case 511: {
			return 'freezing-rain'
		}
		case 520:
		case 521:
		case 522:
		case 531: {
			return 'shower-rain'
		}
		case 600:
		case 601:
		case 602:
		case 611:
		case 612:
		case 615:
		case 616:
		case 620:
		case 621:
		case 622: {
			return 'light-snow'
		}
		case 701:
		case 711:
		case 721:
		case 731:
		case 741:
		case 751:
		case 761:
		case 762:
		case 771:
		case 781: {
			return 'mist'
		}
		case 800:{
			return 'clear-sky'
		}
		case 801: {
			return 'few-clouds'
		}
		case 802: {
			return 'scattered-clouds'
		}
		case 803: {
			return 'broken-clouds'
		}
		case 804: {
			return 'overcast-clouds'
		}
	}
}



