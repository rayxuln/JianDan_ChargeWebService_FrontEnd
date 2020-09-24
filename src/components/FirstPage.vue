<template>
    <div id="frame">
        <a-row type="flex" justify="center">
            <a-col :span='20'>
                <div id="window">
                    <div id="center-box">
                    <a-row class="window-row" type="flex" justify="center" align="middle" :gutter="[0,16]">
                        <a-col :span='9'>
                            <a-button v-on:click='on_enter_button_clicked'>测试入口</a-button>
                        </a-col>
                        <a-col :span='9'>
                            <a-button>正在建设中...{{test1}}</a-button>
                        </a-col>
                    </a-row>

                    <a-row class="window-row" type="flex" justify="center" align="middle" :gutter="[0,16]">
                        <a-col :span='9'>
                            <a-button>正在建设中...</a-button>
                        </a-col>
                        <a-col :span='9'>
                            <a-button>正在建设中...</a-button>
                        </a-col>
                    </a-row>

                    <a-row class="window-row" type="flex" justify="center" align="middle" :gutter="[0,16]">
                        <a-col :span='9'>
                            <a-button>正在建设中...</a-button>
                        </a-col>
                        <a-col :span='9'>
                            <a-button>正在建设中...</a-button>
                        </a-col>
                    </a-row>
                    </div>
                </div>
            </a-col>
        </a-row>
    </div>
</template>

<script>
import { mapState } from "vuex"

export default {
    head: {
        title: '简单'
    },
    name: "FirstPage",
    methods: {
        on_enter_button_clicked: function() {
            this.$router.push("/hi")
        }
    },
    computed:{
        ...mapState(['test1'])
    }
}
</script>

<style scoped>
#window {
    background-color: white;
    border-radius: 5px;
    border-style: solid;
    border-width: 1px;
    border-color: #E8E8E8;
    box-shadow: 0px 0px 50px #E8E8E8;
    padding: 5px;
    padding-top: 50px;
    padding-bottom: 15px;
    margin-bottom: 50px;
}
</style>