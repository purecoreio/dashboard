<template>
    <router-view v-if="instance" :network="network" :instance="instance" />
</template>
<script>
export default {
    props: ["network"],
    data() {
        return {
            instance: null
        }
    },
    async beforeMount() {
        this.instance = await this.network.getInstance(this.$route.params.instance)
    }
}
</script>