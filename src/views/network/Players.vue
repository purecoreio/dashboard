<template>
  <SubNav
    title="Players"
    :items="[
      { name: 'Online', link: '/network/players/online/' },
      { name: 'Growth', link: '/network/players/growth/' },
      { name: 'Activity', link: '/network/players/activity/' },
    ]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>