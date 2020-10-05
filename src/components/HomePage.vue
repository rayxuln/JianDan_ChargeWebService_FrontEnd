<template>
<a-layout id="main-layout">
    <a-layout-sider v-model="sider_collapesd"  collapsible>
        <div id="main-title" v-bind:class="{'small-title':sider_collapesd}"> 简单 </div>
        <a-menu theme="dark" mode="inline" :default-selected-keys="sider_menu_default_keys" @select="onSiderMenuItemSelected">
            <a-menu-item key="Info">
                <a-icon type="user" />
                <span> 信息 </span>
            </a-menu-item>
            <a-menu-item key="EmployeeManagement">
                <a-icon type="team" />
                <span> 管理员工 </span>
            </a-menu-item>
            <a-menu-item key="Charge">
                <a-icon type="dollar" />
                <span> 收费 </span>
            </a-menu-item>
            <a-menu-item key="ChargeSearch">
                <a-icon type="table" />
                <span> 收费查询 </span>
            </a-menu-item>
            <a-menu-item id="#logout-menu-item" key="Logout">
                <a-icon type="logout" />
                <span> 登出 </span>
            </a-menu-item>
        </a-menu>
    </a-layout-sider>

    <a-layout>
        <a-layout-content id="content-layout">
            <transition name="slide-fade" mode="out-in">
            <router-view></router-view>
            </transition>

            <div style="text-align: center; margin-bottom: 25px;">
                简单 ©2020 UI Created by Raiix
            </div>
        </a-layout-content>
    </a-layout>
</a-layout>
</template>

<script>
import util from "../util"

export default {
    name: "HomePage",
    head: {
        title: "简单"
    },
    data: function() {
        return {
            sider_collapesd: true,
            sider_menu_default_keys: ["Info"]
        }
    },
    created: function(){
        if(this.$route.name !== this.sider_menu_default_keys[0])
        {
            this.$router.push({name:this.sider_menu_default_keys[0]})
        }
    },
    methods: {
        onSiderMenuItemSelected: function(event) {
            if(event.key === "Logout")
            {
                this.$store.commit("logout")
                let token = util.getCookie("token")
                fetch("/api/logout?token=" + token)
                util.deleteCookie("token")
                this.$router.push({name:"Login"})
                return
            }
            this.$router.push({name:event.key})
        }
    }
}
</script>

<style scoped>
#logout-menu-item{
    background-color: red;
}

#main-layout {
    height: 100%;
    text-align: left;
}

#content-layout {
    padding: 25px;
    overflow: initial;
}

#main-title {
    margin-top: 25px;
    margin-bottom: 25px;
    font-size: 72px;
    color: #e4effe;
    text-align: center;

    transition: font-size 0.3s;
}
#main-title.small-title{
    font-size: 30px;
}

.trigger {
    font-size: 18px;
    line-height: 64px;
    padding: 0 24px;
    cursor: pointer;
    transition: color 0.3s;
}

.trigger:hover {
    color: #1890ff;
}
</style>