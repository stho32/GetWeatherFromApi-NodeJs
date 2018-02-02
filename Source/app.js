/**
 * Node Weather Api App
 */
const http = require("http")
const fs = require("fs")

function loadApiKey(apiKeyConsumerCallback) {
    fs.readFile( __dirname + '/api.key', function (err, data) {
        if (err) {
            throw err; 
        }
        let apiKey = (data.toString().trim());

        if ( apiKeyConsumerCallback !== undefined ) {
            apiKeyConsumerCallback(apiKey);
        }
    });
}

loadApiKey(apiKey => {
    http.get("http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=" + apiKey,
        response => {
            let weatherJson = "";

            response.on("data", data => {
                weatherJson += data.toString();
            });

            response.on("end", () => {
                let weatherForecast = JSON.parse(weatherJson);

                console.dir(weatherForecast);
            });
        }
    );
});


//http.get("http://samples.openweathermap.org/data/2.5/weather?q=London,uk&appid=b6907d289e10d714a6e88b30761fae22")
