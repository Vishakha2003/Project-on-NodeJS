const http = require("http");
const fs = require("fs");
var requests = require("requests");
const { Stream } = require("stream");

const homeFile = fs.readFileSync("home.html", "UTF8");
const replaceVal = (tempval, orgVal) => {
    let temperature = tempval.replace("{%tempval%}", orgVal.main.temp);
    temperature =  temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature =  temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature =  temperature.replace("{%loaction%}", orgVal.name);
    temperature =  temperature.replace("{%country%}", orgVal.sys.country);
    temperature =  temperature.replace("{%tempsatatus%}", orgVal.weather[0].main);
    return temperature;
}

const server = http.createServer((req, res) => {
    if(req.url == "/"){
        requests("https://api.openweathermap.org/data/2.5/weather?q=beed&units=metric&appid=79dc16bb4c34b5dd31ddc29fba4d748f")
        .on("data", (chunk) => {
            const objdata = JSON.parse(chunk);
            const arrData = [objdata];
            //console.log(arrData);
            const realTimeData = arrData.map(val => replaceVal(homeFile, val)).join("");
            //console.log(realTimeData);
            res.write(realTimeData);
        })
        .on("end", (err) => {
            if(err) return console.log("Connection closed deu to errors", err);
            res.end();
        });
    }
});

server.listen(8000, "127.0.0.1");