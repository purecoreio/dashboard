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
  name: "ForumActions",
  data: () => ({
    location: [
      {
        text: "Forum",
        disabled: true,
        href: ""
      },
      {
        text: "Actions",
        disabled: false,
        href: "#"
      }
    ]
  })
};
</script>
