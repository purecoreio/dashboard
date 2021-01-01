<template>
  <div>
    <v-row>
      <v-col cols="8">
        <v-text-field
          autofocus
          v-model="number"
          outlined
          :maxlength="maxLength + gaps.length"
          hide-details
          :error="validCard"
          placeholder="4242424242424242"
        >
          <template v-slot:prepend-inner>
            <v-expand-x-transition>
              <div v-show="brand != null">
                <v-img
                  height="24px"
                  width="44px"
                  contain
                  :src="require(`@/assets/gateways/card/${lastBrand}.png`)"
                />
              </div>
            </v-expand-x-transition>
          </template>
        </v-text-field>
      </v-col>
      <v-col cols="4">
        <v-text-field
          v-model="cvc"
          outlined
          hide-details
          :label="codeName"
          :maxlength="codeLength"
          placeholder="123"
        />
      </v-col>
      <v-col cols="8">
        <v-select hide-details :items="months" outlined label="Month" />
      </v-col>
      <v-col cols="4">
        <v-select hide-details :items="years" outlined label="Year" />
      </v-col>
      <v-col cols="12">
        <v-btn @click="pay()" color="primary" depressed block large>
          Start Trial
        </v-btn>
        <center class="mt-3">
          <small class="grey--text"
            >Since this is a recurrent item, your card will be saved for later
            use</small
          >
          <v-divider class="mt-4 mb-2" />
          <v-btn
            @click="pay()"
            class="mt-2"
            color="black"
            depressed
            block
            large
          >
            Google Pay
          </v-btn>
          <v-btn
            @click="pay()"
            class="mt-2"
            color="white"
            light
            depressed
            block
            large
          >
            PayPal
          </v-btn>
        </center>
      </v-col>
    </v-row>
  </div>
</template>
<script>
import { loadStripe } from "@stripe/stripe-js";
import valid from "card-validator";
export default {
  data: () => {
    return {
      stripe: null,
      number: null,
      date: null,
      cvc: null,
      card: null,
      brand: null,
      validCard: false,
      maxLength: 19,
      gaps: [],
      lastBrand: "american-express",
      codeName: "CVC",
      codeLength: 3,
      months: [],
      years: [],
    };
  },
  watch: {
    number(newv) {
      let v = newv.trim().replace(/\s/g, "");
      this.card = valid.number(v);
      if ("card" in this.card && this.card != null && this.card.card != null) {
        this.brand = this.card.card.type;
        if (this.brand != null && this.lastBrand != this.brand) {
          this.lastBrand = this.brand;
        }
        this.codeName = this.card.card.code.name;
        this.codeLength = this.card.card.code.size;
        this.maxLength = this.card.card.lengths[
          this.card.card.lengths.length - 1
        ];
        this.gaps = this.card.card.gaps;
        if (!this.card.card.lengths.includes(v.length)) {
          this.validCard = true;
        } else {
          this.validCard = false;
        }
      } else {
        this.brand = null;
      }

      // gap formatting

      let finalv = v;
      let addedGaps = 0;
      for (let i = 0; i < this.gaps.length; i++) {
        const element = this.gaps[i];
        if (element <= finalv.length) {
          finalv = [
            finalv.slice(0, element + addedGaps),
            " ",
            finalv.slice(element + addedGaps),
          ].join("");
          addedGaps++;
        }
      }
      if (finalv.length > this.maxLength) {
        finalv = String(finalv).substr(0, this.maxLength + this.gaps.length);
      }
      this.number = finalv;
    },
  },
  methods: {
    pay() {
      this.$emit("start");
    },
  },
  mounted() {
    const months = Array.from({ length: 12 }, (e, i) => {
      return (
        String(i + 1) +
        " / " +
        new Date(null, i + 1, null).toLocaleDateString("en", {
          month: "long",
        })
      );
    });

    for (let i = 0; i < 50; i++) {
      const element = new Date().getFullYear() + i;
      this.years.push(element);
    }
    this.months = months;
    let main = this;
    loadStripe(this.$stripeKey).then(function (Stripe) {
      main.stripe = Stripe;
    });
  },
};
</script>