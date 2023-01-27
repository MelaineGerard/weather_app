<script lang="ts">
import {defineComponent} from 'vue'
import Navbar from "@/components/Navbar.vue";
import Title from "@/components/Title.vue";

export default defineComponent({
  components: {Navbar, Title},
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
        <Navbar/>
      </div>
      <div class="flex items-center justify-center flex-col">
        <div class="w-64 text-justify">
          <Title text="A propos" class="mt-2"/>
          <p class="mb-4">
            Cette application météo a été développé dans le cadre d'un cours de Développement mobile au sein du campus
            Ynov de Rennes.
          </p>
          <p>
            Elle a été réalisé avec le framework Vue.JS pour la partie Front et la librairie Capacitor pour la convertir
            en application mobile.
          </p>
          <Title text="Remerciement" class="mt-2"/>
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