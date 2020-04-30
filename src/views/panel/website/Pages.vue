<template>
  <div>
    <v-breadcrumbs :items="location" large>
      <template v-slot:divider>
        <v-icon>mdi-chevron-right</v-icon>
      </template>
    </v-breadcrumbs>
    <v-alert color="primary" text>This feature is still under development.</v-alert>
    <v-row>
      <v-col cols="12" md="4">
        <v-card class="mx-auto">
          <v-list>
            <v-list-item>
              <v-list-item-icon>
                <v-icon>mdi-home</v-icon>
              </v-list-item-icon>

              <v-list-item-title>Home</v-list-item-title>
            </v-list-item>

            <v-list-group prepend-icon="account_circle" value="true">
              <template v-slot:activator>
                <v-list-item-title>Users</v-list-item-title>
              </template>

              <v-list-group no-action sub-group value="true">
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>Admin</v-list-item-title>
                  </v-list-item-content>
                </template>

                <v-list-item v-for="(admin, i) in admins" :key="i" link>
                  <v-list-item-title v-text="admin[0]"></v-list-item-title>
                  <v-list-item-icon>
                    <v-icon v-text="admin[1]"></v-icon>
                  </v-list-item-icon>
                </v-list-item>
              </v-list-group>

              <v-list-group sub-group no-action>
                <template v-slot:activator>
                  <v-list-item-content>
                    <v-list-item-title>Actions</v-list-item-title>
                  </v-list-item-content>
                </template>
                <v-list-item v-for="(crud, i) in cruds" :key="i">
                  <v-list-item-title v-text="crud[0]"></v-list-item-title>
                  <v-list-item-action>
                    <v-icon v-text="crud[1]"></v-icon>
                  </v-list-item-action>
                </v-list-item>
              </v-list-group>
            </v-list-group>
          </v-list>
        </v-card>
      </v-col>
      <v-col cols="12" md="8">
        <v-tabs fixed-tabs class="ma-0">
          <v-tab>
            <span>HTML</span>
          </v-tab>
          <v-tab>
            <span>JS</span>
          </v-tab>
          <v-tab>
            <span>CSS</span>
          </v-tab>

          <v-tab-item>
            <codemirror :options="templateOptions" />
          </v-tab-item>
          <v-tab-item>
            <codemirror :options="jsOptions" />
          </v-tab-item>
          <v-tab-item>
            <codemirror :options="cssOptions" />
          </v-tab-item>
        </v-tabs>
      </v-col>
    </v-row>
  </div>
</template>


<script>
export default {
  name: "WebsitePages",
  data: () => ({
    location: [
      {
        text: "Website",
        disabled: true,
        href: ""
      },
      {
        text: "Pages",
        disabled: false,
        href: "#"
      }
    ],
    admins: [
      ["Management", "people_outline"],
      ["Settings", "settings"]
    ],
    cruds: [
      ["Create", "add"],
      ["Read", "insert_drive_file"],
      ["Update", "update"],
      ["Delete", "delete"]
    ],
    templateOptions: {
      mode: "text/html"
    },
    jsOptions: {
      mode: "text/javascript"
    },
    cssOptions: {
      mode: "text/css"
    }
  })
};
</script>
