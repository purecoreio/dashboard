<template>
  <div>
    <v-card class="mb-4" outlined>
      <v-card-text>
        <v-row no-gutters>
          <v-col cols="12" v-if="creationError!=''">
            <v-expand-transition>
              <v-alert text color="warning" v-show="creationError!=''">{{creationError}}</v-alert>
            </v-expand-transition>
          </v-col>
          <v-col class="mb-4" cols="12">
            <v-select
              :error="categoryError"
              v-model="itemEdit.category"
              :loading="loadingCategories"
              hide-details
              outlined
              return-object
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
              autocomplete="off"
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
              type="number"
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
            class="hidden-sm-and-down flex-grow-0 flex-shrink-1 pt-4"
          >{{ uuid }}</v-col>
          <v-col cols="12" md="9" sm="12" class="text-right flex-grow-1 flex-shrink-0 mt-4">
            <v-btn v-if="creatingItem" @click="createItem()" outlined color="primary">Create</v-btn>
            <v-btn v-if="!creatingItem" outlined color="primary">Save</v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
    <v-card v-if="!creatingItem" class="mb-4" outlined>
      <v-card-text>
        <div v-if="itemEdit.perks!=null">
          <itemPerk
            v-for="perk in itemEdit.perks"
            :key="perk.perk.uuid"
            :item="item"
            :perk="perk"
            :instances="availableInstances"
          />
        </div>
        <div v-if="itemEdit.perks==null">
          <v-skeleton-loader v-for="i in 5" :key="i" type="list-item" />
        </div>

        <v-row class="mt-4" align="center">
          <v-slide-x-transition>
            <v-col cols="auto" v-show="newPerkCountable">
              <v-text-field
                @keyup="actionDescCalc()"
                hide-details
                style="width:100px"
                outlined
                label="Amount"
                v-model="newPerkAmount"
              ></v-text-field>
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
              @blur="perkAdd"
            ></v-autocomplete>
          </v-col>
          <v-col v-if="newPerkObj == null" cols="auto">
            <v-btn
              :class="$vuetify.breakpoint.smAndUp ? 'pt-5 pb-9':''"
              :disabled="newPerkEditing"
              color="primary"
              :icon="!$vuetify.breakpoint.smAndUp"
              @click="perkAdd"
            >
              {{$vuetify.breakpoint.smAndUp ? 'Create' : ''}}
              <v-icon v-if="!$vuetify.breakpoint.smAndUp">add</v-icon>
            </v-btn>
          </v-col>
          <v-col cols="12" v-if="newPerkEditing">
            <v-text-field
              autofocus
              outlined
              v-model="newPerkDesc"
              @keyup="actionDescCalc()"
              hide-details
              label="Description"
            />
            <v-switch class="shrink" hide-details v-model="newPerkCountable">
              <template v-slot:label>
                <v-tooltip right>
                  <template v-slot:activator="{ on }">
                    Set new perk as countable
                    <v-icon class="ml-2" v-on="on">info</v-icon>
                  </template>
                  <p
                    style="width:200px;"
                  >purecore packages are based on perk objects. Perk objects can be countable or uncountable. This allows you to create a huge amount of display options for your store as well as create differential actions based on the perk properties</p>
                </v-tooltip>
              </template>
            </v-switch>
            <v-divider class="mt-5" />
          </v-col>
          <v-col v-if="newPerkEditing">
            <v-text-field
              outlined
              v-if="perkCategoryCreation"
              v-model="newPerkCategoryStr"
              hide-details
              label="New Perk Category"
            />
            <v-autocomplete
              v-if="!perkCategoryCreation"
              v-model="newPerkCategoryId"
              :loading="loadingPerkCategories"
              :disabled="availablePerkCategories==null"
              :items="availablePerkCategories"
              :search-input.sync="newPerkCategory"
              @keyup.enter="perkCategoryTryCreation"
              @blur="perkCategoryTryCreation"
              hide-details
              item-value="uuid"
              item-text="name"
              label="Perk Category"
              outlined
            ></v-autocomplete>
          </v-col>
          <v-slide-x-reverse-transition v-if="newPerkEditing">
            <v-col cols="auto" v-show="newPerkCategoryCreationAvailable">
              <v-btn
                class="pt-5 pb-9"
                :disabled="perkCategoryCreation"
                color="primary"
                @click="perkCategoryTryCreation"
              >CREATE</v-btn>
            </v-col>
          </v-slide-x-reverse-transition>
        </v-row>
        <v-expand-transition>
          <v-row align="center" v-show="showActionDesc">
            <v-col>
              <v-alert :color="allowAction ? 'primary' : 'warning'" class="mb-0 pa-0">
                <v-list-item>
                  <v-list-item-content>
                    <p class="mb-0 mt-0">{{actionDesc}}</p>
                  </v-list-item-content>
                </v-list-item>
              </v-alert>
            </v-col>
            <v-col v-if="allowAction" cols="auto">
              <v-btn
                :loading="addingPerk"
                @click="handleCreation()"
                x-large
                depressed
                color="primary"
              >add</v-btn>
            </v-col>
          </v-row>
        </v-expand-transition>
      </v-card-text>
    </v-card>
  </div>
