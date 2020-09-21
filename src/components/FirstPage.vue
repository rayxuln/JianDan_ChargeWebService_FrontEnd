<template>
    <div>
        <a-layout>

            <a-layout-header>这是头部</a-layout-header>

            <a-layout-content>
                <div>
                    <a-button type='primary' v-on:click='on_button_clicked'> 好吧 </a-button>
                </div>
            </a-layout-content>

            <a-layout-footer>这是脚部</a-layout-footer>
        </a-layout>
    </div>
</template>

<script>
export default {
    head: {
        title: '简单'
    },
    name: "FirstPage",
    methods: {
        on_button_clicked: function() {
            alert("How dare you!")
        }
    }
}
</script>

<style scoped>

</style>