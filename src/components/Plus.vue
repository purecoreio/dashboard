<template>
  <div
    v-if="
      (this.$purecore.getContext().subscriptionStatus != null &&
        !this.$purecore.getContext().subscriptionStatus.plus) ||
      this.$purecore.getContext().subscriptionStatus == null
    "
    style="display: inline-block"
  >
    <v-tooltip color="primary" max-width="300px" bottom>
      <template v-slot:activator="{ on }">
        <v-btn small icon v-on="on">
          <v-icon small>arrow_circle_up</v-icon>
        </v-btn>
      </template>
      This is a purecore plus feature, click here to upgrade your subscription
    </v-tooltip>
  </div>
</template>