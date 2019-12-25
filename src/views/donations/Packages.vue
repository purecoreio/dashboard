<template>
  <div>
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
  </div>
</template>


<script>
import core from "purecore";
import PackageCategory from "../../components/Package/Category";

export default {
  name: "DonationsPackages",
  components: {
    PackageCategory: PackageCategory
  },
  data: () => ({
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
    loading: true
  }),
  mounted() {
    if (localStorage.session && localStorage.network) {
      network = localStorage.network;
      var coreInstance = new core(JSON.parse(localStorage.session));
      var network = coreInstance.getInstance(localStorage.network).asNetwork();
      var mainObj = this;

      network
        .getStore()
        .getPackages()
        .then(function(nestedItemsResult) {
          nestedItemsResult.forEach(nestedItem => {
            mainObj.nestedItems.push(nestedItem);
          });
          mainObj.loading=false
        });
    }
  }
};
</script>
