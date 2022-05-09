<template>
  <v-sheet :rounded="true">
    <div class="py-1 px-1">
      <v-row align="center" no-gutters>
        <v-col> </v-col>
        <v-col cols="auto">
          <v-btn-toggle style="height: 32px" v-model="html">
            <v-btn color="primary" :value="1">
              <v-icon> mdi-xml </v-icon>
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </div>
    <v-card class="py-6">
      <tiptap class="pl-8" v-if="!html" v-model="modelValue" />
      <prism-editor
        v-if="html"
        v-model="modelValue"
        :highlight="highlighter"
        line-numbers
      />
    </v-card>
  </v-sheet>
</template>
<script>
import Tiptap from "./Tiptap.vue";
import { html } from "js-beautify";

import { PrismEditor } from "vue-prism-editor";
import "vue-prism-editor/dist/prismeditor.min.css";

import { highlight, languages } from "prismjs/components/prism-core";
import "prismjs/components/prism-markup";
import "prismjs/themes/prism-tomorrow.css";

export default {
  props: {
    modelValue: {
      type: String,
      default: "",
    },
  },
  components: {
    PrismEditor,
    Tiptap,
  },

  data() {
    return {
      html: null,
    };
  },
  watch: {
    html(newval) {
      if (newval) {
        this.$emit("update:modelValue", html(this.modelValue));
      }
    },
    modelValue() {
      this.$emit("update:modelValue", this.modelValue);
    },
  },
  methods: {
    highlighter(code) {
      return highlight(code, languages.html);
    },
  },
};
</script>
<style>
.prism-editor__textarea {
  outline: 0px;
}
</style>
