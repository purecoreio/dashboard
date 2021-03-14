<template>
  <SubNav
    :title="$t('players')"
    :items="[
      { name: $t('online'), link: '/network/players/online/' },
      { name: $t('growth'), link: '/network/players/growth/' },
      { name: $t('activity'), link: '/network/players/activity/' },
    ]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>