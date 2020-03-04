<template>
  <div>
    <v-card class="mb-4" outlined>
      <v-card-text>
        <v-row>
          <v-col cols="12" md="6" sm="12">
            <v-text-field label="Package Name" outlined rows="1" row-height="15"></v-text-field>
          </v-col>
          <v-col cols="12" md="6" sm="12">
            <v-text-field label="Price" outlined rows="1" row-height="15"></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea outlined auto-grow label="Description" rows="8" row-height="15"></v-textarea>
          </v-col>
        </v-row>
        <v-row align="center" no-gutters>
          <v-col
            cols="12"
            md="3"
            sm="0"
            class="hidden-sm-and-down flex-grow-0 flex-shrink-1"
          >{{ uuid }}</v-col>
          <v-col cols="12" md="9" sm="12" class="text-right flex-grow-1 flex-shrink-0">
            <v-btn text>Duplicate package</v-btn>
            <v-btn outlined color="primary">Save</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mb-4" outlined>
      <v-card-text>
        <div v-for="item in items" :key="item.title">
          <v-row align="center">
            <v-col cols="2">
              <v-text-field disabled label="Amount" placeholder="Uncountable"></v-text-field>
            </v-col>
            <v-col>{{item.title}}</v-col>
          </v-row>
          <v-divider />
        </div>
        <v-text-field label="Write perk and hit [enter ↵]" outlined class="mt-4"></v-text-field>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
export default {
  name: "DonationsPackage",
  props: ["uuid"],
  data: () => ({
    items: [
      {
        title: "Claim Blocks",
        subtitle: "Example Category"
      },
      {
        title: "Spawn Egg",
        subtitle: "Vote Rewards"
      }
    ]
  })
};
</script>
