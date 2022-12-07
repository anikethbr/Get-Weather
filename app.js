const express = require("express");
const https=require("https");
const bodyParser = require("body-parser");
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/index.html");
});
app.post("/",function(req,res){
    const query=req.body.city;
    const apiKey="5d199d49716389e905463198072d36e0";
    const unit = "metric";
    const url ="https://api.openweathermap.org/data/2.5/weather?q="+query+"&lang=fr&appid="+apiKey+"&units="+unit;
    https.get(url,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/weather.ejs");
            response.on("data",function(data){
                var weatherData=JSON.parse(data);
                const temp = weatherData.main.temp;
                const description = weatherData.weather[0].main;
                const icon = weatherData.weather[0].icon;
                const humidity =weatherData.main.humidity;
                const windSpeed =weatherData.wind.speed;
                const iconUrl="http://openweathermap.org/img/wn/"+icon+"@2x.png";
                res.render("weather", { temp : temp, city : query, url : iconUrl, humidity :humidity, windSpeed : windSpeed, desc : description});
            });
        }else if(response.statusCode==404){
            res.sendFile(__dirname+"/failure.html");
            console.log(response.statusCode);
        }
    });
});
app.post("/failure",function(req,res){
    res.redirect("/");
});
app.listen(process.env.PORT || 3000,function(){
    console.log("Server Is running");
});
