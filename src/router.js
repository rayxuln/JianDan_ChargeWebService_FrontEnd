import Vue from 'vue'
import VueRouter from 'vue-router'

// components
import HelloWorld from './components/HelloWorld.vue';
import HomePage from './components/HomePage.vue';
import NotFound from './components/NotFound.vue';
import LoginPage from './components/LoginPage.vue';

import InfoSubpage from './components/subpages/InfoSubpage.vue';
import EmployeeManagementSubpage from './components/subpages/EmployeeManagementSubpage.vue';
import ChargeSubpage from './components/subpages/ChargeSubpage.vue';
import ChargeSearchSubpage from './components/subpages/ChargeSearchSubpage.vue';

Vue.use(VueRouter);

const routes = [
  { name: "Home", path: "/home", component: HomePage,
    children: [
      { name: "Info", path: "info", component: InfoSubpage },
      { name: "EmployeeManagement", path: "employeemanagement", component: EmployeeManagementSubpage },
      { name: "Charge", path: "charge", component: ChargeSubpage },
      { name: "ChargeSearch", path: "chargesearch", component: ChargeSearchSubpage },
    ]
  },
  { name: "Login", path: "/login", component: LoginPage },
  { name: "Hi", path: "/hi", component: HelloWorld },
  { path: "/", redirect: "/home"},
  { name: "NotFound", path: "/*", component: NotFound },
]

export const router = new VueRouter({
  mode: 'history',
  routes
});

