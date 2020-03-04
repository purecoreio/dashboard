<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>
  </div>
</template>


<script>
export default {
  name: "WebsiteThemes",
  data: () => ({
    location: [
      {
        text: "Website",
        disabled: true,
        href: ""
      },
      {
        text: "Themes",
        disabled: false,
        href: "#"
      }
    ]
  })
};
</script>
