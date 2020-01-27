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
          <v-dialog v-model="deleting" width="500">
            <template v-slot:activator="{ on }">
              <v-btn v-on="on" v-if="name!='Proxy Instance'" fill-height text>
                <v-icon>delete</v-icon>
              </v-btn>
            </template>

            <v-card>
              <v-card-title class="headline" primary-title>Delete {{name}}</v-card-title>

              <div class="pa-3">
                <v-alert
                  text
                  color="primary"
                >In order to confirm the deletion of your server, please, write down the exact name of the instance. Billing wont be affected by this action.</v-alert>

                <v-text-field outlined v-model="delName" label="Instance Name" required></v-text-field>
              </div>

              <v-divider></v-divider>

              <v-card-actions>
                <v-expand-x-transition>
                  <div v-show="(name==delName)">
                    <v-btn
                      color="secondary"
                      :disabled="!(name==delName)"
                      outlined
                      @click="deleteServer(name)"
                    >Delete</v-btn>
                  </div>
                </v-expand-x-transition>
                <v-spacer></v-spacer>
                <v-btn color="primary" outlined @click="deleting = false">Cancel</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
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
  data: () => ({
    deleting: false,
    delName: ""
  })
};
</script>
