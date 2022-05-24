<template>
  <!-- loading should be animated using an skeleton or something similar -->
  <v-toolbar v-if="categories.length > 0" class="mb-2">
    <v-spacer />
    <v-btn class="my-5" :disabled="creating" :color="creating ? null : 'primary'" @click="creating = true" icon
      variant="text">
      <v-icon>mdi-plus</v-icon>
    </v-btn>
  </v-toolbar>
  <v-alert class="mb-2" v-if="error != null">
    {{ error }}
  </v-alert>
  <div v-if="!loading">
    <category class="mb-2" v-for="category in categories" @delete="categories = store.categories" :key="category.id"
      :category="category" />
  </div>
  <div ref="wizard">
    <new-category @cancel="creating = false" @created="creating = false" v-if="creating" :store="store" />
  </div>
</template>
<script>
import Category from "@/components/commerce/Category.vue";
import NewCategory from "@/components/wizards/NewCategory.vue";
export default {
  props: ["network"],
  components: {
    Category,
    NewCategory,
  },
  async mounted() {
    this.store = await this.network.getStore();
    await this.load();
  },
  methods: {
    async load() {
      this.loading = true;
      try {
        this.categories = await this.store.getCategories();
        this.error = null;
      } catch (error) {
        this.error = error.message;
      }
      this.loading = false;
    },
  },
  watch: {
    async creating(creating) {
      if (creating) {
        await this.$nextTick();
        this.$smoothScroll({ scrollTo: this.$refs.wizard });
      }
    },
    categories() {
      if (this.categories.length <= 0) {
        this.creating = true;
      }
    },
  },
  data() {
    return {
      store: null,
      loading: false,
      error: null,
      categories: [],
      creating: false,
    };
  },
};
</script>
