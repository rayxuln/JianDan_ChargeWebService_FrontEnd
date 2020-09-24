<template>
  <div id="app">
    
    <transition name="slide-fade" mode="out-in">
    <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import { store } from "./store"
import { mapGetters} from "vuex"

export default {
  name: 'App',
  store,
  created: function() {
    // Register global route guard
    this.$router.beforeEach((to, from, next) => {
      // console.log("Detect route changing!")
      // console.log(to)
      if(to.name !== "Login" && !this.hasLogin) next({name: "Login"})
      else next()
    })

    //Check if has login, if not, jump to login page
    if(!this.hasLogin){
      this.$router.push({name: "Login"})
    }
  },
  computed: {
    ...mapGetters(["hasLogin"])
  },
  methods: {
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100%;
  /* text-align: center;
  color: #2c3e50;
  margin-top: 60px; */
}

.white-box {
    width: 100%;
    min-height: 93%;
    background-color: white;

    padding: 50px;
    margin-bottom: 25px;

    border-radius: 5px;
    border-style: solid;
    border-width: 1px;
    border-color: #E8E8E8;
    box-shadow: 0px 0px 50px #E8E8E8;
}

.slide-fade-enter-active {
  transition: all .1s ease;
}
.slide-fade-leave-active {
  transition: all .1s ease;
}
.slide-fade-enter, .slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
