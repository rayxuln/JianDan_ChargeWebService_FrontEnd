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
import util from "./util"

export default {
  name: 'App',
  store,
  created: function() {
    // Register global route guard
    // this.$router.beforeEach((to, from, next) => {
    //   // console.log("Detect route changing!")
    //   // console.log(to)
    //   if(to.name !== "Login" && !this.hasLogin) next({name: "Login"})
    //   else next()
    // })

    // 检查cookie中是否有token
    var that = this
    
    let token = util.getCookie("token")
    console.log("get old token: " + token)
    if(token !== "")
    {
      setTimeout(function(){
      // 调用api检查token的合法性
      fetch("/api/check_token?token="+token).then(function(res){
        res.json().then(function(res){
          if(res.code === 0)
          {
            var is_valid = res.data.valid
            console.log("token valid: " + is_valid)
            if(is_valid)
            {
              that.$store.commit("login")
              setTimeout(that.jump_to_home_page, 1000)
            }else{
              setTimeout(that.jump_to_login_page, 1000)
            }
          }else{
            console.error("check_token API fail!")
          }
        })
      })
      }, 50)
    }else{// 若不通过则重新登陆
      that.jump_to_login_page()
    }
  },
  computed: {
    ...mapGetters(["hasLogin"])
  },
  methods: {
    jump_to_login_page: function() {
      if(this.$route.name !== "Login")
      {
        this.$router.push({name: "Login"})
      }
    },
    jump_to_home_page: function() {
      if(this.$route.path.indexOf("home") === -1)
      {
        this.$router.push({name: "Home"})
      }
    }
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
