import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';
import historyService from '../../service/historyService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', (req: Request, res: Response) => {
  const { city } = req.body;
  // TODO: GET weather data from city name
  // TODO: save city to search history
  try {
    const weatherdata = await WeatherService.getWeatherForCity(city);
    await historyService.addCity(city)
    res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error retrieving weather data'});
  }
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await HistoryService.getCities();
    res.status(200).json(history)
  } catch (error) {
    console.error(error);
    res.status(500).json({message: 'Error retrieving weather data'});
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
