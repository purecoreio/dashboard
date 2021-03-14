<template>
  <SubNav
    :title="$t('profile')"
    :items="[
      { name: $t('plan'), link: '/account/plan/' },
      { name: $t('billing'), link: '/account/billing/' },
      { name: $t('votingSites'), link: '/account/votingsites/' },
      { name: $t('machines'), link: '/account/machines/', plus: true },
    ]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>