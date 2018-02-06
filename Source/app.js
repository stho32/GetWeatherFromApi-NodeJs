/**
 * Node Weather Api App
 */
const http = require("http")
const fs = require("fs")

/* Processing command line arguments */
if (process.argv.length <= 2) {
    console.log("Usage: ");
    console.log("  option 1: " + __filename + " <city-id>");
    console.log("  option 2: " + __filename + " <city name> <country code>")
    process.exit(-1);
}

let cityId = -1;
let cityName = "";
let countryCode = "";

// cityId
if (process.argv.length == 3) {
    cityId = process.argv[2];

    loadApiKey(apiKey => {
        let url = "http://api.openweathermap.org/data/2.5/weather?id=" + 
            encodeURIComponent(cityId) + 
            "&appid=" + encodeURIComponent(apiKey);
        loadWeatherInformation(url);
    });
}

// cityName & countryCode
if (process.argv.length == 4) {
    cityName = process.argv[2];
    countryCode = process.argv[3];

    loadApiKey(apiKey => {
        let url = "http://api.openweathermap.org/data/2.5/weather?q=" + 
            encodeURIComponent(cityName) + "," + 
            encodeURIComponent(countryCode) + 
            "&appid=" + encodeURIComponent(apiKey);
        loadWeatherInformation(url);
    });
}

function loadApiKey(apiKeyConsumerCallback) {
    fs.readFile(__dirname + '/api.key', function (err, data) {
        if (err) {
            throw err;
        }
        let apiKey = (data.toString().trim());

        if (apiKeyConsumerCallback !== undefined) {
            apiKeyConsumerCallback(apiKey);
        }
    });
}

function loadWeatherInformation(url) {
    try {
        http.get(url + "&units=metric",
            response => {
                let weatherJson = "";

                response.on("data", data => {
                    weatherJson += data.toString();
                });

                response.on("end", () => {
                    let weatherForecast = JSON.parse(weatherJson);

                    if ( weatherForecast.cod == 200 ) {
                        console.log(`${weatherForecast.name} : ${weatherForecast.main.temp} degree Celsius, humidity: ${weatherForecast.main.humidity}`);
                    } else if ( weatherForecast.cod == 404 ) {
                        console.log(weatherForecast.message);
                    } else {
                        console.log("Got unknown response from weatherApi: ");
                        console.log(weatherJson);
                    }
                });

                response.on("error", error => {
                    console.log("There has been an error processing the request :" + error.message);
                });
            }
        );
    } catch (error) {
        console.log("There has been an error processing the request :" + error.message);
    }
}
