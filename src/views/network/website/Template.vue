<template>
  <div>
    <vue-editor :src="src" />
  </div>
</template>
<script>
import vueEditor from "@/components/VueEditor";
export default {
  components: {
    vueEditor,
  },
  data: () => {
    return {
      src:
        '<v-app> <nav> <v-sheet dark> <v-container class="pt-4 pb-4 fill-height"> <v-btn color="primary" outlined rounded text> play.example.com </v-btn> <v-spacer></v-spacer> <v-avatar class="mr-5" size="32"> <img src="https://minotar.net/helm/quiquelhappy"/> </v-avatar> <span class="overline" style="font-weight: 700;">USERNAME</span> </v-container> </v-sheet> <v-sheet color="primary lighten-1"> <v-img height="200px" src="./squares.png"> <v-container class="pt-10 pb-10"> <v-row align="center"> <v-col> <v-img height="120px" width="250px" contain src="./largeLogo.png"/> </v-col> <v-col class="text-right"> <v-btn large depressed color="accent" class="black--text" tile> <v-icon class="mr-2">toll</v-icon> EUR </v-btn> <v-btn large depressed color="white" light tile> <v-icon class="mr-2">shopping_cart</v-icon> BASKET </v-btn> </v-col> </v-row> </v-container> </v-img> </v-sheet> <v-sheet color="primary"> <v-container class="pt-4 pb-4 text-right"> <v-btn dark v-for="(page,i) in pages" :key="i" text>{{page.name}}</v-btn> </v-container> </v-sheet> <v-sheet class="pt-3 pb-3" color="secondary lighten-1"> <v-container class="white--text"> <v-row align="center"> <v-col class="flex-grow-1 flex-shrink-0"> <h1>SUPPORT EXAMPLE!</h1> <h4>PURCHASES SUPPORT US AND OUR WORK!</h4> </v-col> <v-col class="flex-grow-0 flex-shrink-1"> <v-btn depressed tile large color="secondary"> <v-icon class="mr-2">shopping_cart</v-icon> check out the store </v-btn> </v-col> </v-row> </v-container> </v-sheet> </nav> <v-main> <v-container> <v-card outlined class="pa-2"> test </v-card> </v-container> </v-main> <v-footer color="secondary lighten-1" padless> <v-row justify="center" no-gutters> <v-col cols="12"> <v-container> <v-row align="center" no-gutters> <v-col class="flex-grow-1 flex-shrink-0"> <v-row align="center"> <v-col class="flex-grow-0 flex-shrink-1"> <v-img contain width="60px" height="60px" src="./logo.png"/> </v-col> <v-col class="flex-grow-1 flex-shrink-0 white--text"> Minecraft is a trademark of Mojang AB </v-col> </v-row> </v-col> <v-col class="flex-grow-0 flex-shrink-1"> <v-btn dark text> LEGAL </v-btn> </v-col> </v-row> </v-container> </v-col> <v-col class="secondary lighten-2 py-4 text-center white--text" cols="12">{{new Date().getFullYear()}}— <strong>example</strong> </v-col> </v-row> </v-footer> </v-app>',
    };
  },
};
</script>