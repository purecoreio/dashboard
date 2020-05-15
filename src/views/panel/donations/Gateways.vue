<template>
  <div>
    <v-dialog v-model="dialog" persistent max-width="300">
      <v-card v-if="selectedGateway!=null">
        <v-card-title class="headline">Unlink {{selectedGateway.name}}</v-card-title>
        <v-card-text>Are you sure about this?</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="selectedGateway=null;dialog=false;">Cancel</v-btn>
          <v-btn
            :loading="deletingGateway"
            depressed
            color="primary"
            text
            @click="unlinkGateway(selectedGateway.name)"
          >Yes</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-overlay :value="overlay">
      <v-btn icon @click="overlay = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-overlay>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert style="text-align: justify" text class="mt-2" color="primary">
      In order to release the public version for paysafe, bitpay and amazon pay I need to register purecore as a company.
      If this project is successful in terms of income, I will register it and release the remaining gateways.
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
      <v-row align="center">
        <v-col v-for="gateway in gateways" :key="gateway.name" cols="6" sm="4" xl="3">
          <v-card hover>
            <v-responsive :aspect-ratio="2.5/1">
              <v-list-item class="mt-4" style="height: 100%">
                <v-list-item-content v-if="$vuetify.breakpoint.smAndUp">
                  <v-list-item-title>{{gateway.name}}</v-list-item-title>
                  <v-list-item-subtitle>{{gateway.website}}</v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-content v-if="$vuetify.breakpoint.xsOnly">
                  <center>
                    <v-img
                      v-if="!$vuetify.theme.dark"
                      width="100"
                      height="40"
                      contain
                      :src="gateway.logo.light"
                    />
                    <v-img
                      width="100"
                      height="40"
                      v-if="$vuetify.theme.dark"
                      contain
                      :src="gateway.logo.dark"
                    />
                  </center>
                </v-list-item-content>
                <v-list-item-action v-if="$vuetify.breakpoint.smAndUp">
                  <v-img
                    v-if="!$vuetify.theme.dark"
                    width="100"
                    height="40"
                    contain
                    :src="gateway.logo.light"
                  />
                  <v-img
                    width="100"
                    height="40"
                    v-if="$vuetify.theme.dark"
                    contain
                    :src="gateway.logo.dark"
                  />
                </v-list-item-action>
              </v-list-item>
            </v-responsive>
            <v-row class="pl-3 pr-3">
              <v-col cols="2" v-if="$vuetify.breakpoint.smAndUp">
                <v-btn target="_blank" icon :href="'https://'+gateway.website">
                  <v-icon>open_in_new</v-icon>
                </v-btn>
              </v-col>
              <v-col
                v-if="gateway.available"
                :align="$vuetify.breakpoint.xsOnly ? 'center' : 'right'"
                cols="12"
                sm="10"
              >
                <v-btn
                  @click="handleAction(gateway)"
                  :block="$vuetify.breakpoint.xsOnly"
                  :loading="gateway.linked==null"
                  depressed
                >
                  <template v-if="!gateway.linked">Link</template>
                  <template v-if="gateway.linked">Unlink</template>
                </v-btn>
              </v-col>
              <v-col
                v-if="!gateway.available"
                :align="$vuetify.breakpoint.xsOnly ? 'center' : 'right'"
                cols="12"
                sm="10"
              >
                <v-btn :block="$vuetify.breakpoint.xsOnly" depressed>Planned</v-btn>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
        <v-col cols="6" sm="4" xl="3">
          <v-card
            color="transparent"
            target="_blank"
            href="https://forms.gle/YfAq92CaoKGtApEF7"
            ripple
            elevation="0"
          >
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
import core from "purecore";

export default {
  name: "DonationsGateways",
  methods: {
    updateGateways: function() {
      let main = this;

      for (const key in main.gateways) {
        main.gateways[key].linked = null;
      }

      this.network
        .getStore()
        .getGateways()
        .then(function(data) {
          for (const key in main.gateways) {
            main.gateways[key].linked = false;
          }

          data.forEach(gateway => {
            for (const key in main.gateways) {
              const element = main.gateways[key];
              if (element.name == gateway.name) {
                main.gateways[key].linked = true;
              }
            }
          });
        });
    },
    unlinkGateway(name) {
      let main = this;
      main.deletingGateway = true;
      this.network
        .getStore()
        .unlinkGateway(name)
        .then(function() {
          main.deletingGateway = false;
          main.dialog = false;
          main.updateGateways();
        })
        .catch(function() {
          main.deletingGateway = false;
          main.updateGateways();
        });
    },
    handleAction: function(gateway) {
      if (gateway.name == "Stripe") {
        if (gateway.linked == null || gateway.linked == false) {
          this.openWindow(this.network.getStore().getStripeWalletLink());
        } else {
          this.selectedGateway = gateway;
          this.dialog = true;
        }
      } else if (gateway.name == "PayPal") {
        if (gateway.linked == null || gateway.linked == false) {
          this.openWindow(this.network.getStore().getPayPalWalletLink());
        } else {
          this.selectedGateway = gateway;
          this.dialog = true;
        }
      }
    },
    openWindow: function(
      url,
      title = "gateway oauth",
      win = window,
      w = 400,
      h = 700
    ) {
      let mainObj = this;
      mainObj.overlay = true;
      const y = win.top.outerHeight / 2 + win.top.screenY - h / 2;
      const x = win.top.outerWidth / 2 + win.top.screenX - w / 2;
      var size = " width=" + w + ", height=" + h + ", top=" + y + ", left=" + x;
      var extraProps =
        "toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no,";
      var newWin = win.open(url, title, extraProps + size);

      var timer = setInterval(function() {
        if (newWin.closed) {
          clearInterval(timer);
          mainObj.overlay = false;
        }
      }, 200);
    }
  },
  watch: {
    overlay: function() {
      this.updateGateways();
    },
    network: function() {
      this.updateGateways();
    }
  },
  mounted() {
    var coreInstance = new core(JSON.parse(localStorage.session));
    this.network = coreInstance.getInstance(localStorage.network).asNetwork();
  },
  data: () => ({
    overlay: null,
    network: null,
    dialog: false,
    selectedGateway: null,
    deletingGateway: false,
    gateways: [
      {
        name: "Stripe",
        website: "stripe.com",
        available: true,
        linked: null,
        logo: {
          light: "https://purecore.io/dashboard/assets/gateways/stripe.svg",
          dark: "https://purecore.io/dashboard/assets/gateways/stripeDark.svg"
        }
      },
      {
        name: "PayPal",
        website: "paypal.com",
        available: true,
        linked: null,
        logo: {
          light: "https://purecore.io/dashboard/assets/gateways/paypal.svg",
          dark: "https://purecore.io/dashboard/assets/gateways/paypalDark.svg"
        }
      },
      {
        name: "Paymentwall",
        website: "paymentwall.com",
        available: false,
        linked: null,
        logo: {
          light:
            "https://purecore.io/dashboard/assets/gateways/paymentwall.svg",
          dark:
            "https://purecore.io/dashboard/assets/gateways/paymentwallDark.svg"
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