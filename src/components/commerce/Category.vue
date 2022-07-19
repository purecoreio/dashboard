<template>
  <v-card style="overflow: hidden">
    <v-text-field class="mb-5" @keyup.enter="update()" hide-details :disabled="loading" v-model="name" label="Name" />
    <div class="px-5">
      <v-alert v-if="error" class="mb-5">
        {{ error }}
      </v-alert>
      <editor v-model="description" />
    </div>
    <v-row class="my-2 pl-4 pr-5" no-gutters align="center">
      <v-col cols="auto">
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn size="small" variant="text" icon v-bind="props">
              <v-icon> mdi-dots-vertical </v-icon>
            </v-btn>
          </template>
          <v-list class="py-0">
            <v-list-item @click="deleteCategory()" class="text-red">
              <v-list-item-icon icon="mdi-delete" />
              <v-list-item-title class="pl-3">Delete</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </v-col>
      <v-col class="pl-3">
        <v-tooltip color="primary" max-width="300px" right>
          <template v-slot:activator="{ props }">
            <v-switch color="primary" hide-details :disabled="loading" v-model="upgradable" v-bind="props"
              @click="update()" label="Upgradable" />
          </template>
          <span>
            Upgradable categories will offer a discount for customers upgrading from
            previously purchased packages from the same category
          </span>
        </v-tooltip>
      </v-col>
      <v-col cols="auto">
        <v-btn class="mr-2" variant="text" v-if="modified" :disabled="loading" @click="restore()" icon>
          <v-icon>mdi-restore</v-icon>
        </v-btn>
        <!-- TODO wrap on transition, not working with beta 3 -->
        <v-btn v-if="modified" :disabled="loading" @click="update()" append-icon="mdi-content-save">Save</v-btn>
      </v-col>
    </v-row>
    <v-list class="py-0">
      <v-list-item :to="`/network/store/category/${this.category.id}`">
        <v-row no-gutters align="center">
          <v-col class="pr-3" cols="auto">
            <v-btn :disabled="loading" size="small" variant="text" icon>
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-col>
          <v-col> create new package </v-col>
        </v-row>
      </v-list-item>
      <v-divider v-if="packages.length > 0" />
      <draggable v-model="packages" :group="category.id" handle=".handle" @change="packageSort" item-key="id">
        <template #item="{ element }">
          <v-list-item :to="`/network/store/category/${this.category.id}/${element.id}`">
            <v-row no-gutters align="center">
              <v-col class="pr-3" cols="auto">
                <v-btn :disabled="loading || modified" class="handle" size="small"
                  :color="loading || modified ? null : 'primary'" variant="text" icon>
                  <v-icon>mdi-drag-vertical</v-icon>
                </v-btn>
              </v-col>
              <v-col>
                <v-list-item-title>
                  {{ element.name }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  #{{ element.id }}
                </v-list-item-subtitle>
              </v-col>
              <v-col class="text-right" cols="1"> {{ element.price.amount.original.amount }} {{ element.price.amount.original.currency }} </v-col>
            </v-row>
          </v-list-item>
        </template>
      </draggable>
    </v-list>
  </v-card>
</template>

<script>
import draggable from "vuedraggable";
import Editor from "@/components/editor/Editor.vue";
export default {
  props: ["category"],
  components: {
    draggable,
    Editor,
  },
  data() {
    return {
      name: undefined,
      description: undefined,
      loading: false,
      modified: false,
      packages: [],
      upgradable: undefined,
      error: null,
    };
  },
  watch: {
    name(_, pre) {
      if (pre != undefined) this.modified = true;
    },
    description(_, pre) {
      if (pre != undefined) this.modified = true;
    },
    upgradable(_, pre) {
      if (pre != undefined) this.modified = true;
    },
  },
  mounted() {
    this.packages = this.category.packages;
    this.restore();
  },
  methods: {
    async packageSort(event) {
      if ("moved" in event) {
        this.loading = true;
        try {
          await event.moved.element.update(undefined, undefined, event.moved.newIndex);
        } catch (error) {
          this.error = error.message;
        }
        this.loading = false;
      }
    },
    async restore() {
      this.name = this.category.name;
      this.description = this.category.description;
      this.upgradable = this.upgradable;
      await this.$nextTick();
      this.modified = false;
    },
    async deleteCategory() {
      await this.category.delete();
      this.$emit("delete", this.category);
    },
    async update() {
      this.loading = true;
      // name?: string, description?: string, index?: number, upgradable?: boolean
      try {
        await this.category.update(
          this.name,
          this.description,
          undefined,
          this.upgradable
        );
        this.modified = false;
        this.error = null;
      } catch (error) {
        this.error = error.message;
      }
      this.loading = false;
    },
  },
};
</script>
