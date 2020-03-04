<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>
    <v-list>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
              dark mode
          </v-list-item-title>
          <v-list-item-subtitle>
              no need to keep your sunglasses 🕶️
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-switch v-model="dark"></v-switch>
        </v-list-item-action>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          <v-list-item-title>
              new color scheme
          </v-list-item-title>
          <v-list-item-subtitle>
              burpple swag
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-switch v-model="enabled" disabled></v-switch>
        </v-list-item-action>
      </v-list-item>
    </v-list>
  </div>
</template>


<script>
export default {
  data: () => ({
    location: [
      {
        text: "Settings",
        disabled: true,
        href: ""
      },
      {
        text: "Theme",
        disabled: false,
        href: "#"
      }
    ],
    dark: false,
    enabled: true
  }),
  mounted() {
    if (localStorage.getItem("dark", null) != null) {
      var info = localStorage.getItem("dark") == "true";
      if (info) {
        this.dark = true;
      } else {
        this.dark = false;
      }
    }
  },
  watch: {
    dark: function() {
      if (this.dark) {
        this.$vuetify.theme.dark = true;
        localStorage.setItem("dark", true);
      } else {
        this.$vuetify.theme.dark = false;
        localStorage.setItem("dark", false);
      }
    }
  }
};
</script>
