import axios from 'axios'
const APIKey=import.meta.env.VITE_SOME_KEY
const baseUrl='https://api.openweathermap.org/data/2.5/weather'

const getWeather=(latlng)=>{
    const request=`${baseUrl}?lat=${latlng[0]}&lon=${latlng[1]}&units=metric&appid=${APIKey}`
    return axios.get(request).then(response => response.data)
}

export default getWeather


