const express = require("express");
const axios = require("axios");

require('dotenv').config();

const app = express();
const port = 8000;

app.use(express.json());


async function fetchLocation() {
    try {
    
        const url = `http://api.weatherapi.com/v1/current.json?key=${process.env.WEATHER_API_KEY}&q=auto:ip&aqi=no`
        const res = await axios.get(url)
        const temp = res.data.current.temp_c;
        const location = res.data.location.name;

        return [temp, location];

    
    } catch (error) {
      console.error('Error:', error); // Handle the error
    }
}



app.get("/api/hello/", async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;;
    const visitor_name = req.query.visitor_name || "anonymous";
    const data = await fetchLocation()
    const location = data[1];  
    const temperature = data[0];
    res.send({
        "client_ip": ip, // The IP address of the requester
        "location": location, // The city of the requester
        "greeting": `Hello, ${visitor_name}!, the temperature is ${temperature} degrees Celcius in ${location}`
        })
})

app.listen(port, () => {
    console.log(`App is listening on port ${port}`)
})










// async function fetchWeather(location) {
//     try {
//         // const geocoding_url = `http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=5&appid=${process.env.WEATHER_API_KEY}`
        
//         // const response = await axios.get(geocoding_url)
//         // const lat = response.data[0].lat
//         // const lon =  response.data[0].lon;

//         // const weather_url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${process.env.WEATHER_API_KEY}`
//         // const temp = await axios.get(weather_url);
//         // return (temp.data.main.temp);

        

        
//     } catch (error) {
//         console.error('Error:', error); // Handle the error
//     }
// }


//   const url = `https://api.geoapify.com/v1/ipinfo?apiKey=${process.env.LOCATION_API_KEY}`;
    //   const response = await axios.get(url);
    //   return (response.data.city.name); // Handle the response data

