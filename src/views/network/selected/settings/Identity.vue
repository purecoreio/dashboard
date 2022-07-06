<template>
  <v-alert class="mb-2" v-if="error" color="primary">
    {{ error }}
  </v-alert>
  <v-card class="pa-5">
    <v-row>
      <v-col cols="12">
        <v-text-field
          @keyup.enter="updateIdentity()"
          :disabled="loading"
          v-model="name"
          hide-details
          label="name"
          variant="outlined"
        />
      </v-col>
      <v-col cols="12">
        <v-text-field
          @keyup.enter="updateIdentity()"
          :disabled="loading"
          v-model="cname"
          hide-details
          label="cname"
          variant="outlined"
        />
      </v-col>
      <v-col align="right" cols="12">
        <v-btn
          :disabled="loading"
          @click="updateIdentity()"
          append-icon="mdi-content-save"
        >
          Save
        </v-btn>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  props: ["network"],
  data() {
    return {
      loading: false,
      name: null,
      cname: null,
      error: null,
    };
  },
  mounted() {
    this.name = this.network.name;
    this.cname = this.network.cname;
  },
  methods: {
    async updateIdentity() {
      this.loading = true;
      try {
        await this.network.update(this.name, this.cname);
        this.error = null;
      } catch (error) {
        this.error = error.message;
      }
      this.loading = false;
    },
  },
};
</script>
