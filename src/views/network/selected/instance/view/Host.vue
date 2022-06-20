<template>
    <v-row>
        <v-col v-for="plan in plans" :key="plan.id" cols="12" md="4">
            <v-card>
                <div class="pa-5 text-center">
                    {{ plan.name }}
                </div>
                <v-divider />
                <v-list>
                    <v-list-item>
                        <v-row align="center" no-gutters>
                            <v-col>
                                CPU
                            </v-col>
                            <v-col cols="auto">
                                <v-chip :href="sanitizedCPU(plan.cpu.model)" color="primary" label>
                                    {{ plan.cpu.model }}
                                    <v-tooltip activator="parent" location="start">
                                        <v-row style="max-width:200px">
                                            <v-col>
                                                Frequency
                                            </v-col>
                                            <v-col cols="auto">
                                                {{ plan.cpu.frequency }}
                                            </v-col>
                                            <v-divider />
                                            <v-col>
                                                Benchmark
                                            </v-col>
                                            <v-col cols="auto">
                                                {{ plan.cpu.benchmark }}
                                            </v-col>
                                        </v-row>
                                    </v-tooltip>
                                </v-chip>
                            </v-col>
                        </v-row>
                    </v-list-item>
                </v-list>
            </v-card>

        </v-col>
    </v-row>
</template>

<script>
export default {
    methods: {
        sanitizedCPU(cpu) {
            return `https://versus.com/en/${String(cpu).replace(/[\W_]+/g," ").replace(/\s/g, "-").toLowerCase()}`
        }
    },
    data: () => {
        return {
            plans: [
                {
                    id: 0,
                    name: "alpha hardware 1",
                    price: 0,
                    cpu: {
                        model: "AMD Ryzen™ 5 3600",
                        benchmark: 1000,
                        frequency: "3.6GHz",
                        vcpus: 2
                    },
                    memory: 8,
                    storage: {
                        size: 40,
                        type: "NVMe SSD"
                    },
                    bandwidth: 1,
                    location: {
                        country: "Finnland",
                        region: "Helsinki"
                    }
                }
            ]
        }
    }
}
</script>