<template>
  <v-card class="mb-4" outlined>
    <v-list class="pt-0 pb-0">
      <v-subheader>{{ title }}</v-subheader>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon> schedule </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ session }}' average play session
          </v-list-item-title>
          <v-list-item-subtitle>
            the average playtime from long-standing (7>m) play sessions. the
            play session is calculated via the amount of time the player has
            played on the network during that connection group
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon> login </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title> {{ rate }}% login rate </v-list-item-title>
          <v-list-item-subtitle>
            the weekly login rate during the previous 7 days of the payment
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon> visibility </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title> {{ visits }} webstore visits </v-list-item-title>
          <v-list-item-subtitle>
            The number of unique visits the player visited the store 3h before
            of the actual payment
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon> hourglass_empty </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ playtime }} playtime minutes
          </v-list-item-title>
          <v-list-item-subtitle>
            Playtime is a very limitting factor for most customers. This filter
            will make detecting interested and active players easier.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon> account_balance_wallet </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            likely to spend {{ amount }} EUR
          </v-list-item-title>
          <v-list-item-subtitle>
            The first payment amount is important, so you know how much
            potential revenue you can get from a certain player.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-avatar>
          <v-icon> call </v-icon>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>
            {{ calltime }}' of total talktime
          </v-list-item-title>
          <v-list-item-subtitle>
            When using the Discord plugin, purecore can easily track the amount
            of time people spend together talking.
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-card>
</template>
<script>
export default {
  props: ["amount", "playtime", "visits", "rate", "session", "title", "calltime"],
};
</script>