import Vue from 'vue'
import VueRouter from 'vue-router'
import GeneralSummary from '../views/summary/General.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/summary/general',
    name: 'General Summary',
    component: GeneralSummary
  },
  {
    path: '/instance/',
    name: 'Instance Summary',
    component: () => import('../views/instance/Instance.vue')
  },
  {
    path: '/summary/instance',
    name: 'Instance Summary',
    component: () => import('../views/summary/Instance.vue')
  },
  {
    path: '/players/lookup',
    name: 'Player Lookup',
    component: () => import('../views/players/Lookup.vue')
  },
  {
    path: '/players/profile/:coreid',
    props: true,
    name: 'PlayerProfile',
    component: () => import('../views/players/PlayerProfile.vue')
  },
  {
    path: '/players/filtered',
    name: 'Filtered Players',
    component: () => import('../views/players/Filtered.vue')
  },
  {
    path: '/analytics/general',
    name: 'General Analytics',
    component: () => import('../views/analytics/General.vue')
  },
  {
    path: '/analytics/growth',
    name: 'Growth Analytics',
    component: () => import('../views/analytics/Growth.vue')
  },
  {
    path: '/analytics/game',
    name: 'Game Analytics',
    component: () => import('../views/analytics/Game.vue')
  },
  {
    path: '/analytics/feedback',
    name: 'Feedback',
    component: () => import('../views/analytics/Feedback.vue')
  },
  {
    path: '/servers/list',
    name: 'Server List',
    component: () => import('../views/servers/List.vue')
  },
  {
    path: '/servers/machines',
    name: 'Machine List',
    component: () => import('../views/servers/Machines.vue')
  },
  {
    path: '/donations/transactions',
    name: 'Transactions',
    component: () => import('../views/donations/Transactions.vue')
  },
  {
    path: '/donations/packages',
    name: 'Packages',
    component: () => import('../views/donations/Packages.vue')
  },
  {
    path: '/donations/package/:uuid',
    name: 'Package',
    props: true,
    component: () => import('../views/donations/Package.vue')
  },
  {
    path: '/donations/perks',
    name: 'Perks',
    component: () => import('../views/donations/Perks.vue')
  },
  {
    path: '/donations/interested',
    name: 'Interested',
    component: () => import('../views/donations/Interested.vue')
  },
  {
    path: '/donations/refunds',
    name: 'Refunds',
    component: () => import('../views/donations/Refunds.vue')
  },
  {
    path: '/forum/news',
    name: 'News',
    component: () => import('../views/forum/News.vue')
  },
  {
    path: '/forum/sections',
    name: 'Sections',
    component: () => import('../views/forum/Sections.vue')
  },
  {
    path: '/forum/threads',
    name: 'Threads',
    component: () => import('../views/forum/Threads.vue')
  },
  {
    path: '/forum/actions',
    name: 'Actions',
    component: () => import('../views/forum/Actions.vue')
  },
  {
    path: '/forum/badges',
    name: 'Badges',
    component: () => import('../views/forum/Badges.vue')
  },
  {
    path: '/punishments/offences',
    name: 'Offences',
    component: () => import('../views/punishments/Offences.vue')
  },
  {
    path: '/punishments/actions',
    name: 'Actions',
    component: () => import('../views/punishments/Actions.vue')
  },
  {
    path: '/punishments/history',
    name: 'History',
    component: () => import('../views/punishments/History.vue')
  },
  {
    path: '/punishments/appeals',
    name: 'Appeals',
    component: () => import('../views/punishments/Appeals.vue')
  },
  {
    path: '/punishments/reports',
    name: 'Reports',
    component: () => import('../views/punishments/Reports.vue')
  },
  {
    path: '/billing/invoices',
    name: 'Invoices',
    component: () => import('../views/billing/Invoices.vue')
  },
  {
    path: '/website/domain',
    name: 'Domain',
    component: () => import('../views/website/Domain.vue')
  },
  {
    path: '/website/themes',
    name: 'Themes',
    component: () => import('../views/website/Themes.vue')
  },
  {
    path: '/website/pages',
    name: 'Pages',
    component: () => import('../views/website/Pages.vue')
  },
  {
    path: '/about/',
    name: 'About',
    component: () => import('../views/about/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes
})

export default router
