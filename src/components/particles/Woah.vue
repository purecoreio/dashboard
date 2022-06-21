<template>
    <Particles id="tsparticles" :particlesInit="particlesInit" :particlesLoaded="particlesLoaded"
        :options="particles" />
</template>
<script>
import { loadFull } from "tsparticles";
import particles from "@/assets/particles/absorber.json"


export default {
    data: () => {
        return {
            particles: particles
        }
    },
    methods: {
        particlesInit: async (engine) => {
            await loadFull(engine);
        },
        particlesLoaded: async (container) => {
            console.log("Particles container loaded", container);
        }
    }
}
</script>