<template>
  <v-row class="mb-4" align="center">
    <v-col cols="auto">
      <back-arrow />
    </v-col>
    <v-col>
      <h1>Create a new network</h1>
    </v-col>
  </v-row>
  <v-row>
    <v-col cols="12">
      <v-expand-transition>
        <v-alert v-show="this.error" variant="contained-text" color="primary" class="mb-7">
          {{ error }}
        </v-alert>
      </v-expand-transition>
      <v-text-field :disabled="loading" v-model="name" autofocus hide-details label="Network Name" variant="outlined"
        @keyup.enter="submit" />
    </v-col>
    <v-col cols="12">
      <v-text-field :disabled="loading" v-model="cname" @keydown="manuallyChangedCname = true" hide-details
        label="Subdomain" variant="outlined" @keyup.enter="submit" />
    </v-col>
    <v-col class="text-right" cols="12">
      <v-btn @click="submit" :disabled="loading" append-icon="mdi-keyboard-return">
        Submit
      </v-btn>
    </v-col>
    <v-col cols="12">
      <v-divider />
    </v-col>
    <v-col cols="12">
      <v-card variant="contained-text" style="height: 400px; overflow: hidden">
        <v-row no-gutters>
          <v-col cols="12">
            <v-text-field append-inner-icon="mdi-dots-horizontal" bg-color="black" disabled
              :label="cname ? `${cname}.purecore.io` : '...'" variant="contained" single-line />
          </v-col>
          <v-col class="text-center" cols="12">
            <div style="
                max-width: 300px;
                margin-left: auto;
                margin-right: auto;
                overflow: hidden;
              ">
              <h4>Welcome to...</h4>
              <h2>{{ name }}</h2>
            </div>
          </v-col>
          <v-col cols="12">
            <v-card class="mt-3 pa-2" variant="contained-text"
              style="width: 50%; height: 1000px; margin-left: auto; margin-right: auto" />
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>
<script>
import BackArrow from "@/components/buttons/BackArrow.vue";
export default {
  data() {
    return {
      manuallyChangedCname: false,
      name: null,
      cname: null,
      error: null,
      loading: false,
    };
  },
  components: {
    BackArrow,
  },
  methods: {
    async submit() {
      this.loading = true;
      try {
        this.$router.push(
          `/network/${(await this.context.user.createNetwork(this.name, this.cname)).id}`
        );
      } catch (error) {
        this.error = error.message;
      }
      this.loading = false;
    },
  },
  watch: {
    cname(cname) {
      this.cname = cname.toLowerCase()
    },
    name(name) {
      if (!this.manuallyChangedCname) {
        this.cname = name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
      }
    },
  },
};
</script>
