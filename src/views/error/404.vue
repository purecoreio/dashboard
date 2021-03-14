<template>
  <div style="max-width: 800px; margin-left: auto; margin-right: auto">
    <v-row align="center">
      <v-col>
        <h1>{{ $t("supportMessageTitle") }}</h1>
        <h4>
          {{ $t("supportMessage1") }}
          <br />
          {{ $t("supportMessage2") }}
        </h4>
        <v-btn
          href="https://www.buymeacoffee.com/happy"
          target="_blank"
          class="mt-3"
          color="primary"
        >
          {{ $t("supportMessageBtn") }}
        </v-btn>
      </v-col>
      <v-col>
        <v-img height="300px" contain src="@/assets/states/coffee.webp" />
      </v-col>
    </v-row>
    <v-divider />
    <v-alert class="mt-5" text>
      {{ $t("supportMessageFooter") }} -
      <a href="https://twitter.com/quiquelhappy" target="_blank"
        >quiquelhappy</a
      >
    </v-alert>
  </div>
</template>