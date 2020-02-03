<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is independent to the selected network, as it is stored in your account and not as a network asset.</v-alert>
    <v-row style="width: 100%">

      <v-col cols="12" md="6" xl="4" v-for="machine in machines" :key="machine.uuid">
        <MachineBox :uuid="machine.uuid" :machine="machine" />
      </v-col>

    </v-row>

    <!-- dialog finish -->
  </div>
</template>


<script>
import MachineBox from "../../components/Instance/MachineBox";
import core from "purecore";

export default {
  name: "MachineList",
  components: {
    MachineBox: MachineBox
  },
  data: () => ({
    session: null,
    machines: [],
    location: [
      {
        text: "Servers",
        disabled: true,
        href: ""
      },
      {
        text: "Machines",
        disabled: false,
        href: "#"
      }
    ],
    dialog: false,
    e1: 1,
    network: null
  }),
  mounted() {
    if (localStorage.session && localStorage.network) {
      var coreInstance = new core(JSON.parse(localStorage.session));
      this.session = coreInstance.getCoreSession();
      var mainObj = this;
      coreInstance
        .getCoreSession()
        .getMachines()
        .then(function(machines) {
          // console.log(machines);
          mainObj.machines = machines;
        });
    }
  }
};
</script>
