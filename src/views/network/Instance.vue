S<template>
  <SubNav
    :title="name"
    :items="[
      { name: $t('console'), link: `/network/instance/${this.instance}/console/` },
      { name: $t('health'), link: `/network/instance/${this.instance}/health/` },
      { name: $t('setup'), link: `/network/instance/${this.instance}/setup/` },
      { name: $t('image'), link: `/network/instance/${this.instance}/image/` },
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