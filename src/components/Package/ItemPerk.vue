<template>
  <div>
    <v-dialog v-model="showRequirementsMenu" max-width="400">
      <v-card style="overflow:hidden">
        <v-card-title
          class="headline"
          v-if="paramRequirements!=null"
        >{{paramRequirements.name}} filters</v-card-title>
        <v-row align="center" class="pr-5 pl-5">
          <v-col class="flex-grow-1 flex-shrink-0">
            <v-text-field
              :error="requirements.regexError"
              v-model="requirements.regex"
              @change="updateRequirement('regex')"
              outlined
              hide-details
              label="regex"
            ></v-text-field>
          </v-col>
          <v-col class="flex-grow-0 flex-shrink-1">
            <v-btn
              :loading="requirements.regexRemoving"
              @click="clearRequirement('regex')"
              :color="requirements.regexRemovingError ? 'red' : ''"
              :disabled="requirements.regex==null||requirements.regex==''"
              icon
            >
              <v-icon>clear</v-icon>
            </v-btn>
          </v-col>
          <v-col
            :disabled="requirements.regex==null||requirements.regex==''"
            class="flex-grow-0 flex-shrink-1"
          >
            <v-btn :loading="requirements.regexUpdating" icon>
              <v-icon>save</v-icon>
            </v-btn>
          </v-col>
        </v-row>
        <div v-if="paramRequirements!=null&&paramRequirements.type=='img'">
          <v-divider />
          <p
            class="pr-5 pl-5 grey--text mt-3 mb-1"
          >this input will only allow valid URLs pointing to images. special image filtering:</p>
          <v-row align="center" class="pr-5 pl-5">
            <v-col class="flex-grow-1 flex-shrink-0">
              <v-text-field
                :error="requirements.sizeError"
                @change="updateRequirement('size')"
                v-model="requirements.size.width"
                outlined
                hide-details
                type="number"
                label="image width"
              ></v-text-field>
            </v-col>
            <v-col class="flex-grow-1 flex-shrink-0">
              <v-text-field
                :error="requirements.sizeError"
                @change="updateRequirement('size')"
                v-model="requirements.size.height"
                outlined
                type="number"
                hide-details
                label="image height"
              ></v-text-field>
            </v-col>
            <v-col class="flex-grow-0 flex-shrink-1">
              <v-btn
                @click="clearRequirement('size')"
                :loading="requirements.sizeRemoving"
                :color="requirements.sizeRemovingError ? 'red' : ''"
                :disabled="(requirements.size.height==null||requirements.size.height<=0)||requirements.size.width==null||requirements.size.width<=0"
                icon
              >
                <v-icon>clear</v-icon>
              </v-btn>
            </v-col>
            <v-col class="flex-grow-0 flex-shrink-1">
              <v-btn
                :loading="requirements.sizeUpdating"
                :disabled="(requirements.size.height==null||requirements.size.height<=0)||requirements.size.width==null||requirements.size.width<=0"
                icon
              >
                <v-icon>save</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-row align="center" class="pr-5 pl-5">
            <v-col class="flex-grow-1 flex-shrink-0">
              <v-select
                :error="requirements.imgtypeError"
                v-model="requirements.imgtype"
                @change="updateRequirement('imgtype')"
                outlined
                hide-details
                :items="imageTypes"
                :label="requirements.imgtype.length<=0 ? 'supported formats: all':'supported formats' "
                multiple
              ></v-select>
            </v-col>
            <v-col class="flex-grow-0 flex-shrink-1">
              <v-btn
                :color="requirements.imgtypeRemovingError ? 'red' : ''"
                :loading="requirements.imgtypeRemoving"
                @click="clearRequirement('imgtype')"
                icon
                :disabled="requirements.imgtype!=null&&requirements.imgtype.length<=0"
              >
                <v-icon>clear</v-icon>
              </v-btn>
            </v-col>
            <v-col class="flex-grow-0 flex-shrink-1">
              <v-btn
                :loading="requirements.imgtypeUpdating"
                icon
                :disabled="requirements.imgtype==null||(requirements.imgtype!=null&&requirements.imgtype.length==0)"
              >
                <v-icon>save</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </div>
        <v-divider />
        <div class="pr-5 pl-5">
          <v-row align="center">
            <v-col class="flex-grow-1 flex-shrink-0">
              <v-text-field
                :color="requirements.testStrOk == null ? '' : (requirements.testStrOk ? 'green' : 'red')"
                @keyup="testInput()"
                :loading="requirements.testing"
                v-model="requirements.testStr"
                placeholder="test values here"
                outlined
                hide-details
                label="Test Input"
              ></v-text-field>
            </v-col>
            <v-col class="flex-grow-0 flex-shrink-1">
              <v-btn
                icon
                :color="requirements.testStrOk == null ? '' : (requirements.testStrOk ? 'green' : 'red')"
              >
                <v-icon v-if="requirements.testStrOk===true">check</v-icon>
                <v-icon v-if="requirements.testStrOk===false">warning</v-icon>
                <v-icon v-if="requirements.testStrOk==null">help_outline</v-icon>
              </v-btn>
            </v-col>
          </v-row>
          <v-alert
            text
            color="red"
            transition="scale-transition"
            :value="requirements.testStrOk===false"
          >{{requirements.testErr}}</v-alert>
        </div>
      </v-card>
    </v-dialog>
    <v-row align="center">
      <v-col cols="auto">
        <v-text-field
          hide-details
          style="width:100px"
          outlined
          type="number"
          :disabled="perk.perk.type!='QUANTITY'"
          label="Amount"
          placeholder="Uncountable"
          :value="perk.quantity!=null ? perk.quantity : ''"
        ></v-text-field>
      </v-col>
      <v-col>{{perk.perk.name}}</v-col>
      <v-col cols="auto">
        <v-btn
          @click="addingParam=!addingParam"
          text
          color="primary"
          :icon="!$vuetify.breakpoint.smAndUp"
        >
          <v-icon>last_page</v-icon>
          <span v-if="$vuetify.breakpoint.smAndUp">add param</span>
        </v-btn>
        <v-btn
          @click="addingCmd=!addingCmd"
          text
          color="primary"
          :icon="!$vuetify.breakpoint.smAndUp"
        >
          <v-icon>last_page</v-icon>
          <span v-if="$vuetify.breakpoint.smAndUp">add cmd</span>
        </v-btn>
      </v-col>
    </v-row>
    <v-card class="pb-3 pl-1 pr-1 mb-7" outlined v-if="params!=null&&(params.length-deletedParams.length)>0">
      <v-list>
        <v-subheader>USER PARAMS</v-subheader>
        <v-scale-transition v-for="(param,i) in params" :key="i">
          <v-list-item v-show="!(deletedParams.includes(param.uuid))">
            <v-list-item-content>
              <v-row no-gutters>
                <v-col class="pr-2">
                  <v-text-field
                    hide-details
                    solo-inverted
                    disabled
                    :value="'%'+param.placeholder+'%'"
                  ></v-text-field>
                </v-col>
                <v-col class="pl-2">
                  <v-text-field hide-details solo-inverted disabled :value="param.name"></v-text-field>
                </v-col>
              </v-row>
            </v-list-item-content>
            <v-list-item-action class="pl-2">
              <v-menu origin="right" transition="scale-transition" left>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on" icon>
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                </template>
                <v-list class="pa-a ma-0">
                  <v-list-item @click="showRequirements(param)">
                    <v-list-item-action>
                      <v-icon>filter_alt</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>input filtering</v-list-item-content>
                  </v-list-item>
                  <v-list-item @click="removeParam(param)">
                    <v-list-item-action>
                      <v-icon>delete</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>delete</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-list-item-action>
          </v-list-item>
        </v-scale-transition>
      </v-list>
    </v-card>
    <v-row v-for="cmd in perk.perk.commands" :key="cmd.cmd.uuid" no-gutters class="mb-2">
      <v-col class="pr-2">
        <v-text-field solo-inverted hide-details :value="cmd.cmd.cmd"></v-text-field>
      </v-col>
      <v-col v-if="processedInstances" cols="auto">
        <v-select
          style="width:140px"
          v-model="cmdInstances[cmd.listId].executeOnIds"
          hide-details
          solo-inverted
          item-text="name"
          item-value="uuid"
          :items="instances"
          label="Instances"
          multiple
        />
      </v-col>
    </v-row>
    <v-expand-transition>
      <div v-show="addingParam">
        <v-row align="center">
          <v-col :cols="$vuetify.breakpoint.mdAndUp ? '' : '12'" class="pr-2">
            <v-text-field
              v-model="param.placeholder"
              outlined
              hide-details
              autocomplete="off"
              label="Placeholder"
            />
          </v-col>
          <v-col :cols="$vuetify.breakpoint.mdAndUp ? '' : '12'" class="pr-2">
            <v-text-field
              autocomplete="off"
              v-model="param.name"
              outlined
              hide-details
              label="Name"
            />
          </v-col>
          <v-col :cols="$vuetify.breakpoint.mdAndUp ? '' : '12'" class="pr-2">
            <v-text-field
              v-model="param.description"
              autocomplete="off"
              outlined
              hide-details
              label="Description"
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col :cols="$vuetify.breakpoint.mdAndUp ? '' : '12'" class="pr-2">
            <v-text-field
              v-model="param.default"
              outlined
              hide-details
              autocomplete="off"
              label="Default Value"
            />
          </v-col>
          <v-col :cols="$vuetify.breakpoint.mdAndUp ? '' : '12'" class="pr-2">
            <v-select
              hide-details
              v-model="param.type"
              :items="param.types"
              item-value="type"
              item-text="txt"
              label="Types"
              outlined
            ></v-select>
          </v-col>
          <v-col :cols="$vuetify.breakpoint.mdAndUp ? '' : '12'" class="pr-2">
            <v-select
              hide-details
              v-model="param.mandatory"
              :items="param.mandatoryTypes"
              item-value="type"
              item-text="txt"
              label="Mandatory"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12" class="text-right">
            <v-alert
              class="text-left"
              transition="scale-transition"
              :value="param.error!=null"
              color="primary"
              text
            >{{param.error}}</v-alert>
            <v-btn
              @click="addParam()"
              :loading="param.loading"
              color="primary"
              :block="!$vuetify.breakpoint.mdAndUp"
              large
            >add param</v-btn>
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
    <v-expand-transition>
      <div v-show="addingCmd">
        <v-row>
          <v-col class="pr-2">
            <v-text-field v-model="newCmd" solo-inverted hide-details placeholder="Your CMD" />
          </v-col>
          <v-col cols="auto">
            <v-select
              style="width:140px"
              hide-details
              solo-inverted
              item-text="name"
              :loading="instances==null"
              :items="instances"
              label="Instances"
              multiple
            />
          </v-col>
        </v-row>
      </div>
    </v-expand-transition>
    <v-divider />
  </div>
