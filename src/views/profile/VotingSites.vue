<template>
  <div>
    <v-alert text color="primary">
      This feature is only intended for voting sites owners. This means this
      isn't designed for users using those voting sites, but to the people
      owning them. If you are a server list website with voting features, you
      can apply in order to use this feature and get your site popularity in
      relation to other listing providers.
    </v-alert>
    <v-card outlined>
      <v-list class="mb-3">
        <v-list-item>
          <v-list-item-content>
            <center>You dont own any voting sites</center>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
    <div class="text-right mt-3">
      <v-btn color="primary" depressed> Add Site </v-btn>
    </div>
  </div>
</template>