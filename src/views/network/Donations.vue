<template>
  <SubNav
    title="Donations"
    :items="[
      { name: 'Transactions', link: '/network/donations/transactions/' },
      { name: 'Packages', link: '/network/donations/packages/' },
      { name: 'Gateways', link: '/network/donations/gateways/' },
      { name: 'Tax Reporting', link: '/network/donations/tax/' },
      { name: 'Discounts', link: '/network/donations/discounts/', plus: true },
      { name: 'Targets', link: '/network/donations/targets/', plus: true },
    ]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>