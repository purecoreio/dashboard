<template>
  <SubNav
    :title="$t('punishments')"
    :items="[{ name: $t('list'), link: '/network/punishment/list/' }]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>