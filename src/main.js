import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import VueMeta from 'vue-meta';
import { Button } from 'ant-design-vue';
import { Col, Row } from 'ant-design-vue';
import { Layout } from 'ant-design-vue';

// components
import HelloWorld from './components/HelloWorld.vue';
import FirstPage from './components/FirstPage.vue'

Vue.config.productionTip = false;

Vue.use(VueRouter);

const routes = [
  { path: "/", component: FirstPage },
  { path: "/hi", component: HelloWorld }
]
const router = new VueRouter({
  routes
});

Vue.use(VueMeta, {
  keyName: 'head'
});

Vue.component(Button.name, Button)
Vue.component(Col.name, Col)
Vue.component(Row.name, Row)
Vue.component(Layout.name, Layout)
Vue.component(Layout.Header.name, Layout.Header)
Vue.component(Layout.Content.name, Layout.Content)
Vue.component(Layout.Footer.name, Layout.Footer)

new Vue({
  router: router,
  render: h => h(App),
  created: function() {
    console.log("666")
  }
}).$mount('#app')