</template>


<script>
import core from "purecore";
import itemPerk from "../../../components/Package/ItemPerk";

export default {
  name: "DonationsPackage",
  props: ["uuid"],
  components: {
    itemPerk
  },
  data: () => ({
    network: null,
    networkInstance: null,
    /* new item creation */
    categoryError: false,
    creationError: "",
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
    addingPerk: false,
    newPerkCategoryId: null,
    newPerkCategoryStr: "",
    newPerkCategoryObj: null,
    newPerkCategory: null,
    perkCategoryCreation: false,
    newPerkCategoryCreationAvailable: false,
    allowAction: false,
    actionDesc: "Awaiting information",
    showActionDesc: false,
    availableInstances: null,
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
    creatingItem: false,
    availablePerks: null,
    loadingPerks: false,
    availableCategories: [],
    loadingCategories: false,
    availablePerkCategories: [],
    loadingPerkCategories: false
  }),
  mounted() {
    var coreInstance = new core(JSON.parse(localStorage.session));
    this.network = coreInstance.getInstance(localStorage.network).asNetwork();
    this.networkInstance = coreInstance.getInstance(localStorage.network);
    if (this.uuid != "new") {
      this.pullData();
    } else {
      this.itemEdit.name = "";
      this.itemEdit.description = "";
      this.itemEdit.price = "";
      this.itemEdit.perks = [];
      this.creatingItem = true;
    }
    this.loadAvailableCategories();
    this.loadAvailablePerks();
    this.loadAvailablePerkCategories();
    this.loadAvailableInstances();
  },
  watch: {
    uuid: function(value) {
      if (value != "new") {
        this.creatingItem = false;
        this.creationError = "";
        this.pullData();
        this.loadAvailableCategories();
        this.loadAvailablePerks();
        this.loadAvailablePerkCategories();
      }
    },
    newPerkCategoryId: function(data) {
      var perkRes = null;
      this.availablePerkCategories.forEach(perk => {
        if (perk.uuid == data) {
          perkRes = perk;
        }
      });
      this.newPerkCategoryObj = perkRes;
    },
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
        if (prev != null && prev.length > 0 && val.length == 0) {
          this.newPerkCountable = false;
          this.newPerkObj = null;
          this.newPerkId = null;
          this.newPerkAmount = null;
        }
        if (val != null && val.length > 0 && val.includes(" ")) {
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
      this.actionDescCalc();
    },
    newPerkCategory: function(val) {
      if (val.length == 0) {
        this.newPerkCategoryId = null;
        this.newPerkCategoryCreationAvailable = false;
      }
      if (this.newPerkCategoryId == null) {
        this.newPerkCategoryCreationAvailable = true;
      } else {
        this.newPerkCategoryCreationAvailable = false;
      }
      this.actionDescCalc();
    },
    newPerkStr: function(val, prev) {
      if (prev.length > 0 && val.length == 0) {
        this.newPerkCountable = false;
        this.newPerkObj = null;
        this.newPerkId = null;
        this.newPerkAmount = null;
        this.newPerkEditing = false;
      }
      this.actionDescCalc();
    },
    newPerkCategoryStr: function(val, prev) {
      if (prev.length > 0 && val.length == 0) {
        this.perkCategoryCreation = false;
        this.newPerkCategoryId = null;
      }
      this.actionDescCalc();
    }
  },
  methods: {
    handleCreation() {
      let main = this;
      if (this.newPerkObj != null) {
        if (
          this.newPerkCountable &&
          this.newPerkAmount != null &&
          this.newPerkAmount != 0 &&
          this.newPerkAmount != ""
        ) {
          // add existing countable perk
          main.addingPerk = true;
          main.item
            .addPerk(main.newPerkObj, main.newPerkAmount)
            .then(function() {
              main.loadAvailablePerks();
              main.loadAvailablePerkCategories();
              main.pullData();
              main.addingPerk = false;
              main.newPerkEditing = false;
              main.perkCategoryCreation = false;
              main.newPerkObj = null;
              main.newPerkCategoryId = null;
              main.newPerkCategoryStr = "";
              main.newPerkStr = "";
              main.newPerkDesc = "";
            })
            .catch(function(err) {
              main.creationError = err.message;
              main.addingPerk = false;
            });
        } else if (!this.newPerkCountable) {
          // add existing uncountable perk
          main.addingPerk = true;
          main.item
            .addPerk(main.newPerkObj)
            .then(function() {
              main.loadAvailablePerks();
              main.loadAvailablePerkCategories();
              main.pullData();
              main.addingPerk = false;
              main.newPerkEditing = false;
              main.perkCategoryCreation = false;
              main.newPerkObj = null;
              main.newPerkCategoryId = null;
              main.newPerkCategoryStr = "";
              main.newPerkStr = "";
              main.newPerkDesc = "";
            })
            .catch(function(err) {
              main.creationError = err.message;
              main.addingPerk = false;
            });
        }
      } else {
        if (this.newPerkEditing) {
          if (this.newPerkStr != null && this.newPerkStr != "") {
            if (
              this.perkCategoryCreation &&
              this.newPerkCategoryStr != null &&
              this.newPerkCategoryStr != ""
            ) {
              if (this.newPerkCountable) {
                // new countable perk, new perk category
                main.addingPerk = true;
                this.network
                  .getStore()
                  .createPerkCategory(this.newPerkCategoryStr)
                  .then(function(perkcat) {
                    perkcat
                      .createPerk(main.newPerkStr, main.newPerkDesc, "QUANTITY")
                      .then(function(perk) {
                        main.item
                          .addPerk(perk, main.newPerkAmount)
                          .then(function() {
                            main.loadAvailablePerks();
                            main.loadAvailablePerkCategories();
                            main.pullData();
                            main.addingPerk = false;
                            main.newPerkEditing = false;
                            main.perkCategoryCreation = false;
                            main.newPerkObj = null;
                            main.newPerkCategoryId = null;
                            main.newPerkCategoryStr = "";
                            main.newPerkStr = "";
                            main.newPerkDesc = "";
                          })
                          .catch(function(err) {
                            main.creationError = err.message;
                            main.addingPerk = false;
                          });
                      })
                      .catch(function(err) {
                        main.creationError = err.message;
                        main.addingPerk = false;
                      });
                  })
                  .catch(function(err) {
                    main.creationError = err.message;
                    main.addingPerk = false;
                  });
              } else {
                // new uncountable perk, new perk category
                main.addingPerk = true;
                this.network
                  .getStore()
                  .createPerkCategory(this.newPerkCategoryStr)
                  .then(function(perkcat) {
                    perkcat
                      .createPerk(main.newPerkStr, main.newPerkDesc, "GENERAL")
                      .then(function(perk) {
                        main.item
                          .addPerk(perk)
                          .then(function() {
                            main.loadAvailablePerks();
                            main.loadAvailablePerkCategories();
                            main.pullData();
                            main.addingPerk = false;
                            main.newPerkEditing = false;
                            main.perkCategoryCreation = false;
                            main.newPerkObj = null;
                            main.newPerkCategoryId = null;
                            main.newPerkCategoryStr = "";
                            main.newPerkStr = "";
                            main.newPerkDesc = "";
                          })
                          .catch(function(err) {
                            main.creationError = err.message;
                            main.addingPerk = false;
                          });
                      })
                      .catch(function(err) {
                        main.creationError = err.message;
                        main.addingPerk = false;
                      });
                  })
                  .catch(function(err) {
                    main.creationError = err.message;
                    main.addingPerk = false;
                  });
              }
            } else if (this.newPerkCategoryId != null) {
              if (this.newPerkCountable) {
                // new countable perk, existing perk category

                main.addingPerk = true;
                main.newPerkCategoryObj
                  .createPerk(main.newPerkStr, main.newPerkDesc, "QUANTITY")
                  .then(function(perk) {
                    main.item
                      .addPerk(perk, main.newPerkAmount)
                      .then(function() {
                        main.loadAvailablePerks();
                        main.loadAvailablePerkCategories();
                        main.pullData();
                        main.addingPerk = false;
                        main.newPerkEditing = false;
                        main.perkCategoryCreation = false;
                        main.newPerkObj = null;
                        main.newPerkCategoryId = null;
                        main.newPerkCategoryStr = "";
                        main.newPerkStr = "";
                        main.newPerkDesc = "";
                      })
                      .catch(function(err) {
                        main.creationError = err.message;
                        main.addingPerk = false;
                      });
                  })
                  .catch(function(err) {
                    main.creationError = err.message;
                    main.addingPerk = false;
                  });
              } else {
                // new uncountable perk, existing perk category
                main.addingPerk = true;
                main.newPerkCategoryObj
                  .createPerk(main.newPerkStr, main.newPerkDesc, "GENERAL")
                  .then(function(perk) {
                    main.item
                      .addPerk(perk)
                      .then(function() {
                        main.loadAvailablePerks();
                        main.loadAvailablePerkCategories();
                        main.pullData();
                        main.addingPerk = false;
                        main.newPerkEditing = false;
                        main.perkCategoryCreation = false;
                        main.newPerkObj = null;
                        main.newPerkCategoryId = null;
                        main.newPerkCategoryStr = "";
                        main.newPerkStr = "";
                        main.newPerkDesc = "";
                      })
                      .catch(function(err) {
                        main.creationError = err.message;
                        main.addingPerk = false;
                      });
                  })
                  .catch(function(err) {
                    main.creationError = err.message;
                    main.addingPerk = false;
                  });
              }
            }
          }
        }
      }
    },
    createItem() {
      let main = this;
      if (this.itemEdit.category == null) {
        this.categoryError = true;
        setTimeout(() => {
          this.categoryError = false;
        }, 1000);
      } else {
        main.creationError = "";
        this.itemEdit.category
          .createItem(
            this.itemEdit.name,
            this.itemEdit.description,
            this.itemEdit.price
          )
          .then(function(item) {
            main.$router.replace({
              name: "Package",
              params: { uuid: item.uuid }
            });
          })
          .catch(function(err) {
            main.creationError = err.message;
          });
      }
    },
    perkCategoryTryCreation() {
      if (this.newPerkCategoryId == null) {
        this.newPerkCategoryStr = this.newPerkCategory;
        this.perkCategoryCreation = true;
      } else {
        this.perkCategoryCreation = false;
      }
      this.actionDescCalc();
    },
    perkAdd() {
      if (
        this.newPerkObj == null &&
        this.newPerk != null &&
        this.newPerk.length > 0
      ) {
        var match = false;
        this.availablePerks.forEach(perk => {
          if (perk.name == this.newPerk) {
            match = true;
            this.newPerkId = perk.uuid;
            this.newPerkObj = perk;
          }
        });
        if (!match) {
          this.newPerkStr = this.newPerk;
          this.newPerkEditing = true;
        }
      }
      this.actionDescCalc();
    },
    loadAvailableInstances() {
      let main = this;
      main.loadingPerkCategories = true;
      this.network.getServers().then(function(servers) {
        var serverArray = servers;
        main.networkInstance.name="Proxy"
        serverArray.push(main.networkInstance);
        main.availableInstances = serverArray;
      });
    },
    loadAvailablePerkCategories() {
      let main = this;
      main.loadingPerkCategories = true;
      this.network
        .getStore()
        .getPerkCategories()
        .then(function(perks) {
          main.availablePerkCategories = perks;
          main.loadingPerkCategories = false;
        });
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
    actionDescCalc() {
      this.showActionDesc = true;
      this.allowAction = false;
      if (this.newPerkObj != null) {
        if (
          this.newPerkCountable &&
          (this.newPerkAmount == null ||
            this.newPerkAmount == 0 ||
            this.newPerkAmount == "")
        ) {
          this.actionDesc = "Missing amount";
        } else {
          this.actionDesc =
            "Will modify existing matching perk or add it if missing";
          this.allowAction = true;
        }
      } else {
        if (this.newPerkEditing) {
          if (this.newPerkStr == null || this.newPerkStr == "") {
            this.actionDesc = "Missing new perk name";
          } else if (this.newPerkDesc == null || this.newPerkDesc == "") {
            this.actionDesc = "Missing new perk description";
          } else {
            if (this.perkCategoryCreation) {
              if (
                this.newPerkCategoryStr == null ||
                this.newPerkCategoryStr == ""
              ) {
                this.actionDesc = "Missing new perk category title";
              } else {
                if (this.newPerkCountable) {
                  this.actionDesc =
                    "Will create a new countable perk along a new perk category and add it to the package";
                } else {
                  this.actionDesc =
                    "Will create a new perk along a new perk category and add it to the package";
                }
                this.allowAction = true;
              }
            } else {
              if (this.newPerkCategoryId == null) {
                this.actionDesc = "Missing new perk category";
              } else {
                if (this.newPerkCountable) {
                  this.actionDesc =
                    "Will create a new countable perk inside an existing perk category and add it to the package";
                } else {
                  this.actionDesc =
                    "Will create a new perk inside an existing perk category and add it to the package";
                }
                this.allowAction = true;
              }
            }
          }
        }
      }
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
