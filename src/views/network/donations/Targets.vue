<template>
  <div>
    <v-alert text color="primary">
      purecore will automatically suggest products to players or their friends
      once they meet at least half of the criteria points with close to 80%
      values. When users become interested, likely gifters are also notified in
      order to increase the chances of a potential payment
    </v-alert>
    <likely-customer
      amount="5"
      playtime="32,000"
      visits="2"
      rate="40"
      session="5"
      title="Average First-time Customer"
      calltime="140"
    />
    <likely-customer
      amount="10"
      playtime="61,000"
      visits="7"
      rate="60"
      session="20"
      title="Average Second-time Customer"
      calltime="140"
    />
    <likely-gifter
      amount="10"
      playtime="61,000"
      visits="7"
      rate="60"
      session="20"
      title="Likely gifter"
      time="12,000"
      talktime="164"
    />
  </div>
</template>
<script>
import LikelyCustomer from "@/components/LikelyCustomer";
import LikelyGifter from "@/components/LikelyGifter";
export default {
  components: {
    LikelyCustomer,
    LikelyGifter,
  },
};
</script>