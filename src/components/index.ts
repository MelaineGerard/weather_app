import type {App} from "vue";
import Title from './Title.vue'
export function registerComponents(app: App) {
    app.component('title', Title)
}