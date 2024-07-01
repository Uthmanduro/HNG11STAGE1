const express = require("express");
const axios = require("axios");
const requestIp = require("request-ip");

require('dotenv').config();

const app = express();
const port = 8000;

app.use(express.json());


const getUserIp = (req) => {
    let ipAddress = requestIp.getClientIp(req)

    if (ipAddress.includes('::ffff:')) {
        ipAddress = ipAddress.replace('::ffff:', '')
    }

    return ipAddress ?? "102.89.23.242"
}


async function fetchLocation() {
    try {
      const url = `https://api.geoapify.com/v1/ipinfo?apiKey=${process.env.LOCATION_API_KEY}`;
      const response = await axios.get(url);
      return (response.data.city.name); // Handle the response data
    } catch (error) {
      console.error('Error:', error); // Handle the error
    }
}


async function fetchWeather(city) {
    try {
    
        const url = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=${city}&aqi=no`
        const res = await axios.get(url)
        const temp = res.data.current.temp_c;

        return (temp);

    
    } catch (error) {
      console.error('Error:', error); // Handle the error
    }
}



app.get("/api/hello/", async (req, res) => {

    let ip = getUserIp(req);
    const location = await fetchLocation();

    const visitor_name = req.query.visitor_name || "anonymous";
    const temperature = await fetchWeather(location);
      
      
    res.send({
        "client_ip": ip, // The IP address of the requester
        "location": location, // The city of the requester
        "greeting": `Hello, ${visitor_name}!, the temperature is ${temperature} degrees Celcius in ${location}`
        })
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})

