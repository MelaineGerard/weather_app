<script lang="ts">
export default {
  emits: ["city-event"],
  methods: {
    async updateCity() {
      const searchBar: HTMLInputElement | null = <HTMLInputElement>document.getElementById('search-bar');
      const city: string = searchBar!.value;

      this.$emit('city-event', {
        withCoordinate: false,
        city: city
      });
    },
    async getCitiesList(city: string): Promise<any[] | null> {

      const url = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=fr`
      const res = await fetch(url)
      const finalRes = await res.json();
      return finalRes.results ?? null;
    },
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
  }
}
</script>

<template>
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
  <div class="absolute bg-gray-50 rounded-md shadow py-2 w-full text-gray-900 hidden" id="search-suggestions">
    <ul class="list-reset" id="search-list-suggestions">
      <li class="py-2 px-4 hover:bg-gray-200 cursor-pointer">Suggestion 1</li>
      <li class="py-2 px-4 hover:bg-gray-200 cursor-pointer">Suggestion 2</li>
      <li class="py-2 px-4 hover:bg-gray-200 cursor-pointer">Suggestion 3</li>
    </ul>
  </div>
</template>