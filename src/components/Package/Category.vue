<template>
  <v-card outlined style="margin-bottom: 10px">
    <v-container fluid>
      <v-list-item-content style="padding: 0px">
        <v-list-item-title class="headline">{{ category.name }}</v-list-item-title>
        <v-list-item-subtitle>{{ category.description }}</v-list-item-subtitle>
      </v-list-item-content>

      <v-divider style="margin-bottom: 10px; margin-top: 10px"></v-divider>

      <v-row>
        <v-col v-for="item in items" :key="item.uuid" cols="12" lg="4" md="4" sm="4">
          <v-hover v-slot:default="{ hover }">
            <v-card
              :to="{ name: 'Package' , params: { uuid: item.uuid } }"
              v-ripple
              :outlined="$vuetify.theme.dark"
              :elevation="hover ? 12 : 2"
              class="mx-auto"
              height="200px"
              :class="{ 'on-hover': hover }"
            >
              <v-list-item three-line>
                <v-list-item-content>
                  <div class="overline">{{ item.perks.length }} PERKS</div>
                  <v-list-item-title>{{ item.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
              <v-card-actions style="position: absolute; bottom: 0px; left: 0px;">
                <v-list-item-title class="display-2">{{ item.price }}</v-list-item-title>
              </v-card-actions>
              <v-card-actions
                class="d-inline-flex pa-2"
                style="position: absolute; bottom: 0px; right: 0px;"
              >
                <v-btn color="primary" small text rounded>
                  <v-icon>edit</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>


<script>
export default {
  name: "PackageCategory",
  props: ["category", "items"]
};
</script>
