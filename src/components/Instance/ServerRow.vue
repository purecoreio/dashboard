<template>
  <v-card style="margin-bottom: 10px">
    <v-container fluid>
      <v-row dense align="center">
        <v-col cols="6" xl="10" lg="9" md="9" sm="6" xs="6">
          {{ name }}
          <v-chip
            style="margin-left: 7px"
            v-if="name=='Proxy Instance'"
            color="primary"
          >Automatically Created</v-chip>
        </v-col>
        <v-col class="text-right" cols="6" xl="2" lg="3" md="3" sm="6" xs="6">
          <v-btn v-if="name!='Proxy Instance'" fill-height text>
            <v-icon>delete</v-icon>
          </v-btn>
          <v-btn link to="/instance/" fill-height depressed>
            <v-icon left>dns</v-icon>Panel
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>


<script>
export default {
  name: "ServerRow",
  props: ["name", "uuid"],
  data: () => ({})
};
</script>
