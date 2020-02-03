<template>
  <div>
    <v-dialog v-model="remove.dialog" max-width="600px">
      <v-card>
        <v-card-text>
          <v-alert text color="primary">feature not ready yet</v-alert>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="add.dialog" max-width="600px">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field outlined hide-details v-model="add.title" label="Title" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  outlined
                  hide-details
                  v-model="add.description"
                  label="Description"
                  required
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters justify="center" align="center">
              <v-col cols="12" align="right">
                <v-btn color="secondary" class="mr-1" text @click="add.dialog = false">Cancel</v-btn>
                <v-btn color="primary" text @click="finishItemAdd()">Save</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-dialog v-model="edit.dialog" max-width="600px">
      <v-card>
        <v-card-text>
          <v-container>
            <v-row v-if="edit.selected!=null">
              <v-col cols="12">
                <v-text-field :value="edit.selected.name" label="Title" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field :value="edit.selected.description" label="Description" required></v-text-field>
              </v-col>
            </v-row>
            <v-row no-gutters justify="center" align="center">
              <v-col cols="4" md="6">
                <v-checkbox :value="true" hide-details class="ma-0" label="Allow posts" />
              </v-col>
              <v-col cols="8" md="6" align="right">
                <v-btn color="secondary" class="mr-1" text @click="remove.dialog = true">Delete</v-btn>
                <v-btn color="primary" text @click="edit.dialog = false">Save</v-btn>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-card outlined class="mb-2">
      <v-row class="pr-2" no-gutters align="center">
        <v-col cols="10">
          <v-card-title>{{section.name}}</v-card-title>
          <v-card-subtitle>{{section.description}}</v-card-subtitle>
        </v-col>
        <v-col cols="2" align="right">
          <v-btn icon>
            <v-icon>edit</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider />
      <v-list>
        <div v-if="this.categories==null">
          <v-skeleton-loader v-for="i in 5" :key="i" type="list-item-two-line" />
        </div>
        <div v-if="this.categories!=null">
          <v-list-item
            @click="editCategory(category)"
            v-for="category in categories"
            :key="category.uuid"
          >
            <v-list-item-content>
              <v-list-item-title>{{category.name}}</v-list-item-title>
              <v-list-item-subtitle>{{category.description}}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-icon>edit</v-icon>
            </v-list-item-action>
          </v-list-item>
        </div>
        <v-list-item @click="addItem()">
          <v-list-item-content>
            <v-list-item-title>Add category...</v-list-item-title>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>add</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  props: ["section"],
  data: () => ({
    categories: null,
    remove: {
      dialog: null
    },
    edit: {
      dialog: null,
      selected: null
    },
    add: {
      dialog: null,
      title: null,
      description: null
    }
  }),
  methods: {
    addItem: function() {
      this.add.dialog = true;
    },
    editCategory: function(cat) {
      this.edit.selected = cat;
      this.edit.dialog = true;
    },
    getCategories: function() {
      let main = this;
      main.categories = null;
      this.section.getCategories().then(function(categories) {
        main.categories = categories;
      });
    },
    finishItemAdd: function() {
      let main = this;
      main.add.dialog = false;
      main.section
        .createCategory(main.add.title, main.add.description)
        .then(function() {
          main.getCategories();
        })
        .catch(function(error) {
          alert(error.message);
        });
    }
  },
  mounted() {
    this.getCategories();
  }
};
</script>