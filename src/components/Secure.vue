<template>
  <v-menu transition="scale-transition" origin="top right" left open-on-hover>
    <template v-slot:activator="{ on, attrs }">
      <v-btn icon v-bind="attrs" v-on="on">
        <v-icon> https </v-icon>
      </v-btn>
    </template>
    <v-card outlined class="pa-3 text-justify" style="max-width: 400px">
      Sensitive data is not stored by purecore. Since we aim to offer a secure
      service, your data will be safely stored and propperly encrypted by
      Stripe, same guys managing payments for Discord, Spotify, Reddit and
      <a target="_blank" href="https://stripe.com/customers">many more</a>
      <v-img
        style="margin-left: auto"
        width="150px"
        :src="
          require(`@/assets/gateways/stripe/powered/${
            $vuetify.theme.dark ? 'dark' : 'light'
          }.svg`)
        "
      />
    </v-card>
  </v-menu>
</template>