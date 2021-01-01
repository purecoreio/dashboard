S<template>
  <SubNav
    :title="name"
    :items="[
      { name: 'Console', link: `/network/instance/${this.instance}/console/` },
      { name: 'Health', link: `/network/instance/${this.instance}/health/` },
      { name: 'Setup', link: `/network/instance/${this.instance}/setup/` },
      { name: 'Image', link: `/network/instance/${this.instance}/image/` },
    ]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>
<script>
export default {
  props: ["instance"],
  data: () => {
    return {
      name: "Instance",
    };
  },
  mounted() {
    this.name = this.instance;
    console.log(this.$purecore)
    this.$purecore.getInstance(this.name).then((instance) => {
      this.name = instance.name;
    });
  },
};
</script>