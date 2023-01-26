<script lang="ts">
import {defineComponent} from 'vue'
import {Geolocation} from '@capacitor/geolocation';

export default defineComponent({
  data() {
    return {
      temperature: 10,
      city: "Paris",
      country: "France",
      weatherImage: "/images/soleil.png"
    }
  },
  methods: {
    async getData(withCoordinate: boolean = true, city: string = '') {
      const coordinates = await this.getCoordinates(withCoordinate, city);
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&timezone=Europe/Paris&current_weather=true`);
      const finalRes = await res.json();
      const cityData = await this.getCityData(coordinates);
      this.city = cityData.city ?? city.split(',')[0];
      this.country = cityData.country;
      const currentWeather = finalRes.current_weather;
      this.temperature = currentWeather.temperature;
      const weatherCode: number = currentWeather.weathercode;
      await this.updateImage(weatherCode);
    },
    async updateImage(weatherCode: number) {
      switch(weatherCode) {
        case 0:
          this.weatherImage = "/images/soleil.png";
          break;
        case 1:
        case 2:
        case 3:
          this.weatherImage = "/images/nuage.png";
          break;
        case 45:
        case 48:
          this.weatherImage = "/images/fog.png";
          break;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
          this.weatherImage = "https://cdn-icons-png.flaticon.com/512/1182/1182983.png?w=740&t=st=1673012233~exp=1673012833~hmac=efe9b4857f53c1ae70926232207b4880cb4dec5860a205404c92fc3d3a602e76";
          break;
        case 61:
        case 63:
        case 65:
        case 66:
        case 67:
        case 80:
        case 81:
        case 82:
        case 85:
        case 86:         
          this.weatherImage = "https://citeradio.fr/wd/wp-content/uploads/2022/04/Fichier-1-300x267.png";
          break;
        case 71:
        case 73:
        case 75:
        case 77:
          this.weatherImage = "https://img.freepik.com/icones-gratuites/il-neige_318-269780.jpg?w=2000";
          break;
        case 95:
        case 96:
        case 99:
          this.weatherImage = "https://www.meteobelgique.be/staticfiles/images/picto/v2/bc/day/thundercover.png";
          break;
      }
    },
    async getCoordinates(withCoordinate: boolean = true, city: string = '') {
      const coordinates = {
        latitude: 0,
        longitude: 0
      };
      if(withCoordinate) {
        let coords = (await Geolocation.getCurrentPosition()).coords;
        coordinates['latitude'] = coords.latitude;
        coordinates['longitude'] = coords.longitude;
      } else {
        let cities = await this.getCitiesList(city);
        if (cities !== null && cities.length !== 0) {
          let coords = cities[0];
          coordinates['latitude'] = coords.latitude;
          coordinates['longitude'] = coords.longitude;
        }
      }

      return coordinates;
    },
    async getCityData(coordinates: {latitude: number, longitude: number}) {
      const cityRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates.latitude}&lon=${coordinates.longitude}&format=json`);
      const cityJson = await cityRes.json();

      return {
        country: cityJson.address.country,
        city: cityJson.address.city
      }
    },
    async getCitiesList(city: string): Promise<any[] | null> {

      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=fr`
      const res = await fetch(url)
      const finalRes = await res.json();
      return finalRes.results ?? null;
    },
    async updateCity() {
      const searchBar: HTMLInputElement|null = <HTMLInputElement> document.getElementById('search-bar');
      const city: string = searchBar!.value;
      await this.getData(false, city)
    },
    async autocomplete() {
      const searchSuggestions: HTMLElement|null = <HTMLInputElement> document.getElementById('search-suggestions');
      const searchListSuggestions: HTMLElement|null = document.getElementById('search-list-suggestions');
      const searchBar: HTMLInputElement|null = <HTMLInputElement> document.getElementById('search-bar');
      const classes = ["py-2", "px-4", "hover:bg-gray-200", "cursor-pointer"];
      let city = searchBar!.value;

      searchListSuggestions!.querySelectorAll('li').forEach(li => {
        li.remove();
      })

      let cities = await this.getCitiesList(city);
      let index = 0;
      if (cities !== null && cities.length !== 0){
        cities.forEach(city => {
          if(index < 5) {
            const listElement = document.createElement('li');
            classes.forEach(cls => {
              listElement.classList.add(cls);
            });
            listElement.innerText = `${city.name}, ${city.country}`;
            listElement.addEventListener('click', () => {
              searchBar.value = listElement.innerText;
              this.updateCity();
              searchSuggestions!.classList.add('hidden');
            })
            searchListSuggestions?.appendChild(listElement);
            index++;
          }
        });
        searchSuggestions!.classList.remove('hidden');
      } else {
        searchSuggestions!.classList.add('hidden');
      }


    }
  },
  mounted() {
    this.getData()
  }
})
</script>

<template>
  <div class="bg-blue-500 h-screen text-white text-center">
    <div class="flex items-center justify-center h-screen flex-col">
        <div class="relative flex mb-4">
          <div class="relative w-full">
            <input v-on:input="autocomplete()" type="search" id="search-bar" class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 rounded-l-lg" placeholder="Rennes, Paris..." required>
            <button v-on:click="updateCity()" type="button" id="search-button" class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <span class="sr-only">Search</span>
            </button>
            <div class="absolute bg-gray-50 rounded-md shadow py-2 w-full text-gray-900 hidden" id="search-suggestions">
              <ul class="list-reset" id="search-list-suggestions">
                <li class="py-2 px-4 hover:bg-gray-200 cursor-pointer">Suggestion 1</li>
                <li class="py-2 px-4 hover:bg-gray-200 cursor-pointer">Suggestion 2</li>
                <li class="py-2 px-4 hover:bg-gray-200 cursor-pointer">Suggestion 3</li>
              </ul>
            </div>
          </div>
        </div>
      <img :src="weatherImage" alt="Picto type météo" class="h-32 w-32">
      <div class="text-center text-6xl mt-8 font-semibold mb-4">{{ temperature }} °C</div>
      <div class="text-center text-xl">
        {{ city }}, {{ country }}
      </div>
    </div>
  </div>
</template>