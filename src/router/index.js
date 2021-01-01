import Vue from 'vue'
import VueRouter from 'vue-router'

import Transactions from '../views/network/donations/Transactions'
import Packages from '../views/network/donations/Packages'
import Gateways from '../views/network/donations/Gateways'
import Tax from '../views/network/donations/TaxReporting'
import Discounts from '../views/network/donations/Discounts'
import Targets from '../views/network/donations/Targets'

import ServerList from '../views/network/servers/List'
import ServerSetup from '../views/network/servers/Setup'

import Billing from '../views/profile/Billing'
import Machines from '../views/profile/Machines'
import Plan from '../views/profile/Plan'
import VotingSites from '../views/profile/VotingSites'

import instanceConsole from '../views/network/instance/Console'
import instanceImage from '../views/network/instance/Image'
import instanceSetup from '../views/network/instance/Setup'
import instanceHealth from '../views/network/instance/Health'

import dangerZone from '../views/network/settings/DangerZone'

//import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [

  {
    path: '/',
    redirect: '/select',
  },
  {
    path: '/select',
    name: 'select project',
    component: () => import('@/views/project/Select.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/Login.vue')
  },
  {
    path: '/setup',
    name: 'setup',
    component: () => import('@/views/project/Setup.vue')
  },
  {
    path: '/account/',
    name: 'account',
    component: () => import('@/views/profile/Profile.vue'),
    redirect: '/account/plan',
    children: [
      {
        path: '/account/plan',
        component: Plan,
      },
      {
        path: '/account/billing',
        component: Billing,
      },
      {
        path: '/account/machines',
        component: Machines,
      },
      {
        path: '/account/votingsites',
        component: VotingSites,
      },
    ]
  },
  {
    path: '/network/servers',
    name: 'servers',
    component: () => import('@/views/network/Servers.vue'),
    redirect: '/network/servers/list',
    children: [
      {
        path: '/network/servers/list',
        component: ServerList,
      },
      {
        path: '/network/servers/wizard',
        component: ServerSetup,
      },
    ]
  },
  {
    path: '/network/donations',
    name: 'donations',
    component: () => import('@/views/network/Donations.vue'),
    redirect: '/network/donations/transactions',
    children: [
      {
        path: '/network/donations/transactions',
        component: Transactions,
      },
      {
        path: '/network/donations/packages',
        component: Packages,
      },
      {
        path: '/network/donations/gateways',
        component: Gateways,
      },
      {
        path: '/network/donations/tax',
        component: Tax,
      },
      {
        path: '/network/donations/discounts',
        component: Discounts,
      },
      {
        path: '/network/donations/targets',
        component: Targets,
      },
    ]
  },
  {
    path: '/network/instance/:instance/',
    redirect: '/network/instance/:instance/setup/',
    props: true,
    component: () => import('@/views/network/Instance.vue'),
    children: [
      {
        path: '/network/instance/:instance/setup',
        props: true,
        component: instanceSetup
      },
      {
        path: '/network/instance/:instance/console',
        props: true,
        component: instanceConsole
      },
      {
        path: '/network/instance/:instance/health',
        props: true,
        component: instanceHealth
      },
      {
        path: '/network/instance/:instance/image',
        props: true,
        component: instanceImage
      }
    ]
  },
  {
    path: '/network/settings/',
    redirect: '/network/settings/dangerzone/',
    component: () => import('@/views/network/Settings.vue'),
    children: [
      {
        path: '/network/settings/dangerzone',
        component: dangerZone
      },
    ]
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
