<template>
  <div>
    <v-snackbar color="red" app v-model="snackbar">
      {{ snackbarText }}
    </v-snackbar>
    <v-expand-transition>
      <v-card
        v-show="show"
        v-ripple="!reading"
        style="overflow: hidden"
        color="blue accent-3"
        outlined
        class="mb-4"
      >
        <v-fade-transition>
          <div
            v-show="!reading"
            class="fade-in"
            style="
              position: absolute;
              width: 100%;
              height: 100%;
              left: 0px;
              top: 0px;
              filter: grayscale(1);
              opacity: 0.2;
            "
          >
            <particles-bg v-if="showParticles" type="thick" />
          </div>
        </v-fade-transition>
        <div @click="reading = true" class="plusFade pt-4 pb-4 pl-8 pr-8">
          <v-row align="center">
            <v-col>
              <p class="ma-0 white--text" style="font-size: 120%">
                purecore<span class="plus"> plus</span>
              </p>
              <p class="ma-0 white--text">
                {{ $t("getTheMostOutOfYourNetwork") }}
              </p>
            </v-col>
            <v-col class="text-right">
              <v-fade-transition>
                <div v-show="defaultView">
                  <span
                    v-if="trialStatus == null || trialStatus == 0"
                    class="white--text overline ma-0 pa-0"
                    >free <b>7-DAY</b> trial</span
                  >
                  <span
                    v-if="trialStatus != null && trialStatus != 0"
                    class="white--text overline ma-0 pa-0"
                    >9.99€/<b>MO</b>
                  </span>
                </div>
              </v-fade-transition>
              <v-fade-transition>
                <span v-show="thank" class="white--text overline ma-0 pa-0"
                  >thank you so much <v-icon>favorite</v-icon></span
                >
              </v-fade-transition>
            </v-col>
          </v-row>
        </div>
        <v-expand-transition>
          <v-card tile v-show="reading">
            <v-stepper class="elevation-0 transparent pa-0" v-model="e1">
              <v-stepper-items class="pa-0">
                <v-stepper-content step="1">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        hide-details
                        outlined
                        placeholder="Full Name"
                        v-model="address.name"
                        :disabled="settingAddress"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="address.email"
                        hide-details
                        outlined
                        :disabled="settingAddress"
                        placeholder="Email"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-divider />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="address.country"
                        :items="possible"
                        :disabled="settingAddress"
                        item-text="countryName"
                        item-value="countryShortCode"
                        hide-details
                        :label="$t('country')"
                        outlined
                        @change="updateRegions"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        :items="availableRegions"
                        :disabled="address.country == null || settingAddress"
                        v-model="address.state"
                        item-text="name"
                        item-value="name"
                        hide-details
                        :label="$t('province')"
                        outlined
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        autofocus
                        hide-details
                        outlined
                        :disabled="settingAddress"
                        v-model="address.city"
                        :placeholder="$t('city')"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        hide-details
                        outlined
                        :disabled="settingAddress"
                        v-model="address.postalcode"
                        :placeholder="$t('postCode')"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="address.line1"
                        hide-details
                        :disabled="settingAddress"
                        outlined
                        :placeholder="$t('line1')"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="address.line2"
                        hide-details
                        :disabled="settingAddress"
                        outlined
                        :placeholder="$t('line2')"
                      />
                    </v-col>
                  </v-row>
                  <v-row align="center" class="mt-4 mb-3" no-gutters>
                    <v-col>
                      <v-btn icon @click="reading = false">
                        <v-icon> close </v-icon>
                      </v-btn>
                    </v-col>
                    <v-col class="text-right">
                      <secure />
                      <v-btn
                        class="ml-2"
                        :disabled="settingAddress"
                        :loading="settingAddress"
                        color="primary"
                        depressed
                        @click="updateAddress()"
                      >
                        {{ $t("next") }}
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-stepper-content>

                <v-stepper-content step="2">
                  <v-row no-gutters align="center">
                    <v-col cols="12" lg="6">
                      <v-row align="center" no-gutters>
                        <v-col class="flex-shrink-1 flex-grow-0">
                          <v-btn icon @click="e1 = 1" text>
                            <v-icon> keyboard_backspace </v-icon>
                          </v-btn>
                        </v-col>
                        <v-col class="text-center flex-shrink-0 flex-grow-1">
                          <p class="ma-0">
                            <span v-if="trialStatus == null || trialStatus == 0"
                              >free <b>7-day</b> trial, then </span
                            ><b>9.99€/mo</b>
                          </p>
                        </v-col>
                        <v-col class="flex-shrink-1 flex-grow-0">
                          <v-btn
                            icon
                            style="visibility: hidden"
                            @click="e1 = 1"
                            text
                          >
                            <v-icon> keyboard_backspace </v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                      <credit-card
                        :billing="address"
                        v-if="e1 == 2"
                        @start="startev"
                      />
                    </v-col>
                    <v-col v-if="$vuetify.breakpoint.lgAndUp" cols="12" lg="6">
                      <center>
                        <h4 style="max-width: 200px" class="mb-2">
                          {{ $t("thanksForMakingPurecoreBetter") }}
                        </h4>
                        <v-icon>favorite</v-icon>
                      </center>
                    </v-col>
                  </v-row>
                </v-stepper-content>
              </v-stepper-items>
            </v-stepper>
          </v-card>
        </v-expand-transition>
      </v-card>
    </v-expand-transition>
  </div>
