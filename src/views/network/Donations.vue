<template>
  <SubNav
    :title="$t('donations')"
    :items="[
      { name: $t('transactions'), link: '/network/donations/transactions/' },
      { name: $t('packages'), link: '/network/donations/packages/' },
      { name: $t('gateways'), link: '/network/donations/gateways/' },
      { name: $t('taxReporting'), link: '/network/donations/tax/' },
      { name: $t('discounts'), link: '/network/donations/discounts/', plus: true },
      { name: $t('targets'), link: '/network/donations/targets/', plus: true },
    ]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>