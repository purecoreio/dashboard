<template>
  <div>
    <v-dialog v-model="dialog" max-width="290">
      <v-card>
        <v-card-title class="headline"> Remove this network? </v-card-title>
        <v-card-text>This action can't be rolled back</v-card-text>
        <v-card-actions>
          <v-btn text @click="deleteNetwork()"> Yes </v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" depressed @click="dialog = false"> No </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-alert text color="warning">
      Warning. These options can cause irreparable damage to your data.
    </v-alert>
    <v-list>
      <v-list-item @click="dialog = true">
        <v-list-item-icon>
          <v-icon> delete </v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title> Delete Network </v-list-item-title>
          <v-list-item-subtitle>
            This action can't be rolled back
          </v-list-item-subtitle>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </div>
</template>
<script>
export default {
  methods: {
    deleteNetwork() {
      let main = this;
      let n = this.$purecore.getContext().getNetwork();
      n.delete(true).finally(() => {
        localStorage.removeItem(btoa("purecore-n"));
        main.$router.push({ path: "/select/" });
      });
    },
  },
  data: () => {
    return {
      dialog: false,
    };
  },
};
</script>