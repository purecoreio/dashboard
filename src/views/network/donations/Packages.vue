<template>
  <div>
    <v-card outlined>
      <v-row no-gutters>
        <v-col class="flex-grow-1 flex-shrink-0">
          <v-card-title>
            <v-text-field
              hide-details
              solo-inverted
              v-if="editing"
              label="title"
            /><span v-if="!editing">Test</span>
          </v-card-title>
          <v-card-subtitle>
            <span v-if="!editing">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis,
              deleniti consectetur illum eveniet adipisci quod inventore. Quos
              sed molestiae non hic, quod cupiditate, ex illum ea neque
              accusantium culpa dolore?
            </span>
            <v-textarea
              hide-details
              class="mt-2"
              rows="1"
              row-height="90px"
              auto-grow
              value="Lorem ipsum dolor sit amet consectetur adipisicing elit. Omnis, deleniti consectetur illum eveniet adipisci quod inventore. Quos sed molestiae non hic, quod cupiditate, ex illum ea neque accusantium culpa dolore?"
              v-if="editing"
              outlined
            >
            </v-textarea>
            <v-checkbox :disabled="!editing" hide-details>
              <template v-slot:label>
                <v-tooltip max-width="300px" bottom>
                  <template v-slot:activator="{ on }">
                    <span v-on="on">Upgradable</span>
                  </template>
                  Upgradable categories allow customers to only pay the price
                  difference between their previous payment and the new payment.
                  This increases the amount of spending per customer by a lot,
                  as customers are likely to upgrade their package. This unlocks
                  upgrade targets. Creating separate packages for handling
                  package upgrades is not recommended, as it leads to confusing
                  analytics and less customers upgrading their package
                </v-tooltip>
                <plus />
              </template>
            </v-checkbox>
          </v-card-subtitle>
        </v-col>
        <v-col class="flex-grow-0 flex-shrink-1 pr-5 pt-6">
          <v-btn @click="editing = !editing" icon>
            <v-icon v-if="!editing">edit</v-icon>
            <v-icon v-if="editing">save</v-icon>
          </v-btn>
          <v-btn @click="visibility = !visibility" icon>
            <v-icon v-if="!visibility">visibility</v-icon>
            <v-icon v-if="visibility">visibility_off</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider />
      <div class="pl-3 pr-3">
        <v-row>
          <v-col v-for="i in 7" :key="i" cols="12" md="6" lg="3">
            <v-skeleton-loader height="200px" type="image" />
          </v-col>
          <v-col>
            <v-card style="height: 200px; width: 100%" outlined>
              <v-container fill-height fluid>
                <v-row align="center" justify="center">
                  <v-col>
                    <center><v-icon>add</v-icon></center>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-card>
  </div>
</template>
<script>
export default {
  data: () => {
    return {
      editing: false,
      visibility: false
    };
  },
};
</script>