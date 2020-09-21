import Vue from 'vue'
import App from './App.vue'
import VueMeta from 'vue-meta';
import { Button } from 'ant-design-vue';

Vue.config.productionTip = false

Vue.use(VueMeta, {
  keyName: 'head'
});

Vue.component(Button.name, Button)

new Vue({
  render: h => h(App),
  created: function() {
    console.log("666")
  }
}).$mount('#app')
