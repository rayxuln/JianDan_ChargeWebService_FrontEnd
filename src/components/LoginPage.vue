<template>
<div id="login-page">
    <div id="title"> 登陆 <router-link to="/"> 简单 </router-link> </div>


    <div id="login-box">
        <a-row type="flex" justify="center" :gutter="[0,15]">
        <a-col :span='24'>
        <div> 
            <a-input ref="userNameInput" placeholder="员工号">
            <a-icon slot="prefix" type="user" />
            <a-tooltip slot="suffix" title="请输入员工号">
                <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
            </a-input>
        </div>
        </a-col>
        </a-row>

        <a-row type="flex" justify="center" :gutter="[0,15]">
        <a-col :span='24'>
        <div> <a-input-password placeholder="密码" /> </div>
        </a-col>
        </a-row>

        <a-row type="flex" justify="center" :gutter="[0,15]">
        <a-col :span='4'>
        <a-button type="primary" @click="onLoginButtonClicked"> 登陆 </a-button>
        </a-col>
        </a-row>
    </div>

</div>
</template>

<script>
import { mapMutations } from "vuex"

export default {
    name: "LoginPage",
    head: {
        title: "登陆"
    },
    methods: {
        ...mapMutations(['login']),
        onLoginButtonClicked: function() {
            this.login()
            this.$router.push({name:"Home"})
        }
    }
}
</script>

<style scoped>
#title {
  font-size: 72px;
  text-align: center;
  margin-top: 60px;
}
#login-box {
    background-color: white;
    border-radius: 5px;
    border-style: solid;
    border-width: 1px;
    border-color: #E8E8E8;
    box-shadow: 0px 0px 50px #E8E8E8;
    padding: 25px;
    padding-top: 50px;
    padding-bottom: 15px;
    margin-bottom: 50px;
    width: 550px;
    margin-left: auto;
    margin-right: auto;
}
</style>