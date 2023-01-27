<script lang="ts">
import {defineComponent} from 'vue'
import Navbar from "@/components/Navbar.vue";

export default defineComponent({
  components: {Navbar},
  data() {
    return {
      cities: JSON.parse(localStorage.getItem('cities') ?? '[]') as string[] ?? [] as string[]
    }
  },
  methods: {
    /**
     *
     */
    async updateCity() {
      const searchBar: HTMLInputElement | null = <HTMLInputElement>document.getElementById('search-bar');
      const city: string = searchBar!.value;
      if (city.length !== 0) {
        this.cities.push(city);
        searchBar.value = '';
        localStorage.setItem("cities", JSON.stringify(this.cities));
      }
    },
    /**
     *
     */
    async autocomplete() {
      const searchSuggestions: HTMLElement | null = <HTMLInputElement>document.getElementById('search-suggestions');
      const searchListSuggestions: HTMLElement | null = document.getElementById('search-list-suggestions');
      const searchBar: HTMLInputElement | null = <HTMLInputElement>document.getElementById('search-bar');
      const classes = ["py-2", "px-4", "hover:bg-gray-200", "cursor-pointer"];
      let city = searchBar!.value;

      searchListSuggestions!.querySelectorAll('li').forEach(li => {
        li.remove();
      })

      let cities = await this.getCitiesList(city);
      let index = 0;
      if (cities !== null && cities.length !== 0) {
        cities.forEach(city => {
          if (index < 5) {
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


    },
    /**
     *
     * @param coordinates
     */
    async getCityData(coordinates: { latitude: number, longitude: number }) {
      const cityRes = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${coordinates.latitude}&lon=${coordinates.longitude}&format=json`);
      const cityJson = await cityRes.json();

      return {
        country: cityJson.address.country,
        city: cityJson.address.city
      }
    },
    /**
     *
     * @param city
     */
    async getCitiesList(city: string): Promise<any[] | null> {

      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=fr`
      const res = await fetch(url)
      const finalRes = await res.json();
      return finalRes.results ?? null;
    },
    /**
     *
     * @param city
     * @param event
     */
    async removeCity(city: string, event: Event | null = null) {
      if (event !== null) {
        event.preventDefault();
      }
      const index: number = this.cities.indexOf(city, 0);
      if (index > -1) {
        this.cities.splice(index, 1);
      }
      localStorage.setItem("cities", JSON.stringify(this.cities));
    },
    /**
     *
     * @param city
     */
    async goToHome(city: string) {

      this.$router.push({path: '/', replace: false, query: {city: city}})
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
            <input v-on:input="autocomplete()" type="search" id="search-bar"
                   class="block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500 rounded-l-lg"
                   placeholder="Rennes, Paris..." required>
            <button v-on:click="updateCity()" type="button" id="search-button"
                    class="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
              <svg aria-hidden="true" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                   xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <span class="sr-only">Search</span>
            </button>
            <div class="absolute bg-gray-50 rounded-md shadow py-2 w-full text-gray-900 hidden z-10"
                 id="search-suggestions">
              <ul class="list-reset" id="search-list-suggestions">
                <li class="py-2 px-4 hover:bg-gray-200 cursor-pointer">Suggestion 1</li>
                <li class="py-2 px-4 hover:bg-gray-200 cursor-pointer">Suggestion 2</li>
                <li class="py-2 px-4 hover:bg-gray-200 cursor-pointer">Suggestion 3</li>
              </ul>
            </div>
          </div>
        </div>

        <div
          class="w-64 text-sm font-medium text-gray-900 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white border-gray-200 border-t border-x"
          v-if="cities.length > 0">
          <div
            class="block w-full h-auto border-gray-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:border-gray-600 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-500 dark:focus:text-white border-b"
            v-for="city in cities">
            <div class=" h-auto flex justify-between">
              <div class=" h-auto px-4 py-2 w-full hover:bg-gray-100 hover:text-blue-700" v-on:click="goToHome(city)">
                {{ city }}
              </div>
              <button type="button"
                      class=" h-auto text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium text-sm p-2.5 text-center inline-flex items-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                      v-on:click="removeCity(city)">
                <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg"
                     viewBox="0 0 24 24">
                  <path
                    d="M10,18a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,10,18ZM20,6H16V5a3,3,0,0,0-3-3H11A3,3,0,0,0,8,5V6H4A1,1,0,0,0,4,8H5V19a3,3,0,0,0,3,3h8a3,3,0,0,0,3-3V8h1a1,1,0,0,0,0-2ZM10,5a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1V6H10Zm7,14a1,1,0,0,1-1,1H8a1,1,0,0,1-1-1V8H17Zm-3-1a1,1,0,0,0,1-1V11a1,1,0,0,0-2,0v6A1,1,0,0,0,14,18Z"/>
                </svg>
                <span class="sr-only">Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>