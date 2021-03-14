<template>
  <SubNav
    :title="$t('settings')"
    :items="[{ name: $t('dangerZone'), link: '/network/settings/dangerzone/' }]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>