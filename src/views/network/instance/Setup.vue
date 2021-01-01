<template>
  <div>
    <v-card class="pa-2 pr-6 pl-6">
      <v-row align="center">
        <v-col class="flex-shrink-0 flex-grow-1">
          <v-text-field
            :loading="key == null"
            readonly
            v-model="key"
            label="Instance Key"
            type="password"
            outlined
            hide-details=""
          >
          </v-text-field>
        </v-col>
        <v-col class="flex-shrink-1 flex-grow-0">
          <v-btn
            v-clipboard:copy="key"
            :disabled="key == null"
            x-large
            color="primary"
            depressed
          >
            <v-icon>content_copy</v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>
<script>
export default {
  props: ["instance"],
  mounted() {
    /*this.$purecore
      .getInstance(this.instance)
      .getKeys()
      .then((keys) => {
        this.key = keys[0].hash;
      });*/
    this.key = "*****************************************************************";
  },
  data: () => {
    return {
      key: null,
    };
  },
};
</script>