import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: "/network"
  },
  {
    path: '/login',
    name: 'login',
    component: () => {
      return import('../views/Login.vue')
    }
  },
  {
    path: '/network',
    name: 'noNetwork',
    component: () => {
      return import('../views/network/unselected/Unselected.vue')
    },
    children: [
      {
        path: "",
        component: () => {
          return import('../views/network/unselected/Select.vue')
        }
      },
      {
        path: "create",
        component: () => {
          return import('../views/network/unselected/Create.vue')
        }
      },
    ]
  },
  {
    path: '/network/:id',
    name: 'network',
    component: () => {
      return import('../views/network/selected/Network.vue')
    },
    redirect: (to) => { return `/network/${to.params.id}/instance` },
    children: [
      {
        path: "instance",
        component: () => {
          return import('../views/network/selected/instance/Instance.vue')
        }
      },
      {
        path: "instance/:instance",
        component: () => {
          return import('../views/network/selected/Wrapper.vue')
        },
        redirect: (to) => { return `/network/${to.params.id}/instance/${to.params.instance}/settings` },
        children: [
          {
            path: "settings",
            component: () => {
              return import('../views/network/selected/instance/view/Settings.vue')
            }
          },
          {
            path: "players",
            component: () => {
              return import('../views/network/selected/instance/view/Players.vue')
            }
          },
          {
            path: "performance",
            component: () => {
              return import('../views/network/selected/instance/view/Performance.vue')
            }
          },
          {
            path: "console",
            component: () => {
              return import('../views/network/selected/instance/view/Console.vue')
            }
          },
        ]
      },
      {
        path: "settings",
        component: () => {
          return import('../views/network/selected/Wrapper.vue')
        },
        redirect: (to) => { return `/network/${to.params.id}/settings/identity` },
        children: [
          {
            path: "identity",
            name: "Identity",
            component: () => {
              return import('../views/network/selected/settings/Identity.vue')
            }
          },
          {
            path: "dangerzone",
            name: "Danger Zone",
            component: () => {
              return import('../views/network/selected/settings/DangerZone.vue')
            }
          },
        ]
      },
      {
        path: "store",
        component: () => {
          return import('../views/network/selected/Wrapper.vue')
        },
        redirect: (to) => { return `/network/${to.params.id}/store/package` },
        children: [
          {
            path: "package",
            name: "packages",
            meta: {
              beta: true
            },
            component: () => {
              return import('../views/network/selected/store/Package.vue')
            }
          },
          {
            path: "gateway",
            name: "gateways",
            component: () => {
              return import('../views/network/selected/store/Gateway.vue')
            }
          },
        ]
      },
      {
        path: "/:catchAll(.*)",
        component: () => {
          return import('../views/errors/UnderDevelopment.vue')
        }
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
