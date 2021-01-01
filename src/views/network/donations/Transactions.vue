<template>
  <div>
    <revenueGraph />
    <div class="pt-4">
      <v-skeleton-loader
        v-for="i in 5"
        :key="i"
        class="mx-auto mb-2"
        type="list-item-avatar-two-line"
      ></v-skeleton-loader>
    </div>
  </div>
</template>

<script>
import revenueGraph from "@/components/RevenueGraph";
export default {
  components: {
    revenueGraph,
  },
  name: "Transactions",
  data: () => {
    return {
      items: ["December"],
      selected: "December",
      analytics: null,
      series: null,
    };
  },
};
</script>