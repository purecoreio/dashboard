<template>
  <v-card :disabled="available.count<=0" style="overflow:hidden">
    <v-fade-transition>
      <div v-show="nocompare" class="pa-2">
        <v-list-item>
          <v-list-item-content>
            <b>Game</b>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip>
              <v-avatar class="mr-1" tile>
                <v-img src="https://lutris.net/media/games/icons/minecraft-launcher_5zwVHLz.png" />
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
              {{available.template.memory/1073741824}}GB
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
              {{available.template.size/1073741824}}GB
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
              {{available.template.cores}}
            </v-chip>
          </v-list-item-action>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <b>CPU</b>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip>
              <v-icon class="mr-1" small>memory</v-icon>
              <span>{{available.machine.cpu.brand.replace(" 8-Core Processor","")}}</span>
            </v-chip>
          </v-list-item-action>
        </v-list-item>
        <!--
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
        -->
      </div>
    </v-fade-transition>
    <v-fade-transition>
      <div v-show="compare" class="pa-2">
        <v-list-item>
          <v-list-item-content>
            <b>Memory</b>
          </v-list-item-content>
          <v-list-item-action>
            <v-chip>
              <v-icon class="mr-1" small>storage</v-icon>
              {{available.template.memory/1073741824}}GB
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
              href="https://billing.pebblehost.com/cart.php?a=confproduct&i=1"
              target="_blank"
              block
            >pebblehost</v-btn>
          </v-list-item-action>
        </v-list-item>
        <v-text-field
          type="number"
          v-model="price"
          append-icon="euro"
          label="compare price (in eur)"
          hint="spoiler: purecore is better"
          outlined
          single-line
        ></v-text-field>
        <v-alert :value="price!=null" transition="scale-transition" text color="primary">
          <span
            v-if="(price-(available.template.price))*12>0"
          >{{Math.round((price-(available.template.price))*12*100)/100}}€ of yearly savings</span>
          <span v-if="(price-(available.template.price))*12<=0">No savings using purecore</span>
        </v-alert>
      </div>
    </v-fade-transition>
    <v-tooltip bottom color="primary">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          :to="`/hosting/checkout/${available.template.uuid}/${available.machine.uuid}`"
          v-bind="attrs"
          v-on="on"
          x-large
          tile
          depressed
          block
        >add ({{available.template.price}}€/Mo)</v-btn>
      </template>
      <span>{{available.count}} available</span>
    </v-tooltip>
  </v-card>
</template>

<script>
export default {
  props: ["available", "price", "nocompare", "compare"],
};
</script>