<template>
  <v-card v-if="category" class="mb-5" style="overflow: hidden">
    <v-row align="center" no-gutters>
      <v-col>
        <v-text-field :disabled="loading" full-width class="left" @keyup.enter="pkg ? update() : create()" v-model="name" hide-details
          label="Name" autofocus />
      </v-col>
      <v-col cols="4">
        <v-text-field :disabled="loading" full-width class="right" @keyup.enter="pkg ? update() : create()" :round="0" v-model="price"
          label="Price" hide-details type="number" />
      </v-col>
    </v-row>
    <div class="pa-5">
      <v-alert class="mb-5" v-if="error">
        {{ error }}
      </v-alert>
      <editor :disabled="loading" v-model="description" />
    </div>
    <div class="px-5 pb-5">
      <v-row align="center" no-gutters>
        <v-col v-if="pkg" cols="auto">
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn size="small" variant="text" icon v-bind="props">
                <v-icon> mdi-dots-vertical </v-icon>
              </v-btn>
            </template>
            <v-list class="py-0">
              <v-list-item @click="deletePackage()" class="text-red">
                <v-list-item-icon icon="mdi-delete" />
                <v-list-item-title class="pl-3">Delete</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-col>
        <v-spacer />
        <v-col v-if="category" cols="auto">
          <v-btn size="small" class="mr-2" variant="text" v-if="pkg && modified" :disabled="loading" @click="restore()"
            icon>
            <v-icon>mdi-restore</v-icon>
          </v-btn>
          <v-btn :disabled="loading" v-if="pkg && modified" @click="update()" append-icon="mdi-content-save">
            Save
          </v-btn>
          <v-btn :disabled="loading" v-if="!pkg" @click="create()" append-icon="mdi-content-save">
            Create
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-card>
  <div v-if="pkg">
    <perk-picker :package="pkg" class="mb-5"/>
    <v-card class="pa-5">
      commands
    </v-card>
  </div>
</template>

<script>
import Editor from "@/components/editor/Editor.vue";
import PerkPicker from "../../../../components/commerce/PerkPicker.vue";
export default {
  props: ["network"],
  components: {
    Editor,
    PerkPicker
},
  async mounted() {
    this.loading = true;
    this.store = await this.network.getStore();
    try {
      this.category = await this.store.getCategory(this.$route.params.category);
      if (this.$route.params.package) {
        this.pkg = await this.category.getPackage(this.$route.params.package);
        this.name = this.pkg.name;
        this.description = this.pkg.description;
        this.price = this.pkg.price;
        await this.$nextTick();
        this.modified = false;
      }
    } catch (error) {
      this.error = error.message;
    }
    this.loading = false;
  },
  data() {
    return {
      pkg: null,
      store: null,
      category: null,
      loading: false,
      name: null,
      description: null,
      price: null,
      modified: false,
      error: null,
    };
  },
  watch: {
    name() {
      if (this.pkg) this.modified = true;
    },
    description() {
      if (this.pkg) this.modified = true;
    },
    price() {
      if (this.pkg) this.modified = true;
    },
  },
  methods: {
    async deletePackage() {
      this.loading = true;
      try {
        await this.pkg.delete();
        this.$router.push({ path: `/network/${this.network.id}/store` });
        this.error = null;
      } catch (error) {
        this.error = error.message;
      }
      this.loading = false;
    },
    async restore() {
      this.price = this.pkg.price;
      this.name = this.pkg.name;
      this.description = this.pkg.description;
      await this.$nextTick();
      this.modified = false;
    },
    async create() {
      this.loading = true;
      try {
        this.pkg = await this.category.createPackage(
          this.name,
          this.price,
          this.description
        );
        this.$router.replace({ path: `${this.category.id}/${this.pkg.id}` });
        this.error = null;
      } catch (error) {
        this.error = error.message;
      }
      this.loading = false;
    },
    async update() {
      this.loading = true;
      try {
        this.pkg = await this.pkg.update(this.name, this.description, undefined, undefined, this.price)
        this.error = null;
        this.modified = false
      } catch (error) {
        this.error = error.message;
      }
      this.loading = false;
    },
  },
};
</script>