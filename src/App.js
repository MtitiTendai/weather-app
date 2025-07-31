import './App.css';
/* import UilReact from '@iconscout/react-unicons/icons/uil-react'; */
import TopButtons from './Components/TopButtons';
import Inputs from './Components/Inputs';
import TimeAndLocation from './Components/TimeAndLocation';
import TemperatureAndDetails from './Components/TemperatureAndDetails';
import Forescast from './Components/Forescast';
import getFormattedWeatherData from './Services/weatherService';
import { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [query, setQuery] = useState({q: 'berlin'})
  const [units, setUnits] = useState('metric')
  const [weather, setWeather] = useState(null)

  useEffect(() => {
     const fetchWeather = async () => {
      const message = query.q ? query.q : 'current location.';

      toast.info('Fetching weather for ' + message)

      await getFormattedWeatherData( { ...query, units}).then(
      (data) => {
        toast.success(`Successfully fetched weather for ${data.name}, ${data.country}.`)
        setWeather(data)
      });
     };  
    fetchWeather();
  }, [query, units]);


  const formatBackground = () => {
    if (!weather) return 'from -cyan-700 to-blue-700'
    const threshold = units === 'metric' ? 20 : 60
    if (weather.temp <= threshold) return 'from -cyan-700 to-blue-700'
    return 'from-yellow-700 to-orange-700'
  } 
 
  return (
    <div className= {`mx-auto max-w-screen-md mt-4 py-5 px-32 bg-gradient-to-br from-cyan-700 to-blue-700
    h-fit shadow-xl shadow-grey-400 ${formatBackground()}`}>
      <TopButtons setQuery = {setQuery} />
      <Inputs setQuery = {setQuery} units = {units} setUnits = {setUnits}/>

      {weather && (
        <div>
        <TimeAndLocation weather = {weather} />

        <TemperatureAndDetails weather = {weather} />

        <Forescast title= 'hourly forecast' items={weather.hourly}/>
        <Forescast title= 'daily forecast' items={weather.daily}/>
        </div>
      )}

    <ToastContainer autoClose= {5000} theme='colored' newestOnTop= {true}/>
    </div>
    
  );
};

export default App;
 