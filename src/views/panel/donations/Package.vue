<template>
  <div>
    <v-card class="mb-4" outlined>
      <v-card-text>
        <v-row no-gutters>
          <v-col class="mb-4" cols="12">
            <v-select
              v-model="itemEdit.category"
              :loading="loadingCategories"
              hide-details
              outlined
              :items="availableCategories"
              item-text="name"
              item-value="uuid"
              label="Category"
            ></v-select>
          </v-col>
          <v-col
            :class="$vuetify.breakpoint.xsOnly ? 'mb-2' : 'pr-2'"
            cols="12"
            md="9"
            xl="10"
            sm="8"
          >
            <v-text-field
              v-model="itemEdit.name"
              hide-details
              :loading="itemEdit.name==null"
              label="Package Name"
              outlined
              rows="1"
              row-height="15"
            ></v-text-field>
          </v-col>
          <v-col cols="12" md="3" xl="2" sm="4">
            <v-text-field
              v-model="itemEdit.price"
              hide-details
              :loading="itemEdit.price==null"
              label="Price"
              outlined
              rows="1"
              row-height="15"
            ></v-text-field>
          </v-col>

          <v-col cols="12">
            <div class="pb-4 pt-4">
              <v-divider />
            </div>
          </v-col>

          <v-col cols="12">
            <v-textarea
              v-model="itemEdit.description"
              hide-details
              :loading="itemEdit.description==null"
              outlined
              auto-grow
              label="Description"
              rows="8"
              row-height="15"
            ></v-textarea>
          </v-col>
        </v-row>
        <v-row align="center" no-gutters>
          <v-col
            cols="12"
            md="3"
            sm="0"
            class="hidden-sm-and-down flex-grow-0 flex-shrink-1"
          >{{ uuid }}</v-col>
          <v-col cols="12" md="9" sm="12" class="text-right flex-grow-1 flex-shrink-0 mt-4">
            <v-btn text>Duplicate package</v-btn>
            <v-btn outlined color="primary">Save</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card class="mb-4" outlined>
      <v-card-text>
        <div v-if="itemEdit.perks!=null">
          <div v-for="item in itemEdit.perks" :key="item.perk.uuid">
            <v-row align="center">
              <v-col cols="2">
                <v-text-field
                  hide-details
                  outlined
                  :disabled="item.perk.type!='QUANTITY'"
                  label="Amount"
                  placeholder="Uncountable"
                  :value="item.quantity!=null ? item.quantity : ''"
                ></v-text-field>
              </v-col>
              <v-col>{{item.perk.name}}</v-col>
            </v-row>
            <v-divider />
          </div>
        </div>
        <div v-if="itemEdit.perks==null">
          <v-skeleton-loader v-for="i in 5" :key="i" type="list-item" />
        </div>

        <v-row class="mt-4" align="center">
          <v-slide-x-transition>
            <v-col cols="2" v-show="newPerkCountable">
              <v-text-field hide-details outlined label="Amount" v-model="newPerkAmount"></v-text-field>
            </v-col>
          </v-slide-x-transition>
          <v-col>
            <v-text-field
              outlined
              v-if="newPerkEditing"
              v-model="newPerkStr"
              hide-details
              label="New Perk"
            />
            <v-autocomplete
              v-if="!newPerkEditing"
              v-model="newPerkId"
              :search-input.sync="newPerk"
              :loading="loadingPerks"
              :disabled="availablePerks==null"
              :items="availablePerks"
              hide-details
              item-value="uuid"
              item-text="name"
              label="Perk"
              outlined
              @keyup.enter="perkAdd"
            ></v-autocomplete>
          </v-col>
          <v-col cols="auto">
            <v-btn class="pt-5 pb-9" :disabled="newPerkEditing" color="primary" @click="perkAdd">{{newPerkObj == null ? 'create' : 'add'}}</v-btn>
          </v-col>
          <v-col cols="12" v-if="newPerkEditing">
            <v-text-field
              autofocus
              outlined
              v-model="newPerkDesc"
              hide-details
              label="Description"
            />
          </v-col>
          <v-col cols="12" v-if="newPerkEditing">
            <v-autocomplete
              :loading="loadingPerks"
              :disabled="availablePerks==null"
              :items="availablePerks"
              hide-details
              item-value="uuid"
              item-text="name"
              label="Perk Category"
              outlined
            ></v-autocomplete>
          </v-col>
        </v-row>

        <!--
        <v-text-field
          hide-details
          v-model="newPerk"
          label="Write perk and hit [enter ↵]"
          outlined
          @keyup="preview()"
          v-on:keyup.enter="addPerk"
        ></v-text-field>
        -->

        <v-scroll-y-transition>
          <v-alert
            color="primary"
            text
            class="mb-0 pa-0 mt-3"
            v-show="this.newPerkRes.amount!=null||this.newPerkRes.text"
          >
            <v-list-item>
              <v-list-item-content>
                <p class="mb-0 mt-0">
                  Will create
                  <span
                    v-if="this.newPerkRes.amount!=null"
                  >a countable ({{this.newPerkRes.amount}})</span>
                  <span v-if="this.newPerkRes.amount==null">an uncountable</span>
                  perk called '{{this.newPerkRes.text}}'
                </p>
              </v-list-item-content>

              <!-- TO-DO: DROPDOWN FOR EXISTING PERKS IN THE DB, AUTOCOMPLETE, AUTO-PERK CATEGORY CREATION POPUP IF NO MATCHING DATA -->

              <v-list-item-action>
                <v-tooltip left>
                  <template v-slot:activator="{ on }">
                    <v-icon v-on="on">info</v-icon>
                  </template>
                  <p
                    style="width:200px;"
                  >purecore packages are based on perk objects. Perk objects can be countable or uncountable. This allows you to create a huge amount of display options for your store as well as create differential actions based on the perk properties</p>
                </v-tooltip>
              </v-list-item-action>
            </v-list-item>
          </v-alert>
        </v-scroll-y-transition>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
