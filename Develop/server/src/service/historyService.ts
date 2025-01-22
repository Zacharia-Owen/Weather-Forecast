import fs from 'fs/promises';

// TODO: Define a City class with name and id properties
class City {
  constructor(name, id) {
    this.name = name;
    this.id = id;
  }
}

// TODO: Complete the HistoryService class
class HistoryService {
  constructor() {
    this.filepath = './searchHistory.json';
  }

  // TODO: Define a read method that reads from the searchHistory.json file
  private async read() {
    try {
      const data = await fs.readFile(this.filepath, 'utf-8');
      return JSON.parse(data);
  } catch (error) {
    console.error('Error reading the file:', error);
    return [];
  }
}

  // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]) {
    try {
      await fs.writeFile(this.filepath, JSON.stringify(cities, null, 2));
  } catch (error) {
    console.error('Error writing the file:', error);
  }
}

  // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities() {
    const cities = await this.read();
    return cities.map((city) => new City(city.name, city.id));
  }

  // TODO Define an addCity method that adds a city to the searchHistory.json file
  async addCity(city: string) {
    const cities = await this.read();
    const id = cities.length ? cities[cities.length - 1].id + 1 : 1;
    cities.push({ name: city, id });
    await this.write(cities);
  }

  // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string) {
    const cities = await this.getCities();
    const updatedCities = cities.filter((city) => city.id !== parseInt(id));
    await this.write(updatedCities);
  }

}

export default new HistoryService();
