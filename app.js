const express = require("express");
const https = require("https");
const mongoose = require('mongoose');
const bodyParser = require("body-parser")
var savedData;
const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/weatherAppDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Create a Mongoose Schema and Model for Weather City
const weatherCitySchema = new mongoose.Schema({
    city: String,
    username: String
  });

const WeatherCity = mongoose.model('WeatherCity', weatherCitySchema);

app.get("/", function(req, res){
    res.render("index.ejs");
})

app.post("/", function(req, res){
    const cityName = req.body.cityName; 
    const url = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&id=524901&appid=86dd81d6ece1cbffb48848a65ec104af&units=metric"
        
    https.get(url, function(response){
            
        response.on("data", function(data){
                const weatherData = JSON.parse(data)
                console.log(weatherData)
                const temp = weatherData.main.temp;
                const desc = weatherData.weather[0].description;
                const weatherCode = weatherData.weather[0].icon;
                const humidity = weatherData.main.humidity;
                const wind = weatherData.wind.speed;
                const rain = weatherData.rain
                const dateTimeObject = new Date();
                let hours = dateTimeObject.getHours();
                let minutes = dateTimeObject.getMinutes();
                const iconURL = "https://openweathermap.org/img/wn/"+ weatherCode +"@2x.png"
                res.render("indexTest.ejs", {temp:temp, desc: desc, iconURL: iconURL, city: cityName, humidity:humidity, windSpeed:wind, time: hours, time1:minutes})
            })
        })
    });

app.post("/FavouritesAdded", async(req, res) => {
   var savedData = await WeatherCity.find({});
   var savedtemp1;
   var saveddesc1;
   var savedtemp2;
   var saveddesc2;
   

   if(savedData[1]) 
   {
        var SavedCityName1 = savedData[0].city;
        var SavedCityName2 = savedData[1].city;
        const url1 = "https://api.openweathermap.org/data/2.5/weather?q="+ SavedCityName1 +"&id=524901&appid=86dd81d6ece1cbffb48848a65ec104af&units=metric"
        const url2 =  "https://api.openweathermap.org/data/2.5/weather?q="+ SavedCityName2 +"&id=524901&appid=86dd81d6ece1cbffb48848a65ec104af&units=metric"
        
        https.get(url1, function(response){
        response.on("data", function(data){
            const savedweatherData = JSON.parse(data)
            savedtemp1 = savedweatherData.main.temp;
            saveddesc1 = savedweatherData.weather[0].description;
            })
        }) 

        https.get(url2, function(response){
            response.on("data", function(data){
                const savedweatherData = JSON.parse(data)
                savedtemp2 = savedweatherData.main.temp;
                saveddesc2 = savedweatherData.weather[0].description;
                })
            }) 
        res.render("favourite.ejs", {savedcity1:SavedCityName1, savedcity2:SavedCityName2, savedtemp2:savedtemp2, savedtemp1:savedtemp1, saveddesc2: saveddesc2, saveddesc1: saveddesc1, flag: "true"})
    }
  

    if(savedData[0] && !savedData[1])
    {
        const newWeatherCity = new WeatherCity({
            city: req.body.city,
            username: "testUser"
        })

        newWeatherCity.save()

         var SavedCityName1 = savedData[0].city;
        var SavedCityName2 = savedData[1].city;
        const url1 = "https://api.openweathermap.org/data/2.5/weather?q="+ SavedCityName1 +"&id=524901&appid=86dd81d6ece1cbffb48848a65ec104af&units=metric"
        const url2 =  "https://api.openweathermap.org/data/2.5/weather?q="+ SavedCityName2 +"&id=524901&appid=86dd81d6ece1cbffb48848a65ec104af&units=metric"
        
        https.get(url1, function(response){
        response.on("data", function(data){
            const savedweatherData = JSON.parse(data)
            savedtemp1 = savedweatherData.main.temp;
            saveddesc1 = savedweatherData.weather[0].description;
    
            })
        }) 

        https.get(url2, function(response){
            response.on("data", function(data){
                const savedweatherData = JSON.parse(data)
                savedtemp2 = savedweatherData.main.temp;
                saveddesc2 = savedweatherData.weather[0].description;
                })
            }) 

        res.render("favourite.ejs", {savedcity1:SavedCityName1, savedcity2:SavedCityName2, savedtemp2:savedtemp2, savedtemp1:savedtemp1, saveddesc2: saveddesc2, saveddesc1: saveddesc1, flag: "true"})
    }
        
    if(!savedData)
    {
        const newWeatherCity = new WeatherCity({
            city: req.body.city,
            username: "testUser"
        })

        newWeatherCity.save()

        const cityName = req.body.city;
        savedData = cityName
        const url = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName +"&id=524901&appid=86dd81d6ece1cbffb48848a65ec104af&units=metric"
        https.get(url, function(response){
        response.on("data", function(data){
            const savedweatherData = JSON.parse(data)
            const savedtemp = savedweatherData.main.temp;
            const saveddesc = savedweatherData.weather[0].description;
            res.render("favourite.ejs", {savedcity:cityName, savedtemp:savedtemp, saveddesc: saveddesc, flag:"False"})
            })
        })
    }
});
        

//     {
//             var SavedCityName1 = savedData[1].city;
//             const url = "https://api.openweathermap.org/data/2.5/weather?q="+ SavedCityName +"&id=524901&appid=86dd81d6ece1cbffb48848a65ec104af&units=metric"
//             https.get(url, function(response){
//             response.on("data", function(data){
//                 const savedweatherData = JSON.parse(data)
//                 var savedtemp = savedweatherData.main.temp;
//                 var saveddesc = savedweatherData.weather[0].description;
//                 res.render("favourite.ejs", {savedcity:SavedCityName, savedcity1:SavedCityName1, savedtemp:savedtemp, savedtemp1:savedtemp1, saveddesc: saveddesc, saveddesc1: saveddesc1})
//                 })
//             })  
//         }
//         else
//         {
//             res.render("favourite.ejs", {savedcity:SavedCityName, savedtemp:savedtemp, saveddesc: saveddesc}) 
//         }
//     }
//     else
//     {
        
//     }
// });

app.listen(3000, function() {
    console.log("server is running on 3000 port");
})


