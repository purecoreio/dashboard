<template>
  <div>
    <v-fade-transition>
      <div v-show="representation != null">
        <div v-if="representation != null">
          <store-category
            v-for="category in representation.itemCategoryRepresentations"
            :key="category.itemCategory.id"
            :category="category"
          />
        </div>
      </div>
    </v-fade-transition>
  </div>
</template>
<script>
import storeCategory from "@/components/store/Category";
export default {
  components: {
    storeCategory,
  },
  data: () => {
    return {
      editing: false,
      visibility: false,
      representation: null,
      error: null,
    };
  },
  mounted() {
    this.load();
  },
  methods: {
    load() {
      this.representation = null;
      let main = this;
      this.$purecore
        .getContext()
        .getNetwork()
        .asStore()
        .getRepresentation()
        .then((representation) => {
          main.representation = representation;
          main.error = null;
          console.log(representation);
        })
        .catch((e) => {
          main.error = e.message;
        });
    },
  },
};
</script>