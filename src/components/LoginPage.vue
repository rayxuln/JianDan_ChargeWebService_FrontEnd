<template>
<div id="login-page">
    <div id="title"> 登陆 <router-link to="/"> 简单 </router-link> </div>


    <div id="login-box">
        <a-row type="flex" justify="center" :gutter="[0,15]">
        <a-col :span='24'>
        <div> 
            <a-input ref="userNameInput" placeholder="员工号" v-model="user">
            <a-icon slot="prefix" type="user" />
            <a-tooltip slot="suffix" title="请输入员工号">
                <a-icon type="info-circle" style="color: rgba(0,0,0,.45)" />
            </a-tooltip>
            </a-input>

            <a-alert
                v-if="show_user_error"
                :message="user_error_msg"
                type="error"
                show-icon
            />

            <a-alert
                v-if="show_fail_too_much_error"
                :message="fail_much_error_msg"
                type="error"
                show-icon
            />
        </div>
        </a-col>
        </a-row>

        <a-row type="flex" justify="center" :gutter="[0,15]">
        <a-col :span='24'>
        <div>
            <a-input-password placeholder="密码" v-model="pwd"> <a-icon slot="prefix" type="lock" /> </a-input-password> 
            <a-alert
                v-if="show_pwd_error"
                :message="pwd_error_msg"
                type="error"
                show-icon
            />
            </div>
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

import util from "../util"

export default {
    name: "LoginPage",
    data: function() {
        return {
            user: "",
            pwd: "",
            show_user_error: false,
            show_pwd_error: false,
            show_fail_too_much_error: false,
            user_error_msg: '员工号错误！',
            pwd_error_msg: '密码错误！',
            fail_much_error_msg: ''
        }
    },
    head: {
        title: "登陆"
    },
    methods: {
        ...mapMutations(['login']),
        validUser: function(v) {
            return v !== "" && !(/[^a-z0-9]+/g.test(v))
        },
        validPwd: function(v) {
            return v !== ""
        },
        onLoginButtonClicked: function() {
            this.show_user_error = false
            this.show_pwd_error = false
            if(!this.validUser(this.user))
            {
                this.show_user_error = true
                this.user_error_msg = '不合法的员工号！'
                return
            }
            if(!this.validPwd(this.pwd))
            {
                this.show_pwd_error = true
                this.pwd_error_msg = '不合法的密码！'
                return
            }

            // Call api after the pre-validation
            var that = this
            fetch("/api/login?user="+this.user+"&pwd="+this.pwd).then(function(res){
                res.json().then(function(res){
                    //console.log(res)
                    that.show_fail_too_much_error = false
                    // document.cookie="token="
                    util.deleteCookie("token")
                    if(res.code === 0)
                    {// login successfully
                        let token = res.data.token
                        // document.cookie="token="+token
                        util.setCookie("token", token, 1)

                        that.show_user_error = false
                        that.show_pwd_error = false

                        that.login()
                        util.message.success("登陆成功！")
                        that.$router.push({name:"Home"})
                    }else if(res.code === -1)
                    {// wrong user name
                        that.show_user_error = true
                        that.show_pwd_error = false
                        that.user_error_msg = res.msg
                    }else if(res.code === -2)
                    {// wrong password
                        that.show_user_error = false
                        that.show_pwd_error = true
                        that.pwd_error_msg = res.msg
                    }else if(res.code === -3)
                    {// login fail too many time
                        that.show_fail_too_much_error = true
                        that.fail_much_error_msg = res.msg
                    }
                })
            })
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