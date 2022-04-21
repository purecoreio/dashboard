<template>
  <div class="d-flex align-center logoWhole justify-center">
    <v-img
      alt="purecore.io logo"
      class="logoAnimation mr-4"
      contain
      src="@/assets/isotype.png"
      max-width="40"
      scale-transition
    />
    <span class="logoText mr-3" style="font-size: 30px; padding-bottom: 5px">
      purecore
      <v-chip color="primary" small class="betaChip"> BETA </v-chip>
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

.betaChip {
  padding-bottom: 2px !important;
  animation: betaFade;
  animation-delay: 3s;
  animation-duration: 200ms;
  animation-fill-mode: forwards;
}

.logoWhole {
  animation: logoReposition;
  animation-delay: 3s;
  animation-duration: 300ms;
  animation-fill-mode: forwards;
}

@keyframes textIntro {
  0% {
    opacity: 0;
    color: #448aff;
    transform: translateX(-20px);
  }
  50% {
    opacity: 1;
    color: #448aff;
    transform: translateX(0px);
  }
  100% {
    opacity: 1;
    color: inherit;
  }
}

@keyframes logoIntro {
  0% {
    transform: rotate(0deg);
    filter: grayscale(0);
  }
  50% {
    transform: rotate(360deg);
    filter: grayscale(0);
  }
  100% {
    transform: rotate(360deg);
    filter: grayscale(1);
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