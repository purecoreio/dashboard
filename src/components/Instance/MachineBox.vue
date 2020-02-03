<template>
  <v-card style="position: relative; margin-bottom: 10px; min-height: 350px">
    <div id="datasheet">
      <v-list dense>
        <v-list-item>
          <v-list-item-content>CPU</v-list-item-content>
          <v-list-item-content class="align-end">{{ machine.cpu.brand }}</v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>RAM</v-list-item-content>
          <v-list-item-content class="align-end">{{ this.getComputedRAM(machine.ram) }}</v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>Motherboard</v-list-item-content>
          <v-list-item-content
            class="align-end"
          >{{ machine.motherboard.manufacturer + " " + machine.motherboard.model }}</v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>Network</v-list-item-content>
          <v-list-item-content class="align-end">{{ this.getBestAdapter(machine.adapters) }}</v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>Storage</v-list-item-content>
          <v-list-item-content class="align-end">{{ this.getTotalCapacity(machine.drives) }}</v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>IP</v-list-item-content>
          <v-list-item-content class="align-end">{{ machine.ipv4 }}</v-list-item-content>
        </v-list-item>
      </v-list>
    </div>
    <div id="oem" style="position: absolute; bottom: 10px; left: 10px">
      <v-img
        v-if="machine.cpu.manufacturer.toLowerCase().includes('intel')"
        contain
        src="../../assets/oem/intel.svg"
        width="42px"
        height="42px"
      />
      <v-img
        v-if="machine.cpu.manufacturer.toLowerCase().includes('amd')"
        contain
        src="../../assets/oem/amd.png"
        width="42px"
        height="42px"
      />
      <v-img
        v-if="(machine.cpu.manufacturer.toLowerCase().includes('intel')+machine.cpu.manufacturer.toLowerCase().includes('amd'))<1"
        contain
        src="../../assets/oem/unknown.svg"
        width="42px"
        height="42px"
      />
    </div>
  </v-card>
</template>


<script>
export default {
  name: "MachineBox",
  props: ["uuid", "machine"],
  data: () => ({}),
  methods: {
    getComputedRAM(ram) {
      console.log(ram);
      var totalSize = 0;
      var hz = null;
      ram.forEach(ramStick => {
        hz = ramStick.clockSpeed;
        totalSize += ramStick.size;
      });
      return totalSize / 1073741824 + "GB (" + hz + "MHz)";
    },
    getTotalCapacity(drives) {
      var totalStorage = 0;
      var first = true;
      var techSet = "";
      drives.forEach(drive => {
        totalStorage += parseInt(drive.size);
        if (drive.interfaceType != null) {
          if (first) {
            first = false;
            techSet += drive.interfaceType;
          } else if (!techSet.includes(drive.interfaceType)) {
            techSet += ", " + drive.interfaceType;
          }
        }
      });

      return Math.floor(totalStorage / 1073741824) + "GB " + techSet;
    },
    getBestAdapter(adapters) {
      var bestAdapter = null;

      adapters.forEach(adapter => {
        if (bestAdapter != null) {
          if (adapter.speed > 0 && adapter.speed > bestAdapter.speed) {
            bestAdapter = adapter;
          }
        } else {
          if (adapter.speed > 0) {
            bestAdapter = adapter;
          }
        }
      });

      if (bestAdapter != null) {
        return bestAdapter.speed / 1000 + "Gb/s";
      } else {
        return "Unknown";
      }
    }
  }
};
</script>
