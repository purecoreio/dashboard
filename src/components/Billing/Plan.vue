<template>
  <div>
    <v-card hover>
      <v-sheet
        class="white--text pa-4"
        style="text-align: center; text-transform: uppercase"
        color="primary"
      >{{plan.name}}</v-sheet>
      <div v-for="featureSection in plan.features" :key="featureSection.name">
        <v-subheader>{{featureSection.name}}</v-subheader>
        <v-divider />
        <v-list>
          <v-list-item v-for="feature in featureSection.features" :key="feature.technicalName">
            <v-list-item-content>
              <p class="ma-0">
                <v-chip
                  :color="feature.value ? 0 : 'red'"
                  :class="'ma-0 '+(feature.value ? 0 : 'white--text')"
                  v-if="feature.value!==false&&feature.value!==true&&feature.value!==-1"
                >
                  <span
                    v-if="feature.technicalName == 'analytic_snapshot_interval'"
                  >{{feature.value/60+'m'}}</span>
                  <span
                    v-if="feature.technicalName != 'analytic_snapshot_interval'"
                  >{{feature.value}}</span>
                </v-chip>
                <v-chip
                  :color="feature.value ? false : 'red'"
                  :class="'ma-0 '+(feature.value ? false : 'white--text')"
                  v-if="feature.value===-1||feature.value===false||feature.value===true"
                >{{feature.displayValue}}</v-chip>
                {{feature.name}}
              </p>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </div>
      <v-sheet
        class="white--text pa-4"
        style="text-align: center; text-transform: uppercase"
        color="primary"
      >{{plan.price}}€/mo</v-sheet>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["plan"]
};
</script>