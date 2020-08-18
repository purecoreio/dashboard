<template>
  <div>
    <v-card
      class="pa-6 backgroundGradient pt-10"
      style="padding-bottom:50px!important;padding-top:50px!important"
    >
      <v-row align="center">
        <v-col v-if="$vuetify.breakpoint.mdAndUp" class="flex-grow-0 flex-shrink-1">
          <v-img v-if="!$vuetify.theme.dark" width="150px" src="@/assets/oem/rizentextblack.svg" />
          <v-img v-if="$vuetify.theme.dark" width="150px" src="@/assets/oem/rizentext.svg" />
        </v-col>
        <v-col class="flex-grow-1 flex-shrink-0">
          <h2>
            High performance
            <span class="textGradient">dedicated</span> cores
          </h2>
          <h4 style="opacity:0.5">As cheap as low performance shared cores</h4>
        </v-col>
      </v-row>
    </v-card>
    <v-row align="center">
      <v-col class="flex-grow-1 flex-shrink-0"></v-col>
      <v-col class="flex-grow-0 flex-shrink-1">
        <v-switch :disabled="!nocompare != compare" label="compare" @change="comparepricing()"></v-switch>
      </v-col>
    </v-row>
    <v-alert
      :value="compare"
      transition="scale-transition"
      text
      color="primary"
    >We are not afraid of showing our competitors, because we know we are better</v-alert>
    <v-row>
      <v-col v-for="i in 9" :key="i" cols="12" md="4" xl="3">
        <v-card style="overflow:hidden">
          <v-expand-transition>
            <div v-show="nocompare" class="pa-2">
              <v-list-item>
                <v-list-item-content>
                  <b>Game</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip>
                    <v-avatar class="mr-1" tile>
                      <v-img
                        src="https://lutris.net/media/games/icons/minecraft-launcher_5zwVHLz.png"
                      />
                    </v-avatar>Minecraft Java
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Memory</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip>
                    <v-icon class="mr-1" small>storage</v-icon>
                    {{(i+1)*2}}GB
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Size</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip>
                    <v-icon class="mr-1" small>save</v-icon>
                    {{Math.round((((i+1)*2*1000-250)/64)/10)*10}}GB
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Dedicated Cores</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip>
                    <v-icon class="mr-1" small>check_box_outline_blank</v-icon>
                    {{ (i+1)*2==4 ? 1 : 2}}
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>CPU</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip>
                    <v-icon class="mr-1" small>memory</v-icon>AMD Ryzen 7 3700X
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Machine</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip>
                    <v-icon class="mr-1" small>launch</v-icon>components
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
            </div>
          </v-expand-transition>
          <v-expand-transition>
            <div v-show="compare" class="pa-2">
              <v-list-item>
                <v-list-item-content>
                  <b>Memory</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-chip>
                    <v-icon class="mr-1" small>storage</v-icon>
                    {{(i+1)*2}}GB
                  </v-chip>
                </v-list-item-action>
              </v-list-item>
              <v-divider />
              <v-list-item>
                <v-list-item-content>
                  <b>Compare</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    text
                    href="https://clients.mcprohosting.com/cart.php?gid=34"
                    target="_blank"
                    block
                  >mcprohosting</v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Compare</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    text
                    href="https://shockbyte.com/minecraft-hosting"
                    target="_blank"
                    block
                  >shockbite</v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Compare</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    text
                    href="https://www.hostinger.com/minecraft-server-hosting"
                    target="_blank"
                    block
                  >hostinger</v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <b>Compare</b>
                </v-list-item-content>
                <v-list-item-action>
                  <v-btn
                    text
                    href="https://pebblehost.com/minecraft#premium"
                    target="_blank"
                    block
                  >pebblehost</v-btn>
                </v-list-item-action>
              </v-list-item>
              <v-text-field
                type="number"
                v-model="price"
                label="compare price (in eur)"
                hint="spoiler: purecore is better"
                outlined
                single-line
              ></v-text-field>
              <v-alert :value="price!=null" transition="scale-transition" text color="primary">
                <span
                  v-if="(price-(Math.round((((i+1)*2)/64)*87)+0.99))*12>0"
                >{{Math.round((price-(Math.round((((i+1)*2)/64)*87)+0.99))*12*100)/100}}€ of yearly savings</span>
                <span
                  v-if="(price-(Math.round((((i+1)*2)/64)*87)+0.99))*12<=0"
                >No savings using purecore</span>
              </v-alert>
            </div>
          </v-expand-transition>
          <v-btn x-large tile depressed block>add ({{Math.round((((i+1)*2)/64)*87)+0.99}}€/Mo)</v-btn>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>
<style lang="css" scoped>
.backgroundGradient {
  background: linear-gradient(
    90deg,
    rgba(87, 160, 255, 0.2) 0%,
    rgba(87, 160, 255, 0) 39%
  );
}
.textGradient {
  text-align: center;

  background: linear-gradient(
    60deg,
    #b0ceff 20%,
    #4a98ff 40%,
    #4a98ff 60%,
    #b0ceff 80%
  );
  background-size: 200% auto;

  color: #000;
  background-clip: text;
  text-fill-color: transparent;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  animation: shine 2s linear infinite;
}
@keyframes shine {
  to {
    background-position: 200% center;
  }
}
</style>
<script>
export default {
  methods: {
    comparepricing() {
      if (this.compare) {
        this.compare = false;
        setTimeout(() => {
          this.nocompare = true;
        }, 500);
      } else {
        this.nocompare = false;
        setTimeout(() => {
          this.compare = true;
        }, 500);
      }
    },
  },
  mounted() {},
  data: () => {
    return {
      nocompare: true,
      compare: false,
      price: null,
    };
  },
};
</script>