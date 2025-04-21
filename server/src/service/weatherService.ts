import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.API_KEY || '';
const BASE_URL = process.env.API_BASE_URL || '';
// TODO: Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// TODO: Define a class for the Weather object  city, date, icon, iconDescription, tempF, windSpeed, humidity 
class Weather {
  city: string;
  date: string;
  icon: string;
  iconDescription: string;
  temperature: number;
  description: string;
  humidity: number;
  windSpeed: number;
 

  constructor(city: string, date: string, icon: string, iconDescription: string, temperature: number, description: string, humidity: number, windSpeed: number) {
    this.city = city;
    this.date = date;
    this.icon = icon;
    this.iconDescription = iconDescription;
    this.temperature = temperature;
    this.description = description;
    this.humidity = humidity;
    this.windSpeed = windSpeed;
  }
}

// TODO: Complete the WeatherService class
class WeatherService {
  // TODO: Define the baseURL, API key, and city name properties
  private baseURL: string;
  private apiKey: string;
  private cityName: string;

  constructor(cityName: string) {
    this.cityName = cityName;
    this.baseURL = BASE_URL;
    this.apiKey = API_KEY;
  }

  // TODO: Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<Coordinates> {
    const response = await fetch(`${BASE_URL}/geo/1.0/direct?q=${query}&appid=${API_KEY}`);
    console.log(response.status);
    const data = await response.json();
    return this.destructureLocationData(data[0]);
  }

  // TODO: Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    return {
      lat: locationData.lat,
      lon: locationData.lon,
    };
  }

  // TODO: Create buildGeocodeQuery method
  private buildGeocodeQuery(): string {
    return encodeURIComponent(this.cityName);
  }

  // TODO: Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // TODO: Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData() {
    const query = this.buildGeocodeQuery();
    return await this.fetchLocationData(query);
  }

  // TODO: Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather[]> {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates));
      if (!response.ok) throw new Error('Failed to fetch weather data');
      const weatherData = await response.json();
      const currentWeather = this.parseCurrentWeather(weatherData);  
      const forecastArray = this.buildForecastArray(weatherData.list);
      return [currentWeather, ...forecastArray];
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw new Error('Could not fetch weather data');
    }
  }

  // TODO: Build parseCurrentWeather method
  private parseCurrentWeather(response: any): Weather {
    if (!response.list || response.list.length === 0) {
      throw new Error("Weather data is missing or invalid");
    }
    const currentWeather = response.list[0];
    console.log(currentWeather);
    return new Weather(
      this.cityName,
      new Date(currentWeather.dt * 1000).toLocaleDateString(),
      currentWeather.weather[0].icon,
      currentWeather.weather[0].description,
      currentWeather.main.temp,
      currentWeather.weather[0]?.description, 
      currentWeather.main.humidity, 
      currentWeather.wind.speed
    );
  }

  // TODO: Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] {
    const fiveDayForecasts = weatherData.filter((_, index) => index % 8 === 0);

    return fiveDayForecasts.map(data => new Weather(
      this.cityName,
      new Date(data.dt * 1000).toLocaleDateString(),
      data.weather[0].icon,
      data.weather[0].description,
      data.main.temp,
      data.weather[0].description,
      data.main.humidity,
      data.wind.speed
    ));
  }

  // TODO: Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    const weatherData = await this.fetchWeatherData(coordinates);
    return weatherData;
  }

}


export default new WeatherService('defaultCityName');