</template>
<script>
export default {
  props: ["item", "perk", "instances"],
  mounted() {
    this.params = this.perk.perk.params;
    if (this.perk.perk.params == null) this.params = [];

    this.perk.perk.commands.forEach(command => {
      var uuid = command.listId;
      var instances = command.executeOn;
      if (this.cmdInstances[uuid] == undefined) {
        this.cmdInstances[uuid] = { executeOn: [], executeOnIds: [] };
      }
      this.cmdInstances[uuid].executeOn = instances;
      instances.forEach(instance => {
        this.cmdInstances[uuid].executeOnIds.push(instance.uuid);
      });
    });
    this.processedInstances = true;
  },
  methods: {
    removeParam(param) {
      let main = this;
      main.deletedParams.push(param.uuid);
      param
        .remove()
        .then(() => {
          const index = main.params.indexOf(param);
          if (index > -1) {
            main.params.splice(index, 1);
          }
        })
        .catch(() => {
          // ignore
        });
    },
    testInput() {
      this.requirements.testing = true;
      let main = this;
      this.paramRequirements
        .test(this.requirements.testStr)
        .then(() => {
          main.requirements.testing = false;
          main.requirements.testStrOk = true;
        })
        .catch(err => {
          main.requirements.testing = false;
          main.requirements.testErr = err;
          main.requirements.testStrOk = false;
        });
    },
    showRequirements(param) {
      this.paramRequirements = param;
      this.requirements.regex = null;
      this.requirements.size = { width: null, height: null };
      this.requirements.imgtype = [];
      param.requirements.forEach(requirement => {
        if (requirement.type == "regex")
          this.requirements.regex = requirement.value;
        if (requirement.type == "imgtype")
          this.requirements.imgtype = requirement.value;
        if (requirement.type == "size")
          this.requirements.size = {
            width: requirement.value[0],
            height: requirement.value[1]
          };
      });
      this.showRequirementsMenu = true;
    },
    clearRequirement(type) {
      let main = this;
      if (type == "regex") {
        this.requirements.regexRemovingError = false;
        this.requirements.regexRemoving = true;
        this.paramRequirements
          .removeRequirement("regex")
          .then(() => {
            main.requirements.regexRemoving = false;
            this.requirements.regex = null;
            main.clearRemovingErrors();
            if (main.requirements.testStrOk != null) {
              main.testInput();
            }
          })
          .catch(() => {
            main.requirements.regexRemovingError = true;
            main.requirements.regexRemoving = false;
            main.clearRemovingErrors();
          });
      } else if (type == "size") {
        this.requirements.sizeRemovingError = false;
        this.requirements.sizeRemoving = true;
        this.paramRequirements
          .removeRequirement("size")
          .then(() => {
            main.requirements.sizeRemoving = false;
            this.requirements.size.width = null;
            this.requirements.size.height = null;
            main.clearRemovingErrors();
            if (main.requirements.testStrOk != null) {
              main.testInput();
            }
          })
          .catch(() => {
            main.requirements.sizeRemovingError = true;
            main.requirements.sizeRemoving = false;
            main.clearRemovingErrors();
          });
      } else if (type == "imgtype") {
        this.requirements.imgtypeRemovingError = false;
        this.requirements.imgtypeRemoving = true;
        this.paramRequirements
          .removeRequirement("imgtype")
          .then(() => {
            main.requirements.imgtypeRemoving = false;
            this.requirements.imgtype = [];
            main.clearRemovingErrors();
            if (main.requirements.testStrOk != null) {
              main.testInput();
            }
          })
          .catch(() => {
            main.requirements.imgtypeRemovingError = true;
            main.requirements.imgtypeRemoving = false;
            main.clearRemovingErrors();
          });
      }
    },
    clearRemovingErrors() {
      setTimeout(() => {
        this.requirements.imgtypeRemovingError = false;
        this.requirements.sizeRemovingError = false;
        this.requirements.regexRemovingError = false;
      }, 1000);
    },
    updateRequirement(type) {
      let main = this;
      if (type == "regex") {
        main.requirements.regexError = false;
        if (
          this.requirements.regex != "" &&
          this.requirements.regex.length > 0
        ) {
          this.requirements.regexUpdating = true;
          this.paramRequirements
            .addRequirement("regex", this.requirements.regex)
            .then(() => {
              main.requirements.regexUpdating = false;
              if (main.requirements.testStrOk != null) {
                main.testInput();
              }
            })
            .catch(() => {
              main.requirements.regexUpdating = false;
              main.requirements.regexError = true;
            });
        } else {
          this.clearRequirement("regex");
        }
      } else if (type == "size") {
        main.requirements.sizeError = false;
        if (
          (this.requirements.size.width == null &&
            this.requirements.size.height == null) ||
          (this.requirements.size.width == "" &&
            this.requirements.size.height == "")
        ) {
          this.clearRequirement("size");
        } else if (
          ((this.requirements.size.width == null ||
            this.requirements.size.width == "") &&
            this.requirements.size.height != null &&
            this.requirements.size.height != "") ||
          ((this.requirements.size.height == null ||
            this.requirements.size.height == "") &&
            this.requirements.size.width != null &&
            this.requirements.size.width != "")
        ) {
          // waiting for full update
        } else if (
          this.requirements.size.width != null &&
          this.requirements.size.height != null
        ) {
          this.requirements.sizeUpdating = true;
          this.paramRequirements
            .addRequirement("size", [
              parseInt(this.requirements.size.width),
              parseInt(this.requirements.size.height)
            ])
            .then(() => {
              main.requirements.sizeUpdating = false;
              if (main.requirements.testStrOk != null) {
                main.testInput();
              }
            })
            .catch(() => {
              main.requirements.sizeUpdating = false;
              main.requirements.sizeError = true;
            });
        }
      } else if (type == "imgtype") {
        main.requirements.imgtypeError = false;
        if (
          this.requirements.imgtype != null &&
          this.requirements.imgtype.length > 0
        ) {
          this.requirements.imgtypeUpdating = true;
          this.paramRequirements
            .addRequirement("imgtype", this.requirements.imgtype)
            .then(() => {
              main.requirements.imgtypeUpdating = false;
              if (main.requirements.testStrOk != null) {
                main.testInput();
              }
            })
            .catch(() => {
              main.requirements.imgtypeUpdating = false;
              main.requirements.imgtypeError = true;
            });
        } else {
          this.clearRequirement("imgtype");
        }
      }
    },
    addParam() {
      this.param.loading = true;
      let main = this;
      this.param.error = null;
      this.perk.perk
        .addParam(
          this.param.placeholder,
          this.param.name,
          this.param.description,
          this.param.type,
          this.param.mandatory,
          this.param.default
        )
        .then(data => {
          main.params.push(data);
          main.param.loading = false;
          main.param.name = null;
          main.param.description = null;
          main.param.placeholder = null;
          main.param.mandatory = null;
          main.param.default = null;
          main.param.type = null;
          main.param.error = null;
          main.addingParam = false;
        })
        .catch(err => {
          main.param.error = err;
          main.param.loading = false;
        });
      //this.perk.perk.addParam(this.param.placeholder, this.param.name, this.param.description, type, mandatory?: boolean, defaultv?: string)
    }
  },
  data: () => ({
    showRequirementsMenu: false,
    paramRequirements: null,
    processedInstances: false,
    addingCmd: false,
    addingParam: false,
    newCmd: null,
    selectedInstances: [],
    cmdInstances: {},
    params: [],
    deletedParams: [],
    imageTypes: ["image/png", "image/jpg", "image/jpeg", "image/gif"],
    requirements: {
      regexRemoving: false,
      regexRemovingError: false,
      regexError: false,
      regex: null,
      regexUpdating: false,
      sizeRemoving: false,
      sizeRemovingError: false,
      sizeError: false,
      sizeUpdating: false,
      testStr: null,
      testStrOk: null,
      testErr: null,
      testing: false,
      size: {
        width: null,
        height: null
      },
      imgtypeRemoving: false,
      imgtypeRemovingError: false,
      imgtypeUpdating: false,
      imgtypeError: false,
      imgtype: []
    },
    param: {
      name: null,
      description: null,
      placeholder: null,
      loading: false,
      mandatory: null,
      default: null,
      type: null,
      error: null,
      types: [
        {
          txt: "image url",
          type: "img"
        },
        {
          txt: "text",
          type: "str"
        }
      ],
      mandatoryTypes: [
        {
          txt: "yes",
          type: true
        },
        {
          txt: "no",
          type: false
        }
      ]
    }
  })
};
</script>