</template>
<style lang="css" scoped>
.fade-in {
  opacity: 1;
  animation-name: fadeInOpacity;
  animation-iteration-count: 1;
  animation-timing-function: ease-in;
  animation-duration: 2s;
}

@keyframes fadeInOpacity {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.2;
  }
}
</style>
<script>
import { ParticlesBg } from "particles-bg-vue";
import CreditCard from "./Card";
import countryData from "country-region-data";

export default {
  components: {
    ParticlesBg,
    CreditCard,
  },
  watch: {
    reading(newv) {
      if (newv) {
        let main = this;
        main.settingAddress = true;
        this.$purecore
          .getPlayer()
          .getBilling()
          .getBillingAddress()
          .then((address) => {
            let addressObj = address.asObject();
            for (const key in addressObj) {
              if (Object.hasOwnProperty.call(addressObj, key)) {
                const element = addressObj[key];
                if (key in main.address) {
                  main.address[key] = element;
                  if (key == "country") {
                    main.updateRegions();
                  }
                }
              }
            }
          })
          .finally(() => {
            main.settingAddress = false;
          });
      }
    },
  },
  data: () => {
    return {
      context: null,
      trialStatus: 0,
      shown: false,
      plusStatus: null,
      settingAddress: false,
      show: false,
      reading: false,
      showParticles: false,
      e1: 1,
      stripe: null,
      card: null,
      defaultView: true,
      thank: false,
      possible: countryData,
      availableRegions: [],
      snackbar: false,
      snackbarText: "",
      address: {
        name: null,
        email: null,
        country: null,
        state: null,
        city: null,
        postalcode: null,
        line1: null,
        line2: null,
      },
    };
  },
  methods: {
    error(err) {
      this.snackbar = true;
      this.snackbarText = err;
    },
    updateAddress: function () {
      let main = this;
      main.settingAddress = true;
      this.$purecore
        .getPlayer()
        .getBilling()
        .setBillingAddress(this.address)
        .then(() => {
          main.e1 = 2;
        })
        .catch((err) => {
          main.error(err.message);
        })
        .finally(() => {
          main.settingAddress = false;
        });
    },
    updateRegions: function () {
      this.address.availableRegions = [];
      for (let i = 0; i < this.possible.length; i++) {
        const element = this.possible[i];
        if (element.countryShortCode == this.address.country) {
          this.availableRegions = element.regions;
          break;
        }
      }
    },
    startev() {
      this.reading = false;
      this.defaultView = false;
      setTimeout(() => {
        this.thank = true;
      }, 400);
      setTimeout(() => {
        this.show = false;
      }, 10000);
    },
  },
  mounted() {
    this.shown = false;
    this.context = this.$purecore.getContext();
    if (this.context.subscriptionStatus != null) {
      this.plusStatus = Number(this.context.subscriptionStatus.plus);
      this.trialStatus = Number(this.context.subscriptionStatus.usedTrial);

      if (!this.shown) {
        this.shown = true;
        if (this.plusStatus != null && this.plusStatus != 1) {
          this.show = true;
        }
        setTimeout(() => {
          this.showParticles = true;
        }, 500);
      }
    } else {
      setInterval(() => {
        if (this.context.subscriptionStatus != null) {
          this.plusStatus = Number(this.context.subscriptionStatus.plus);
          this.trialStatus = Number(this.context.subscriptionStatus.usedTrial);

          if (!this.shown) {
            this.shown = true;
            if (this.plusStatus != null && this.plusStatus != 1) {
              this.show = true;
            }
            setTimeout(() => {
              this.showParticles = true;
            }, 500);
          }
        }
      }, 100);
    }
  },
};
</script>