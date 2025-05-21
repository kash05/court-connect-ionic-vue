import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { IonicVue } from '@ionic/vue';
import router from './router';
import GlobalMessage from '@/components/GlobalMessage.vue';

import '@ionic/vue/css/core.css';
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';
import 'leaflet/dist/leaflet.css';

// Global CSS
import '@/theme/global.scss';

// Variables CSS
import '@/theme/variables.scss';

import '@ionic/vue/css/ionic.bundle.css';

import App from './App.vue';

const pinia = createPinia();

const app = createApp(App)
  .use(IonicVue, { mode: 'ios', animated: true })
  .use(pinia)
  .use(router)
  .component('GlobalMessage', GlobalMessage);

router.isReady().then(() => {
  app.mount('#app');
});
