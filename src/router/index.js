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
        path: "settings",
        component: () => {
          return import('../views/network/selected/settings/Settings.vue')
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