import core from "purecore";

export default {
  name: "DonationsPackage",
  props: ["uuid"],
  data: () => ({
    network: null,
    items: [
      {
        title: "Claim Blocks",
        subtitle: "Example Category",
        amount: null
      },
      {
        title: "Spawn Egg",
        subtitle: "Vote Rewards",
        amount: null
      }
    ],
    /* perk editing */
    newPerk: "",
    newPerkStr: "",
    newPerkDesc: "",
    newPerkAmount: null,
    newPerkCountable: false,
    newPerkJustChangedType: false,
    newPerkId: null,
    newPerkObj: null,
    newPerkEditing: false,
    newPerkRes: {
      amount: null,
      text: null
    },
    item: null,
    itemEdit: {
      name: null,
      description: null,
      price: null,
      category: null,
      perks: null
    },
    availablePerks: null,
    loadingPerks: false,
    availableCategories: [],
    loadingCategories: false
  }),
  mounted() {
    var coreInstance = new core(JSON.parse(localStorage.session));
    this.network = coreInstance.getInstance(localStorage.network).asNetwork();
    this.pullData();
    this.loadAvailableCategories();
    this.loadAvailablePerks();
  },
  watch: {
    newPerkId: function(data) {
      var perkRes = null;
      this.availablePerks.forEach(perk => {
        if (perk.uuid == data) {
          perkRes = perk;
        }
      });
      this.newPerkObj = perkRes;
    },
    newPerkObj: function(data) {
      if (data != null && data.type == "QUANTITY") {
        this.newPerkCountable = true;
      } else {
        this.newPerkCountable = false;
      }
    },
    item: function(data) {
      this.itemEdit.name = data.name;
      this.itemEdit.description = data.description;
      this.itemEdit.price = data.price;
      this.itemEdit.category = data.category;
      this.itemEdit.perks = data.perks;
    },
    newPerk: function(val, prev) {
      if (!this.newPerkJustChangedType) {
        if (prev.length > 0 && val.length == 0) {
          this.newPerkCountable = false;
          this.newPerkObj = null;
          this.newPerkId = null;
          this.newPerkAmount = null;
        }
        if (val.length > 0 && val.includes(" ")) {
          var parts = val.split(" ");
          try {
            if (!isNaN(parseInt(parts[0]))) {
              this.newPerkCountable = true;
              this.newPerkAmount = parts[0];
              this.newPerkJustChangedType = true;
              this.newPerk = "";
            }
          } catch (error) {
            // ignore
          }
        }
      } else {
        this.newPerkJustChangedType = false;
      }
    },
    newPerkStr: function(val, prev) {
      if (prev.length > 0 && val.length == 0) {
        this.newPerkCountable = false;
        this.newPerkObj = null;
        this.newPerkId = null;
        this.newPerkAmount = null;
        this.newPerkEditing = false;
      }
    }
  },
  methods: {
    perkAdd() {
      if (this.newPerkObj != null) {
        alert("added existing perk");
      } else {
        this.newPerkStr = this.newPerk;
        this.newPerkEditing = true;
      }
    },
    loadAvailablePerks() {
      let main = this;
      main.loadingPerks = true;
      this.network
        .getStore()
        .getPerks()
        .then(function(perks) {
          main.availablePerks = perks;
          main.loadingPerks = false;
        });
    },
    loadAvailableCategories() {
      let main = this;
      main.loadingCategories = true;
      this.network
        .getStore()
        .getPackages()
        .then(function(nestedItems) {
          var categories = [];
          nestedItems.forEach(nestedItem => {
            categories.push(nestedItem.category);
          });
          main.availableCategories = categories;
          main.loadingCategories = false;
        });
    },
    pullData() {
      let main = this;
      this.network
        .getStore()
        .getItem(this.uuid)
        .then(function(item) {
          main.item = item;
        });
    },
    addPerk() {
      this.items.push({
        title: this.newPerkRes.text,
        amount: this.newPerkRes.amount,
        category: "unknown"
      });
      this.newPerk = "";
      this.preview();
    },
    preview: function() {
      /* show preview with automatic amount and 
         text splitting 
      */

      if (this.newPerk == null || this.newPerk.length == 0) {
        this.newPerkRes.amount = null;
        this.newPerkRes.text = null;
      } else {
        var components = this.newPerk.split(" ");

        if (components.length != null && components.length > 1) {
          var everything = false;

          if (!isNaN(parseInt(components[0]))) {
            this.newPerkRes.amount = components[0];
          } else {
            everything = true;
          }

          if (everything) {
            this.newPerkRes.text = this.newPerk;
          } else {
            var fin = "";
            for (const key in components) {
              if (components.hasOwnProperty(key)) {
                const element = components[key];
                if (key > 0) {
                  if (key != components.length - 1) {
                    fin += element + " ";
                  } else {
                    fin += element;
                  }
                }
              }
            }
            this.newPerkRes.text = fin;
          }
        }
      }
    }
  }
};
</script>
