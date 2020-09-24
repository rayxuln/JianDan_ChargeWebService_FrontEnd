import Vue from 'vue'
import App from './App.vue'
import VueMeta from 'vue-meta'
import './ant_design_load'

import { router } from "./router"

Vue.config.productionTip = false;

Vue.use(VueMeta, {
  keyName: 'head'
});



new Vue({
  router: router,
  render: h => h(App),
  created: function() {
    console.log("666")
  }
}).$mount('#app')
