const express = require("express");
const https=require("https");
const bodyParser = require("body-parser");
const app = express();
var items =[];
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});
app.post("/",function(req,res){
    const query=req.body.city;
    const apiKey="";
    const unit = "metric";
    const url ="https://api.openweathermap.org/data/2.5/weather?q="+query+"&lang=fr&appid="+apiKey+"&units="+unit;
    https.get(url,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/weather.html");
        }
        console.log(response.statusCode);
        response.on("data",function(data){
            var weatherData=JSON.parse(data);
            //const city =weatherData.name;
            const temp = weatherData.main.temp;
            const description = weatherData.weather[0].main;
            const icon = weatherData.weather[0].icon;
            const humidity =weatherData.main.humidity;
            const windSpeed =weatherData.wind.speed;
            const iconUrl="http://openweathermap.org/img/wn/"+icon+"@2x.png";
            // res.write("<p>Weather description is "+description+"</p>");
            // res.write("<h1>Temperature at "+ query +" is "+temp+" degree celsius.</h1>");
            // res.write("<img src="+iconUrl+">");
            // res.send();
            res.render("weather", { temp : temp, city : query, url : iconUrl, humidity :humidity, windSpeed : windSpeed, desc : description});
        })
    })
});
app.listen(process.env.PORT || 3000,function(){
    console.log("Server Is running");
})
