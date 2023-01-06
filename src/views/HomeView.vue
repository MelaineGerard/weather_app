<script lang="ts">
import { defineComponent } from 'vue'
import { Geolocation } from '@capacitor/geolocation';

export default defineComponent({
  data() {
    return {
      temperature: 30,
      city: "Paris",
      country: "France",
      weatherImage: "https://cdn-icons-png.flaticon.com/512/2698/2698194.png"
    }
  },
  methods: {
    async getData() {
      const coordinates = await (await Geolocation.getCurrentPosition()).coords;
      const res = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${coordinates.latitude}&longitude=${coordinates.longitude}&timezone=Europe/Paris&current_weather=true`);
      const finalRes = await res.json();
      const cityRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates.latitude}&lon=${coordinates.longitude}&format=json`);
      const cityJson = await cityRes.json();
      this.city = cityJson.address.city;
      this.country = cityJson.address.country;
      const currentWeather = finalRes.current_weather;
      this.temperature = currentWeather.temperature;
      const weatherCode: number = currentWeather.weathercode;
      this.updateImage(weatherCode);
      
    },
    async updateImage(weatherCode: number) {
      switch(weatherCode) {
        case 0:
          this.weatherImage = "https://cdn-icons-png.flaticon.com/512/2698/2698194.png";
          break;
        case 1:
        case 2:
        case 3:
          this.weatherImage = "https://img.freepik.com/icones-gratuites/nuageux_318-467751.jpg?w=2000";
          break;
        case 45:
        case 48:
          this.weatherImage = "https://www.meteobelgique.be/staticfiles/images/picto/v2/bc/day/fog.png";
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
  },
  mounted() {
    this.getData()
  }
})
</script>

<template>
  <div class="bg-blue-500 h-screen text-white text-center">
    <div class="flex items-center justify-center h-screen flex-col">
      <img :src="weatherImage" alt="Picto type météo" class="h-32 w-32">
      <div class="text-center text-6xl mt-8 font-semibold mb-4">{{ temperature }} °C</div>
      <div class="text-center text-xl">
        {{ city }}, {{ country }}
      </div>
    </div>
  </div>
</template>