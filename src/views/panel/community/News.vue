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
  name: "ForumNews",
  data: () => ({
    location: [
      {
        text: "Community",
        disabled: true,
        href: ""
      },
      {
        text: "News",
        disabled: false,
        href: "#"
      }
    ]
  })
};
</script>
