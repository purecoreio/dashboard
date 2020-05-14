<template>
  <div>
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
    this.perk.perk.commands.forEach(command => {
      var uuid = command.listId;
      var instances = command.executeOn;
      if (this.cmdInstances[uuid] == undefined) {
        this.cmdInstances[uuid] = { executeOn: [], executeOnIds: [] };
      }
      this.cmdInstances[uuid].executeOn = instances;
      instances.forEach(instance => {
          this.cmdInstances[uuid].executeOnIds.push(instance.uuid)
      });
    });
    this.processedInstances = true;
  },
  data: () => ({
    processedInstances: false,
    addingCmd: false,
    newCmd: null,
    selectedInstances: [],
    cmdInstances: {}
  })
};
</script>