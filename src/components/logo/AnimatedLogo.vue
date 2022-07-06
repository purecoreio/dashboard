<template>
  <div class="d-flex align-center justify-center">
    <v-img
      alt="purecore.io logo"
      class="logoAnimation mr-4"
      contain
      src="@/assets/isotype.png"
      max-width="40"
      scale-transition
    />
    <span class="mr-3 logoText" style="font-size: 30px; padding-bottom: 5px">
      purecore
      <v-chip color="primary" small> BETA </v-chip>
    </span>
  </div>
</template>

<script>
export default {
  name: "AnimatedLogo",
};
</script>

<style scoped>
.logoAnimation {
    animation: logoIntro;
    animation-delay: 200ms;
    animation-duration: 1s;
    animation-fill-mode: forwards;
}
.logoText {
  opacity: 0;
  color: #448aff;
  font-weight: 500;
  font-size: 20px;
  margin-bottom: 4px;
  animation: textIntro;
  animation-delay: 200ms;
  animation-duration: 1s;
  animation-fill-mode: forwards;
}

@keyframes textIntro {
  0% {
    opacity: 0;
    color: #448aff;
  }
  50% {
    opacity: 1;
    color: #448aff;
  }
  100% {
    opacity: 1;
    color: inherit;
  }
}

@keyframes logoIntro {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes betaFade {
  0% {
    transform: translateX(0px);
    opacity: 1;
  }
  100% {
    transform: translateX(-5px);
    opacity: 0;
  }
}

@keyframes logoReposition {
  0% {
    transform: translateX(0px);
  }
  100% {
    transform: translateX(20px);
  }
}
</style>