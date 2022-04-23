<template>
    <v-card class="pa-5">
        <v-row>
            <v-col cols="12">
                <v-text-field :disabled="!path" :loading="!path" v-model="path" variant="outlined" label="path"
                    hide-details />
            </v-col>
            <v-col cols="12">
                <v-text-field disabled :loading="!key" variant="outlined" type="password" label="key" hide-details />
            </v-col>
            <v-col cols="12" class="text-right">
                <v-btn @click="save()" prepend-icon="mdi-content-save">
                    Save
                </v-btn>
            </v-col>
        </v-row>
    </v-card>
    <v-btn @click="remove()" block variant="outlined" color="red" class="mt-5">
        Delete Instance
    </v-btn>
</template>

<script>
export default {
    props: ["instance"],
    data() {
        return {
            path: null,
            key: null,
        }
    },
    methods: {
        async remove(){
            await this.instance.delete()
            this.$router.replace("../")
        },
        async save() {
            const path = this.path
            this.path = null
            await this.instance.update(path)
            this.path = this.instance.path
        }
    },
    mounted() {
        this.path = this.instance.path
    }
}
</script>