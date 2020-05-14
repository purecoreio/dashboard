<template>
  <div>
    <v-dialog v-model="create" width="500">
      <v-card style="overflow-x:hidden">
        <v-card-title class="headline" primary-title>Create a new category</v-card-title>

        <v-row class="pr-2 pl-2">
          <v-col v-if="creationError!=''" cols="12">
            <v-expand-transition>
              <v-alert
                v-show="creationError!=''"
                text
                color="warning"
              >{{creationError}}</v-alert>
            </v-expand-transition>
          </v-col>
          <v-col cols="12">
            <v-text-field
              :disabled="creating"
              outlined
              autofocus
              hide-details
              label="Name"
              v-model="newTitle"
            />
          </v-col>
          <v-col cols="12">
            <v-text-field
              :disabled="creating"
              outlined
              hide-details
              label="Description"
              v-model="newDescription"
            />
          </v-col>
        </v-row>
        <v-divider></v-divider>

        <v-card-actions>
          <v-btn color="primary" text @click="create=false;newTitle='';newDescription=''">Cancel</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" :loading="creating" depressed @click="registerNew()">Create</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>
    <div v-if="loading">
      <v-card outlined style="margin-bottom: 10px">
        <v-container fluid>
          <v-list-item-content style="padding: 0px">
            <v-skeleton-loader type="heading"></v-skeleton-loader>
            <v-skeleton-loader type="paragraph"></v-skeleton-loader>
          </v-list-item-content>

          <v-divider style="margin-bottom: 10px; margin-top: 10px"></v-divider>

          <v-row>
            <v-col v-for="index in 6" :key="index" cols="12" lg="4" md="4" sm="4">
              <v-skeleton-loader height="200px" type="card"></v-skeleton-loader>
            </v-col>
          </v-row>
        </v-container>
      </v-card>
    </div>
    <div v-for="nestedItem in nestedItems" :key="nestedItem.uuid">
      <PackageCategory :category="nestedItem.getCategory()" :items="nestedItem.getItems()"></PackageCategory>
    </div>
    <v-btn @click="create=true" color="primary" class="float-right mb-5" v-if="nestedItems.length>0">create category</v-btn>
    <div v-if="nestedItems.length<=0 && !loading">
      <center>
        <h1 class="mb-4" style="margin-top: 200px">Create your first category!</h1>
        <v-btn @click="create=true" large color="primary">create category</v-btn>
      </center>
    </div>
  </div>
</template>


<script>
import core from "purecore";
import PackageCategory from "../../../components/Package/Category";

export default {
  name: "DonationsPackages",
  components: {
    PackageCategory: PackageCategory
  },
  data: () => ({
    create: false,
    newTitle: "",
    newDescription: "",
    creating: false,
    network: null,
    creationError: "",
    location: [
      {
        text: "Donations",
        disabled: true,
        href: ""
      },
      {
        text: "Packages",
        disabled: false,
        href: "#"
      }
    ],
    nestedItems: [],
    loading: false
  }),
  methods: {
    registerNew: function() {
      var store = this.network.getStore();
      let main = this;
      main.creating = true;
      store
        .createCategory(this.newTitle, this.newDescription)
        .then(function() {
          main.creating = false;
          main.create = false;
          main.newTitle = "";
          main.newDescription = "";
          main.creationError = "";
          main.loadContent();
        })
        .catch(function(err) {
          main.creationError = err.message;
        });
    },
    loadContent: function() {
      let main = this;
      main.loading = true;
      main.network
        .getStore()
        .getPackages()
        .then(function(nestedItemsResult) {
          nestedItemsResult.forEach(nestedItem => {
            main.nestedItems.push(nestedItem);
          });
          main.loading = false;
        });
    }
  },
  mounted() {
    if (localStorage.session && localStorage.network) {
      var coreInstance = new core(JSON.parse(localStorage.session));
      this.network = coreInstance.getInstance(localStorage.network).asNetwork();
      this.loadContent();
    }
  }
};
</script>
