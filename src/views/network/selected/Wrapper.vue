<template>
  <router-view :network="network" />
</template>
<script>
export default {
  props: ["network"],
};
</script>
