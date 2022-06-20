<template>
    <v-card class="pa-5">
        <v-row>
            <v-col cols="12">
                <v-text-field :disabled="!path" :loading="!path" v-model="path" variant="outlined" label="path"
                    hide-details />
            </v-col>
            <v-col cols="12">
                <v-text-field disabled :loading="false" variant="outlined" type="password" label="key" hide-details />
            </v-col>
            <v-col cols="12" class="text-right">
                <v-btn @click="save()" prepend-icon="mdi-content-save">
                    Save
                </v-btn>
            </v-col>
        </v-row>
    </v-card>
    <v-alert class="pa-5 mt-3">
        <v-row no-gutters>
            <v-col class="px-4 pb-5" cols="12">
                <h3>
                    Host on purecore hosting
                </h3>
                <p>
                    Transfer your existing server to purecore hosting with no extra charge. We will handle the transfer
                    automatically and make sure it is performed as fast as possible using rsync and server-grade
                    connection
                    speeds.
                </p>
            </v-col>
            <v-col cols="auto">
                <dont-wanna-host />
            </v-col>
            <v-spacer />
            <v-col cols="auto">
                <v-btn>
                    Host<span v-if="showSuggestion"> for 3.99€/MO (4GB, autodetected)</span>
                </v-btn>
            </v-col>
        </v-row>
    </v-alert>
    <v-btn @click="remove()" block variant="outlined" color="red" class="mt-3">
        Delete Instance
    </v-btn>
</template>

<script>
import DontWannaHost from '../../../../../components/feedback/DontWannaHost.vue'
export default {
    props: ["instance"],
    data() {
        return {
            path: null,
            key: null,
            showSuggestion: false
        };
    },
    methods: {
        async remove() {
            await this.instance.delete();
            this.$router.replace("../");
        },
        async save() {
            const path = this.path;
            this.path = null;
            await this.instance.update(path);
            this.path = this.instance.path;
        }
    },
    mounted() {
        this.path = this.instance.path;
        setTimeout(() => {
            this.showSuggestion = true
        }, 1000);
    },
    components: { DontWannaHost }
}
</script>