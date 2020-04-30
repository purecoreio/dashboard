<template>
  <div>
    <v-snackbar v-model="showMsg">{{ msg }}</v-snackbar>

    <v-card outlined style="margin-bottom: 10px">
      <v-container fluid>
        <v-list-item class="pa-0">
          <v-list-item-content v-if="!editing">
            <h1 class="mb-2">{{ category.name }}</h1>
            <h3>{{ category.description }}</h3>
          </v-list-item-content>
          <v-list-item-content v-if="editing">
            <v-text-field class="mb-4" label="Title" outlined hide-details v-model="title" />
            <v-textarea label="Description" outlined hide-details v-model="description" />
            <v-tooltip right>
              <template v-slot:activator="{ on }">
                <v-switch v-on="on" v-model="upgradable" label="Upgradable Category"></v-switch>
              </template>
              <span>
                When a category is set as upgradable, customers only will be able to pay items higher in price than the ones they
                paid before on the same category and they will only pay the difference to the new item.
              </span>
            </v-tooltip>
            <v-btn
              @click="saveChanges()"
              :loading="saving"
              :disabled="!newChanges"
              color="primary"
            >save changes</v-btn>
          </v-list-item-content>
          <v-list-item-action v-if="!editing">
            <v-btn icon @click="editing=true">
              <v-icon>edit</v-icon>
            </v-btn>
          </v-list-item-action>
        </v-list-item>

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
          <v-col cols="12" lg="4" md="4" sm="4">
            <v-hover v-slot:default="{ hover }">
              <v-card
                v-ripple
                :outlined="$vuetify.theme.dark"
                :elevation="hover ? 12 : 2"
                class="mx-auto"
                height="200px"
                :class="{ 'on-hover': hover }"
              >
                <v-row align="center" style="height: 100%">
                  <v-col cols="12">
                    <center>
                      <v-icon x-large>add</v-icon>
                    </center>
                  </v-col>
                </v-row>
              </v-card>
            </v-hover>
          </v-col>
        </v-row>
      </v-container>
    </v-card>
  </div>
</template>


<script>
export default {
  name: "PackageCategory",
  props: ["category", "items"],
  data: () => ({
    editing: false,
    title: "...",
    description: "...",
    upgradable: false,
    newChanges: false,
    saving: false,
    msg: "",
    showMsg: false
  }),
  mounted() {
    this.title = this.category.name;
    this.description = this.category.description;
    this.upgradable = this.category.upgradable;
  },
  watch: {
    title() {
      this.updateChangeLog();
    },
    description() {
      this.updateChangeLog();
    },
    upgradable() {
      this.updateChangeLog();
    },
    saving(newv, oldv) {
      if (oldv && !newv) {
        this.editing = false;
        this.refresh();
      }
    },
    msg() {
      this.showMsg = true;
      setTimeout(() => {
        this.showMsg = false;
      }, 2000);
    }
  },
  methods: {
    updateChangeLog: function() {
      this.newChanges =
        this.title != this.category.name ||
        this.description != this.category.description ||
        this.upgradable != this.category.upgradable;
    },
    saveChanges: function() {

      // TO-DO LOGIC

      this.saving = true;
      let main = this;
      setTimeout(() => {
        main.msg = "Updated '" + this.title + "' successfully";
        main.saving = false;
      }, 1000);

      /*
      .catch(err){
        this.msg= "error while updating "+this.category.name
      }
      */
    },
    refresh: function() {
      this.category.name = this.title;
      this.category.description = this.description;
      this.category.upgradable = this.upgradable;
      this.updateChangeLog();
    }
  }
};
</script>
