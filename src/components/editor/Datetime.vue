<template>
    <v-menu ref="menu" v-model="picking" :close-on-content-click="false" transition="scale-transition" offset-y
        max-width="290px" min-width="290px">
        <template v-slot:activator="{ props }">
            <v-text-field :variant="variant" hide-details :label="label" readonly v-model="niceDatetime"
                prepend-inner-icon="mdi-clock" v-bind="props" />
        </template>
        <v-card>
            <v-date-picker v-if="!pickingTime" v-model="date" no-title scrollable />
            <v-time-picker v-if="pickingTime" v-model="time" full-width @click:minute="picking = false" />
        </v-card>
    </v-menu>
</template>
<script>
export default {
    props: ["modelValue", "label", "variant"],
    data() {
        return {
            picking: false,
            time: null,
            date: null,
            pickingTime: false
        }
    },
    computed: {
        niceDatetime() {
            return this.date && this.time ? `${this.date} ${this.time}` : null
        }
    },
    watch: {
        picking(value) {
            this.pickingTime = false
            if (!value) {
                let val = null
                if (!this.time || !this.date) {
                    this.time = null
                    this.date = null
                } else {
                    val = Date.parse(this.niceDatetime())
                }
                this.$emit("update:modelValue", val);
            }
        },
        date() {
            if (picking && !this.pickingTime) {
                this.pickingTime = true
            }
        },
        modelValue(value) {
            if (value) {
                this.date = value.toLocaleDateString()
                this.time = value.getHours() + ':' + value.getMinutes();
            } else {
                this.date = null
                this.time = null
            }
        }
    }
}
</script>