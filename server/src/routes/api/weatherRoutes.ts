import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';


// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;
  // TODO: GET weather data from city name
  // TODO: save city to search history
  try {
    const weatherData = await WeatherService.getWeatherForCity(cityName);
    await HistoryService.addCity(cityName)
    res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error retrieving weather data'});
  }
});

// TODO: GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.status(200).json(history)
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error retrieving search history'});
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id }  = req.params;
  try {
    await HistoryService.removeCity(id);
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error deleting city from search history'});
  }
});

export default router;
