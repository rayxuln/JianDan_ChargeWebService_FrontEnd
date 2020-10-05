<template>
    <div class="white-box">
        <a-icon v-if="!has_loaded_info" type="loading" />
    </div>
</template>

<script>
export default {
    name: "InfoSubpage",
    data: function() {
        return {
            has_loaded_info: false
        }
    }
}
</script>

<style scoped>
p {
    font-size: 32px;
}
</style>