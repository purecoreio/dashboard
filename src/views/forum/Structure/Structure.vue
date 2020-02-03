<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-expand-transition>
      <v-alert v-show="error!=''" color="primary" text>This feature is still under development.</v-alert>
    </v-expand-transition>
    <div v-if="sections!=null">
      <Section :section="section" v-for="section in sections" :key="section.uuid" />
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
    location: [
      {
        text: "Forum",
        disabled: true,
        href: ""
      },
      {
        text: "Structure",
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
  watch: {
    network: function(network) {
      let main = this;
      if (network != null) {
        network
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
  }
};
</script>
