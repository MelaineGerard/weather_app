<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
  data() {
    return {}
  },
  methods: {}
})
</script>

<template>
  <div class="bg-blue-500 h-screen text-white text-center">
    <div class="flex flex-col">
      <div class="flex justify-center">
        <div class="rounded-md shadow-sm mt-4 mb-4">
          <router-link to="/"
                       class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-l-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            Accueil
          </router-link>
          <router-link to="/cities"
                       class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border-t border-b border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            Villes
          </router-link>
          <router-link to="/about"
                       class="px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-r-md hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-2 focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-blue-500 dark:focus:text-white">
            A Propos
          </router-link>
        </div>
      </div>
      <div class="flex items-center justify-center flex-col">
        <div class="w-64 text-justify">
          <h2 class="text-2xl font-bold">
            A Propos
          </h2>
          <p class="mb-4">
            Cette application météo a été développé dans le cadre d'un cours de Développement mobile au sein du campus
            Ynov de Rennes.
          </p>
          <p>
            Elle a été réalisé avec le framework Vue.JS pour la partie Front et la librairie Capacitor pour la convertir
            en application mobile.
          </p>
          <h2 class="mt-2 text-2xl font-bold">
            Remerciement
          </h2>
          <p class="mb-2">
            Icônes : <a href="https://iconscout.com/icon-pack/weather-forecast-outline-flat" target="_blank"
                        class="text-gray-100 hover:text-gray-300">Weather Forecast Outline Flat Icon Pack</a> par <a
              href="https://iconscout.com/contributors/petai-jantrapoon" target="_blank"
              class="text-gray-100 hover:text-gray-300">Petai Jantrapoon</a>
          </p>
          <p>
            Loader : <a target="_blank" class="text-gray-100 hover:text-gray-300"
                        href="https://iconscout.com/lottie/rainbow-4410158">Rainbow Animated Icon</a> par <a
              target="_blank" class="text-gray-100 hover:text-gray-300"
              href="https://iconscout.com/contributors/paaniizk">paniz</a>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>