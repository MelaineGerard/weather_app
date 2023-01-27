import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CitiesView from '../views/CitiesView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      props: route => ({ cityProps: route.query.city })
    },
    {
      path: '/cities',
      name: 'cities',
      component: CitiesView
    }
  ]
})

export default router
