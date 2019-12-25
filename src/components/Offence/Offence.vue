<template>
  <v-card style="margin-bottom: 10px">
    <v-container fluid>
      <v-row dense align="center">
        <v-col cols="12" xl="8" lg="8" md="8" sm="8" xs="8">
          <v-list-item-content style="padding: 0px">
            <div class="overline">{{ offence.type }}</div>
            <v-list-item-title>{{ offence.name }}</v-list-item-title>
          </v-list-item-content>
        </v-col>
        <v-col
          class="text-right"
          cols="12"
          xl="2"
          lg="2"
          md="2"
          sm="2"
          xs="2"
        >- {{ offence.negativePoints }}</v-col>
        <v-col class="text-right" cols="12" xl="2" lg="2" md="2" sm="2" xs="2">
          <v-btn fill-height depressed>
            <v-icon left>edit</v-icon>Edit
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>


<script>
export default {
  name: "Offence",
  props: ["offence"],
  data: () => ({})
};
</script>
