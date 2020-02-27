<template>
  <div>
    <v-dialog v-model="create.dialog" max-width="600px">
      <v-card class="pa-5">
        <v-row>
          <v-col cols="12">
            <v-text-field outlined hide-details v-model="create.title" label="Title" required></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              outlined
              hide-details
              v-model="create.description"
              label="Description"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters justify="center" align="center">
          <v-col cols="12" align="right">
            <v-btn color="secondary" class="mr-1" text @click="create.dialog = false">Cancel</v-btn>
            <v-btn
              color="primary"
              :loading="create.loading"
              :disabled="create.loading"
              text
              @click="createSection()"
            >Create</v-btn>
          </v-col>
        </v-row>
      </v-card>
    </v-dialog>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-expand-transition>
      <v-alert v-show="error!=''" color="primary" text>This feature is still under development.</v-alert>
    </v-expand-transition>
    <div v-if="sections==null">
      <v-card class="pa-2" v-for="i in 2" :key="i">
        <v-skeleton-loader type="heading" />
        <v-skeleton-loader type="list-item-two-line" v-for="i in 5" :key="i" />
      </v-card>
    </div>
    <div v-if="sections!=null">
      <Section :section="section" v-for="section in sections" :key="section.uuid" />
      <div class="d-flex justify-end mb-5">
        <v-btn @click="create.dialog=true" color="primary" depressed>
          create
          <v-icon class="ml-2">add</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>


<script>
import core from "purecore";
import Section from "./Section";
export default {
  name: "ForumSections",
  components: {
    Section: Section
  },
  data: () => ({
    create: {
      dialog: null,
      title: "",
      description: "",
      loading: false
    },
    location: [
      {
        text: "Community",
        disabled: true,
        href: ""
      },
      {
        text: "Forum",
        disabled: false,
        href: "#"
      }
    ],
    network: null,
    sections: null,
    error: ""
  }),
  mounted() {
    if (localStorage.session && localStorage.network) {
      var coreInstance = new core(JSON.parse(localStorage.session));
      this.network = coreInstance.getInstance(localStorage.network).asNetwork();
    }
  },
  methods: {
    createSection: function() {
      let main = this;
      if (!main.create.loading) {
        main.create.loading = true;
        main.network
          .getForum()
          .createSection(main.create.title, main.create.description)
          .then(function() {
            main.create.loading = false;
            main.create.dialog = false;
            main.getSections();
          })
          .catch(function(err) {
            main.create.loading = false;
            main.error = err.message;
          });
      }
    },
    getSections: function() {
      let main = this;
      main.sections = null;
      main.error = "";
      if (main.network != null) {
        main.network
          .getForum()
          .getSections()
          .then(function(sections) {
            main.error = "";
            main.sections = sections;
          })
          .catch(function(err) {
            main.error = err.message;
          });
      }
    }
  },
  watch: {
    network: function() {
      this.getSections();
    }
  }
};
</script>
