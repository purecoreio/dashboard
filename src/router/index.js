import Vue from 'vue'
import VueRouter from 'vue-router'
import Panel from '../views/panel/Panel'
import Account from '../views/account/Account'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/analytics/growth' },
  { path: '/account/', redirect: '/account/plan' },
  {
    path: "*",
    name: '404',
    component: () => import('../views/error/404.vue')
  },
  {
    path: '/account/',
    name: 'Account',
    component: Account,
    children: [
      {
        path: '/account/votingsites',
        name: 'AddVotingSite',
        component: () => import('../views/account/VotingSites.vue')
      },
      {
        path: '/account/session',
        name: 'Session',
        component: () => import('../views/account/Session.vue')
      },
      {
        path: '/account/theme',
        name: 'Theme',
        component: () => import('../views/account/Theme.vue')
      },
      {
        path: '/account/notifications',
        name: 'Notifications',
        component: () => import('../views/account/Notifications.vue')
      },
      {
        path: '/account/invoices',
        name: 'Invoices',
        component: () => import('../views/account/billing/Invoices.vue')
      },
      {
        path: '/account/plan',
        name: 'Plan',
        component: () => import('../views/account/billing/Services.vue')
      },
      {
        path: '/account/machines',
        name: 'Machine List',
        component: () => import('../views/account/Machines.vue')
      },
    ]
  },
  {
    path: '/about/',
    name: 'About',
    component: () => import('../views/about/About.vue')
  },
  {
    path: '',
    name: 'Panel',
    component: Panel,
    children: [
      {
        path: '/instance/:uuid',
        name: 'Instance',
        props: true,
        component: () => import('../views/panel/instance/Instance.vue')
      },
      {
        path: '/players/lookup',
        name: 'Player Lookup',
        component: () => import('../views/panel/players/Lookup.vue')
      },
      {
        path: '/players/profile/:coreid',
        props: true,
        name: 'PlayerProfile',
        component: () => import('../views/panel/players/PlayerProfile.vue')
      },
      {
        path: '/players/filtered',
        name: 'Filtered Players',
        component: () => import('../views/panel/players/Filtered.vue')
      },
      {
        path: '/analytics/voting',
        name: 'Voting Analytics',
        component: () => import('../views/panel/analytics/Voting.vue')
      },
      {
        path: '/analytics/growth',
        name: 'Growth Analytics',
        component: () => import('../views/panel/analytics/Growth.vue')
      },
      {
        path: '/analytics/revenue',
        name: 'Revenue Analytics',
        component: () => import('../views/panel/analytics/Income.vue')
      },
      {
        path: '/analytics/game',
        name: 'Game Analytics',
        component: () => import('../views/panel/analytics/Game.vue')
      },
      {
        path: '/analytics/feedback',
        name: 'Feedback',
        component: () => import('../views/panel/analytics/Feedback.vue')
      },
      {
        path: '/setup/voting/:siteid',
        name: 'VotingSiteSetup',
        props: true,
        component: () => import('../views/panel/voting/Setup.vue')
      },
      {
        path: '/servers/list/:mode',
        name: 'ServerList',
        props: true,
        component: () => import('../views/panel/servers/List.vue')
      },
      {
        path: '/donations/transactions',
        name: 'Transactions',
        component: () => import('../views/panel/donations/Transactions.vue')
      },
      {
        path: '/donations/gateways',
        name: 'Gateways',
        component: () => import('../views/panel/donations/Gateways.vue')
      },
      {
        path: '/donations/packages',
        name: 'Packages',
        component: () => import('../views/panel/donations/Packages.vue')
      },
      {
        path: '/donations/package/:uuid',
        name: 'Package',
        props: true,
        component: () => import('../views/panel/donations/Package.vue')
      },
      {
        path: '/donations/perks',
        name: 'Perks',
        component: () => import('../views/panel/donations/Perks.vue')
      },
      {
        path: '/donations/interested',
        name: 'Interested',
        component: () => import('../views/panel/donations/Interested.vue')
      },
      {
        path: '/donations/refunds',
        name: 'Refunds',
        component: () => import('../views/panel/donations/Refunds.vue')
      },
      {
        path: '/community/news',
        name: 'News',
        component: () => import('../views/panel/community/News.vue')
      },
      {
        path: '/community/forum',
        name: 'Forum',
        component: () => import('../views/panel/community/Structure/Structure.vue')
      },
      {
        path: '/community/discord',
        name: 'Discord',
        component: () => import('../views/panel/community/Discord.vue')
      },
      {
        path: '/punishments/offences',
        name: 'Offences',
        component: () => import('../views/panel/punishments/Offences.vue')
      },
      {
        path: '/punishments/actions',
        name: 'Actions',
        component: () => import('../views/panel/punishments/Actions.vue')
      },
      {
        path: '/punishments/history',
        name: 'History',
        component: () => import('../views/panel/punishments/History.vue')
      },
      {
        path: '/punishments/appeals',
        name: 'Appeals',
        component: () => import('../views/panel/punishments/Appeals.vue')
      },
      {
        path: '/punishments/reports',
        name: 'Reports',
        component: () => import('../views/panel/punishments/Reports.vue')
      },
      {
        path: '/website/domain',
        name: 'Domain',
        component: () => import('../views/panel/website/Domain.vue')
      },
      {
        path: '/website/themes',
        name: 'Themes',
        component: () => import('../views/panel/website/Themes.vue')
      },
      {
        path: '/website/pages',
        name: 'Pages',
        component: () => import('../views/panel/website/Pages.vue')
      },
      { path: '/servers/list/', redirect: { path: '/servers/list/view' } }
    ]
  }
]

const router = new VueRouter({
  base: '/dashboard/',
  routes: routes
})

export default router
