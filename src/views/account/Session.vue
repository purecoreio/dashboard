<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>
    <v-card class="mb-4">
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field :value="session.owner.name" label="Name" disabled outlined hide-details></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :value="session.owner.surname"
                label="Surname"
                disabled
                outlined
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12">
              <v-text-field
                :value="session.owner.email"
                label="Email"
                disabled
                outlined
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    <v-card class="mb-4">
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                :value="session.location.city"
                label="city"
                disabled
                outlined
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                :value="session.location.state"
                label="state"
                disabled
                outlined
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="4">
              <v-text-field
                :value="session.location.country_code"
                label="country code"
                disabled
                outlined
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    <v-card class="mb-4">
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                :value="session.device.os"
                label="os"
                disabled
                outlined
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :value="session.device.device"
                label="device"
                disabled
                outlined
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :value="session.device.brand"
                placeholder="unknown"
                label="brand"
                disabled
                outlined
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                :value="session.device.model"
                placeholder="unknown"
                label="model"
                disabled
                outlined
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    <v-card>
      <v-form>
        <v-container>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                :value="session.uuid"
                label="session uuid"
                disabled
                outlined
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="8">
              <v-text-field
                :value="session.hash"
                type="password"
                label="hash"
                disabled
                outlined
                hide-details
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
  </div>
</template>


<script>
export default {
  data: () => ({
    location: [
      {
        text: "Settings",
        disabled: true,
        href: ""
      },
      {
        text: "Session",
        disabled: false,
        href: "#"
      }
    ],
    session: null
  }),
  mounted() {
    this.session = JSON.parse(localStorage.getItem("session"));
  }
};
</script>
