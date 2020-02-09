<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>
    <ExampleAnalytics/>
  </div>
</template>


<script>
import ExampleAnalytics from '../../components/Analytics/ExampleAnalytics'
export default {
  name: "AnalyticsGeneral",
  components: {
    ExampleAnalytics
  },
  data: () => ({
    location: [
      {
        text: "Analytics",
        disabled: true,
        href: ""
      },
      {
        text: "General",
        disabled: false,
        href: "#"
      }
    ]
  })
};
</script>
