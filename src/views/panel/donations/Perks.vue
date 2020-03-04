<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>
    <v-alert color="primary" text>
      Using this feature is perfectly fine even with the Minecraft EULA in force. We recommend reading
      <a
        href="https://help.mojang.com/customer/en/portal/articles/1590522-minecraft-commercial-use"
      >this blog post</a> for more information about how to comply with the EULA.
    </v-alert>
  </div>
</template>


<script>
export default {
  name: "DonationsPerks",
  data: () => ({
    location: [
      {
        text: "Donations",
        disabled: true,
        href: ""
      },
      {
        text: "Perks",
        disabled: false,
        href: "#"
      }
    ]
  })
};
</script>
