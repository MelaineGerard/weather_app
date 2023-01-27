<script lang="ts">
import {defineComponent} from 'vue'
import {Geolocation} from '@capacitor/geolocation';
import Navbar from "@/components/Navbar.vue";
import SearchBar from "@/components/SearchBar.vue";

export default defineComponent({
  components: {SearchBar, Navbar},
  props: {
    cityProps: String
  },
  data() {
    return {
      temperature: null as number | null,
      city: ["Chargement..."] as string[],
      weatherImage: "/images/loading.gif",
    }
  },
  methods: {
    async getData(withCoordinate: boolean = true, city: string = '') {
      const coordinates = await this.getCoordinates(withCoordinate, city);
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&timezone=Europe/Paris&current_weather=true`);
      const finalRes = await res.json();
      const cityData = await this.getCityData(coordinates);
      this.city = [];
      this.city.push(cityData.city ?? city.split(',')[0]);
      if (cityData.country) {
        this.city.push(cityData.country);
      }
      const currentWeather = finalRes.current_weather;
      this.temperature = currentWeather.temperature;
      const weatherCode: number = currentWeather.weathercode;
      await this.updateImage(weatherCode);
    },
    async updateImage(weatherCode: number) {
      switch (weatherCode) {
        case 0:
          this.weatherImage = "/images/sunny.svg";
          break;
        case 1:
        case 2:
        case 3:
          this.weatherImage = "/images/cloudy.svg";
          break;
        case 45:
        case 48:
          this.weatherImage = "/images/foggy.svg";
          break;
        case 51:
        case 53:
        case 55:
        case 56:
        case 57:
          this.weatherImage = "/images/umbrella.svg";
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
          this.weatherImage = "/images/rainy.svg";
          break;
        case 71:
        case 73:
        case 75:
        case 77:
          this.weatherImage = "/images/snowflake.svg";
          break;
        case 95:
        case 96:
        case 99:
          this.weatherImage = "/images/lightning.svg";
          break;
      }
    },
    async getCoordinates(withCoordinate: boolean = true, city: string = '') {
      const coordinates = {
        latitude: 0,
        longitude: 0
      };
      if (withCoordinate) {
        try {
          let coords = (await Geolocation.getCurrentPosition()).coords;
          coordinates['latitude'] = coords.latitude;
          coordinates['longitude'] = coords.longitude;
        } catch (e) {
          coordinates['latitude'] = 48.858370;
          coordinates['longitude'] = 2.294481;
        }
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
    async getCitiesList(city: string): Promise<any[] | null> {

      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=fr`
      const res = await fetch(url)
      const finalRes = await res.json();
      return finalRes.results ?? null;
    },
    async getCityData(coordinates: { latitude: number, longitude: number }) {
      const cityRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates.latitude}&lon=${coordinates.longitude}&format=json`);
      const cityJson = await cityRes.json();

      return {
        country: cityJson.address.country,
        city: cityJson.address.city
      }
    },
    async handleUpdateCity(data: { withCoordinate: boolean, city: string}) {
      await this.getData(data.withCoordinate, data.city)
    }
  },
  mounted() {
    if (this.cityProps !== undefined) {
      this.getData(false, this.cityProps)
    } else {
      this.getData(true)
    }
  }
})
</script>

<template>
  <div class="bg-blue-500 h-screen text-white text-center">
    <div class="flex flex-col">
      <div class="flex justify-center">
        <Navbar/>
      </div>
      <div class="flex items-center justify-center flex-col">
        <div class="relative flex mb-4">
          <div class="relative w-64">
            <SearchBar v-on:city-event="handleUpdateCity" />
          </div>
        </div>
        <img :src="weatherImage" alt="Picto type météo" class="h-48 w-48">
        <div class="text-center text-6xl mt-8 font-semibold mb-4 w-64" v-if="temperature != null">{{ temperature }} °C
        </div>
        <div class="text-center text-xl w-64">
          {{ city.join(', ') }}
        </div>
      </div>
    </div>
  </div>
</template>