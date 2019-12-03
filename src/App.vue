<template>
  <v-app id="sandbox">
    <v-navigation-drawer
      v-model="primaryDrawer.model"
      :clipped="primaryDrawer.clipped"
      :floating="primaryDrawer.floating"
      :mini-variant="primaryDrawer.mini"
      permanent="primaryDrawer.type === 'permanent'"
      :temporary="primaryDrawer.type === 'temporary'"
      expand-on-hover
      app
      overflow
    >
      <v-list-item>
        <v-list-item-content>
          <center>
            <v-list-item-title class="title">
              Pure Vanilla
              <v-btn small color="primary" outlined text icon>
                <v-icon>compare_arrows</v-icon>
              </v-btn>
            </v-list-item-title>
            <v-list-item-subtitle>play.purevanilla.es</v-list-item-subtitle>
          </center>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>

      <v-list shaped>
        <v-list-group
          v-for="item in items"
          :key="item.action"
          v-model="item.active"
          :prepend-icon="item.icon"
          no-action
        >
          <template v-slot:activator>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </template>

          <v-list-item link :to="subItem.path" v-for="subItem in item.items" :key="subItem.title">
            <v-list-item-content>
              <v-list-item-title v-text="subItem.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :clipped-left="primaryDrawer.clipped" app>
      <v-app-bar-nav-icon
        v-if="primaryDrawer.type !== 'permanent'"
        @click.stop="primaryDrawer.model = !primaryDrawer.model"
      />
      <v-toolbar-title>purecore</v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" xs="12" sm="12" md="10" lg="8" xl="6">
            <router-view></router-view>
          </v-col>
        </v-row>
      </v-container>
    </v-content>

    <v-footer :inset="footer.inset" app>
      <span class="px-4">&copy; 2019-{{ new Date().getFullYear() }} quiquelhappy</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: "App",

  data: () => ({
    drawers: ["Default (no property)", "Permanent", "Temporary"],
    primaryDrawer: {
      model: null,
      type: "default (no property)",
      clipped: true,
      floating: true,
      mini: false
    },
    footer: {
      inset: false
    },
    items: [
      {
        action: "summary",
        title: "Summary",
        icon: "dashboard",
        active: true,
        items: [
          {
            title: "General View",
            path: "/summary/general"
          },
          { title: "Instance View", path: "/summary/instance" }
        ]
      },
      {
        action: "players",
        title: "Players",
        icon: "supervisor_account",
        items: [
          { title: "Lookup", path: "/players/lookup" },
          { title: "Filtered", path: "/players/filtered" }
        ]
      },
      {
        action: "analytics",
        title: "Analytics",
        icon: "bar_chart",
        items: [
          { title: "General Stats", path: "/analytics/general" },
          { title: "Instance Growth", path: "/analytics/growth" },
          { title: "Game Stats", path: "/analytics/game" },
          { title: "Feedback", path: "/analytics/feedback" }
        ]
      },
      {
        action: "servers",
        title: "Servers",
        icon: "view_list",
        items: [
          { title: "List", path: "/servers/list" },
          { title: "Create", path: "/servers/create" }
        ]
      },
      {
        action: "donations",
        title: "Donations",
        icon: "store",
        items: [
          { title: "Transactions", path: "/donations/transactions" },
          { title: "Packages", path: "/donations/packages" },
          { title: "Perks", path: "/donations/perks" },
          { title: "Interested Users", path: "/donations/interested" },
          { title: "Refunds", path: "/donations/refunds" }
        ]
      },
      {
        action: "forum",
        title: "Forum",
        icon: "chat_bubble",
        items: [
          { title: "News", path: "/forum/news" },
          { title: "Sections", path: "/forum/sections" },
          { title: "Threads", path: "/forum/threads" },
          { title: "Actions", path: "/forum/actions" },
          { title: "Badges", path: "/forum/badges" }
        ]
      },
      {
        action: "punishments",
        title: "Punishments",
        icon: "gavel",
        items: [
          { title: "Offences", path: "/punishments/offences" },
          { title: "Actions", path: "/punishments/actions" },
          { title: "Create", path: "/punishments/create" },
          { title: "Appeals", path: "/punishments/appeals" },
          { title: "Reports", path: "/punishments/reports" }
        ]
      },
      {
        action: "billing",
        title: "Billing",
        icon: "attach_money",
        items: [{ title: "Invoices", path: "/billing/invoices" }]
      },
      {
        action: "website",
        title: "Website",
        icon: "dvr",
        items: [
          { title: "Domain", path: "/website/domain" },
          { title: "Themes", path: "/website/themes" },
          { title: "Pages", path: "/website/pages" }
        ]
      }
    ]
  })
};
</script>
