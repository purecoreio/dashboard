<template>
  <div v-if="initialSetup" class="mb-3">
    <instance-wizard @created="created" @deleted="deleted" :network="network" />
  </div>
  <div>
    <v-card :to="`/network/instance/${instance.id}`" class="mb-3 px-5 py-4" v-for="instance in instances"
      :key="instance.id">
      <v-row align="center" no-gutters>
        <v-col>
          <v-list-item class="pa-0">
            <div>
              <v-list-item-title>
                {{ instance.path }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ instance.id }}
              </v-list-item-subtitle>
            </div>
          </v-list-item>
        </v-col>
        <v-col cols="auto">
          <v-btn @click="deleteInstance(instance)" icon :color="null">
            <v-icon icon="mdi-delete" />
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script>
import InstanceWizard from "@/components/wizards/Instance.vue";
export default {
  props: ["network"],
  components: {
    InstanceWizard,
  },
  data() {
    return {
      instances: [],
      loading: false,
      initialSetup: false,
    };
  },
  methods: {
    async deleteInstance(instance) {
      this.loading = true;
      await instance.delete();
      this.deleted([instance]);
      this.loading = false;
    },
    created(instances) {
      this.instances.push(...instances);
    },
    deleted(instances) {
      this.instances = this.instances.filter((instance) => {
        return instances.filter((deleted) => deleted.id == instance.id).length <= 0;
      });
    },
    async loadInstances() {
      this.loading = true;
      this.instances = await this.network.getInstances();
      this.loading = false;
    },
  },
  async beforeMount() {
    await this.loadInstances();
    if (this.instances.length <= 0) {
      this.initialSetup = true;
    }
  },
};
</script>
