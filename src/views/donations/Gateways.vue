<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert style="text-align: justify" text class="mt-2" color="primary">
      In order to release the public version for both paysafe and bitpay, I need to register purecore as a company.
      If this project is successful in terms of income, I will register it and release the remaining gateways
      <div>
        <v-divider class="mt-4 mb-4" />
        <v-btn
          class="float-right"
          depressed
          dark
          color="black"
          target="_blank"
          href="https://www.buymeacoffee.com/happy"
        >
          <v-img
            class="mr-2"
            width="20px"
            src="https://cdn.buymeacoffee.com/buttons/bmc-new-btn-logo.svg"
          />Buy me a coffee
        </v-btn>
      </div>
    </v-alert>
    <div>
      <v-row>
        <v-col v-for="gateway in gateways" :key="gateway.name" cols="6" sm="4" xl="3">
          <v-card ripple hover>
            <v-responsive :aspect-ratio="2.5/1">
              <v-list-item class="mt-4" style="height: 100%">
                <v-list-item-content>
                  <v-list-item-title>{{gateway.name}}</v-list-item-title>
                  <v-list-item-subtitle>{{gateway.website}}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-img v-if="!$vuetify.theme.dark" width="100" contain :src="gateway.logo.light" />
                  <v-img v-if="$vuetify.theme.dark" width="100" contain :src="gateway.logo.dark" />
                </v-list-item-action>
              </v-list-item>
            </v-responsive>
            <v-row class="pl-3 pr-3">
              <v-col cols="2">
                <v-btn target="_blank" icon :href="'https://'+gateway.website">
                  <v-icon>open_in_new</v-icon>
                </v-btn>
              </v-col>
              <v-col
                v-if="gateway.available.linked==null&&gateway.available"
                align="right"
                cols="10"
              >
                <v-btn loading depressed>Unlinked</v-btn>
              </v-col>
              <v-col
                v-if="gateway.available.linked==false&&gateway.available"
                align="right"
                cols="10"
              >
                <v-btn color="primary" depressed>Link</v-btn>
              </v-col>
              <v-col
                v-if="gateway.available.linked==true&&gateway.available"
                align="right"
                cols="10"
              >
                <v-btn color="primary" depressed>Unlink</v-btn>
              </v-col>
              <v-col v-if="!gateway.available" align="right" cols="10">
                <v-btn depressed>Planned</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-spacer />
        <v-col cols="6" sm="4" xl="3">
          <v-card target="_blank" href="https://forms.gle/YfAq92CaoKGtApEF7" ripple elevation="0">
            <div style="height: 150px">
              <v-list-item style="height: 100%">
                <v-list-item-content>
                  <v-list-item-title>Suggest</v-list-item-title>
                  <v-list-item-subtitle>Suggest a gateway</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon>add</v-icon>
                </v-list-item-action>
              </v-list-item>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </div>
  </div>
</template>


<script>
export default {
  name: "DonationsGateways",
  data: () => ({
    gateways: [
      {
        name: "Stripe",
        website: "stripe.com",
        available: true,
        loading: true,
        linked: null,
        logo: {
          light: "../assets/gateways/stripe.svg",
          dark: "../assets/gateways/stripeDark.svg"
        }
      },
      {
        name: "PayPal",
        website: "paypal.com",
        available: true,
        linked: null,
        logo: {
          light: "../assets/gateways/paypal.svg",
          dark: "../assets/gateways/paypalDark.svg"
        }
      },
      {
        name: "Paysafe",
        website: "paysafe.com",
        available: false,
        linked: null,
        logo: {
          light: "../assets/gateways/paysafe.svg",
          dark: "../assets/gateways/paysafeDark.svg"
        }
      },
      {
        name: "BitPay",
        website: "bitpay.com",
        available: false,
        linked: null,
        logo: {
          light: "../assets/gateways/bitpay.svg",
          dark: "../assets/gateways/bitpayDark.svg"
        }
      }
    ],
    location: [
      {
        text: "Donations",
        disabled: true,
        href: ""
      },
      {
        text: "Gateways",
        disabled: false,
        href: "#"
      }
    ]
  })
};
</script>