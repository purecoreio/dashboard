<template>

    <v-menu>
        <template v-slot:activator="{ props }">
            <v-btn variant="text" v-bind="props">
                I don't plan on moving my server
            </v-btn>
        </template>
        <v-card class="text-white" max-width="400px">
            <v-window v-model="feedback">
                <v-window-item :value="0">
                    <v-list>
                        <v-list-item @click="feedback = 1">
                            <v-list-item-title>I'm using a dedicated machine</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="feedback = 2">
                            <v-list-item-title>I'm fine with my current pricing</v-list-item-title>
                        </v-list-item>
                    </v-list>
                </v-window-item>

                <v-window-item :value="1">
                    <div class="text-justify px-5 py-3">
                        You can use purecore hosting on your own machine! Manage your server directly from the purecore
                        panel and be aware of problems as soon as soon as they happen. You can safely share console
                        input, console read, and other managment options with your staff.
                        <v-divider class="my-3" />
                        <v-row no-gutters>
                            <v-col cols="auto">
                                <v-btn variant="text" :color="null" @click="feedback = 0">
                                    Back
                                </v-btn>
                            </v-col>
                            <v-spacer />
                            <v-col cols="auto">
                                <v-btn>
                                    Learn More
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </v-window-item>

                <v-window-item class="pa-3" :value="2">
                    <div class="px-2">
                        <span class="text-overline">Are you sure you are using a hosting that suits you?</span>
                        <v-divider class="my-3" />
                    </div>
                    <v-row>
                        <v-col cols="12">
                            <v-subheader class="pl-2">Memory: {{ Math.pow(2, ramAmount) }}GB</v-subheader>
                            <v-slider color="primary" hide-details v-model="ramAmount" step="1" :tick-size="1"
                                :show-ticks="true" :min="1" :max="7"></v-slider>
                        </v-col>
                    </v-row>
                    <div class="px-2">
                        <v-row>
                            <v-col>
                                <v-text-field variant="outlined" hide-details label="Monthly Rate" />
                            </v-col>
                            <v-col>
                                <v-select :items="currencies" hide-details variant="outlined" label="Currency" />
                            </v-col>
                        </v-row>
                        <v-divider class="my-3" />
                        <v-row>
                            <v-col cols="auto">
                                <v-btn variant="text" :color="null" @click="feedback = 0">
                                    Back
                                </v-btn>
                            </v-col>
                            <v-spacer />
                            <v-col cols="auto">
                                <v-btn @click="compare()">
                                    Next
                                </v-btn>
                            </v-col>
                        </v-row>
                    </div>
                </v-window-item>
            </v-window>
        </v-card>
    </v-menu>
</template>

<script>
export default {
    computed: {
        actualRamAmount() {
            return 2 ^ this.ramAmount
        }
    },
    data: () => {
        return {
            feedback: 0,
            ramAmount: 3,
            maxMemoryOffer: 16,
            memorySlider: true,
            currencies: ["EUR", "USD"]
        }
    }
}
</script>