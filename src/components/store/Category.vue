<template>
  <v-card outlined>
    <v-row no-gutters>
      <v-col v-if="category.itemCategory.banner != null" cols="12">
        <v-img height="150px" src="" />
      </v-col>
      <v-col class="flex-grow-1 flex-shrink-0">
        <v-row no-gutters align="center">
          <v-col
            v-if="category.itemCategory.icon != null"
            class="pl-4 flex-grow-0 flex-shrink-1"
          >
            <v-avatar size="60px">
              <v-img src="" />
            </v-avatar>
          </v-col>
          <v-col class="flex-grow-1 flex-shrink-0">
            <v-card-title>
              <v-text-field
                hide-details
                v-model="name"
                placeholder="Title"
                solo-inverted
                v-if="editing"
                label="title"
              /><span v-if="!editing">{{ category.itemCategory.name }}</span>
            </v-card-title>
            <v-card-subtitle>
              <span v-if="!editing">
                <span v-if="category.itemCategory.description == null">
                  No description
                </span>
                <span v-if="category.itemCategory.description != null">
                  {{ category.itemCategory.description }}
                </span>
              </span>
              <v-textarea
                hide-details
                class="mt-2"
                rows="1"
                placeholder="Description"
                row-height="90px"
                auto-grow
                v-if="editing"
                v-model="description"
                outlined
              />
            </v-card-subtitle>
          </v-col>
        </v-row>
        <v-card-subtitle class="ma-0 pt-0">
          <div>
            <v-switch
              style="display: inline-block"
              hide-details
              v-model="enable"
              label="Enable"
            />
            <v-icon
              class="ml-5 mr-5"
              color="grey"
              style="transform: translateY(-3px)"
            >
              more_horiz
            </v-icon>
            <v-checkbox
              style="display: inline-block"
              :disabled="!editing"
              label="Upgradable"
              hide-details
            />
            <div
              style="
                padding-left: 5px;
                display: inline-block;
                transform: translateY(-3px);
              "
            >
              <v-tooltip max-width="300px" bottom>
                <template v-slot:activator="{ on }">
                  <span v-on="on"><v-icon small>info</v-icon></span>
                </template>
                Upgradable categories allow customers to only pay the price
                difference between their previous payment and the new payment.
                This increases the amount of spending per customer by a lot, as
                customers are likely to upgrade their package. This unlocks
                upgrade targets. Creating separate packages for handling package
                upgrades is not recommended, as it leads to confusing analytics
                and less customers upgrading their package
              </v-tooltip>
              <plus />
            </div>
          </div>
        </v-card-subtitle>
      </v-col>
      <v-col class="flex-grow-0 flex-shrink-1 pr-5 pt-6">
        <v-btn @click="editing = !editing" icon>
          <v-icon v-if="!editing">edit</v-icon>
          <v-icon v-if="editing">save</v-icon>
        </v-btn>
        <v-btn @click="visibility = !visibility" icon>
          <v-icon v-if="visibility">visibility</v-icon>
          <v-icon v-if="!visibility">visibility_off</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-divider />
    <div class="pl-3 pr-3 pt-3 pb-3">
      <v-row>
        <v-col
          v-for="item in category.items"
          :key="item.id"
          cols="12"
          md="6"
          lg="3"
          xl="2"
        >
          <!-- without images -->

          <v-card
            v-if="!(item.banner != null || item.icon != null)"
            style="height: 180px; width: 100%; overflow: hidden"
            class="ma-0 pa-0"
            outlined
          >
            <v-container
              class="pa-0 ma-0"
              style="height: 180px"
              fill-height
              fluid
            >
              <v-row no-gutters align="center" justify="center">
                <v-col>
                  <center>
                    <h3
                      class="overline"
                      style="
                        font-size: 14px !important;
                        font-weight: 600 !important;
                      "
                    >
                      {{ item.name }}
                    </h3>
                    {{ item.price }} EUR
                  </center>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
          <!-- with images -->
          <v-card
            v-if="item.banner != null || item.icon != null"
            style="height: 180px; width: 100%; overflow: hidden"
            class="ma-0 pa-0"
            outlined
          >
            <v-img src="">
              <v-container
                class="pa-0 ma-0"
                style="height: 100px"
                fill-height
                fluid
              >
                <v-row no-gutters align="center" justify="center">
                  <v-col>
                    <center>
                      <v-avatar v-if="item.icon != null" size="60px">
                        <v-img src="" />
                      </v-avatar>
                    </center>
                  </v-col>
                </v-row>
              </v-container>
            </v-img>
            <v-sheet
              class="pa-0 ma-0"
              style="height: 80px; background-color: rgba(0, 0, 0, 0.3)"
            >
              <v-container
                class="pa-0 ma-0"
                style="height: 80px"
                fill-height
                fluid
              >
                <v-row no-gutters align="center" justify="center">
                  <v-col>
                    <center>
                      <h3
                        class="overline"
                        style="
                          font-size: 14px !important;
                          font-weight: 600 !important;
                        "
                      >
                        {{ item.name }}
                      </h3>
                      {{ item.price }} EUR
                    </center>
                  </v-col>
                </v-row>
              </v-container>
            </v-sheet>
          </v-card>
        </v-col>
        <v-col cols="12" md="6" lg="3" xl="2">
          <v-card style="height: 180px; width: 100%" outlined>
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
</template>
<script>
export default {
  props: ["category"],
  data: () => {
    return {
      editing: false,
      name: null,
      description: null,
      visibility: true,
      enable: true,
    };
  },
  mounted() {
    this.name = this.category.itemCategory.name;
    this.description = this.category.itemCategory.description;
    console.log(this.category);
  },
};
</script>