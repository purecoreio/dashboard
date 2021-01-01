<template>
  <v-tooltip color="pink" max-width="300px" bottom>
    <template v-slot:activator="{ on }">
      <v-btn color="pink accent-2" icon v-on="on">
        <v-icon>science</v-icon>
      </v-btn>
    </template>
    This is an experimental feature. You have been selected to be part as the
    public beta. Please, click here to provide feedback
  </v-tooltip>
</template>