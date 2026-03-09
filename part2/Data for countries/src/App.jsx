import { useState } from 'react'
import { useEffect } from 'react'
import Filter from './components/Filter'
import axios from 'axios'
import getWeather from './services/weather'

function App() {
  const [filter, setFilter]=useState(null)
  const [countries, setCountries]=useState(null)
  const [filterCountries, setFilterCountries]=useState(null)
  useEffect(() => {
    console.log('effect run, countries loading...')

      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/all`)
        .then(response => {
          return response.data
        })
        .then(data => {
          setCountries(data)
          console.log(data.length)
        })
      }, [])

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
    setFilterCountries(countries.filter(country => country.name.common.toLowerCase().includes(event.target.value.toLowerCase())))
  }
  const handleSingleCountry=(country) => {
    console.log(country)
    console.log(countries.filter((c) => country.name.common === c.name.common))
    setFilterCountries(countries.filter((c) => country.name.common === c.name.common))
  }

  console.log(filterCountries)
  return (
      <div>
        <Filter filter={filter || ''} handler={handleFilterChange}/>
        <Render countries={filterCountries} handler={handleSingleCountry}/>
      </div>

  )
}

const Render=({countries, handler})  => {
  if (countries){
    if (countries.length==1){
      return <RenderSingleCountry country={countries['0']}/>
    }
    else if(countries.length<10){
      return (<div>List of countries containes {countries.length} countries 
              <RenderList countries={countries} handler={handler}/>
      </div>)
    } else if(countries.length>10 && countries.length<250) {
      return <div>Too many matches, specify another filter</div>
    } else {
      return <div></div>
    }
  }
  return <div></div>
}

const RenderList=({countries, handler})=> {
  countries.map((country, index) => console.log(country.name.common))
  return (<div>
    {countries.map((country, index) => <RenderCountryName key={index} country={country} handler={()=>handler(country)} />
    )}</div>)
  }

const RenderCountryName=({country, handler}) =>{
  console.log(country)
  return (
    <div>
      {country.name.common}
      <button onClick={handler}>show</button>
    </div>)
}

const RenderSingleCountry=({country}) => {
  console.log(country)
  console.log("Country flag url", country.flags.png)
  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>Capital {country.capital} <br/>
      Area {country.area}</p>
      <h1>Languages</h1>
      <ul>
        {Object.entries(country.languages).map(([abbr, lang]) => <li key={abbr}>{lang}</li>)}
      </ul>
      <img src={country.flags.png} />
      <h1>Weather in {country.name.common}</h1>
      <RenderWeather latlng={country.capitalInfo.latlng} />
    </div>
  )
}

const RenderWeather=({latlng}) => {
  const [weather, setWeather]=useState(null)

  useEffect(() =>{
      getWeather(latlng).then(data => {
        console.log(data)
        setWeather(data) })
  },[latlng])
  if(!weather){
    return <div> Loading weather...</div>
  }
  const imgSrc=`https://openweathermap.org/payload/api/media/file/${weather.weather[0].icon}.png`
  return (
    <div> 
      <div>Temperature {weather.main.temp} Celsius</div>
      <img src={imgSrc}/>
      <div>Wind {weather.wind.speed} m/s </div>
    </div>)
}
export default App
