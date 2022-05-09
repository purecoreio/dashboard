<template>
  <v-card>
    <v-text-field
      autofocus
      class="mb-5"
      @keyup.enter="create()"
      hide-details
      :disabled="loading"
      v-model="name"
      label="Name"
    />
    <div class="px-5 pb-5">
      <editor v-model="description" />
      <v-row no-gutters class="mt-5">
        <v-col>
          <v-btn @click="$emit('cancel')" variant="text" :color="null"> Cancel </v-btn>
        </v-col>
        <v-col cols="auto">
          <v-btn @click="create()" append-icon="mdi-content-save"> Create </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<script>
import Editor from "@/components/editor/Editor.vue";
export default {
  props: ["store"],
  components: {
    Editor,
  },
  data() {
    return {
      name: undefined,
      description: undefined,
      loading: false,
    };
  },
  methods: {
    async create() {
      const category = await this.store.createCategory(
        this.name,
        this.description ?? undefined
      );
      this.$emit("created", category);
    },
  },
};
</script>
<style>
.v-field__field {
  padding-inline: 8px !important;
}
</style>
