<template>
  <SubNav
    title="Settings"
    :items="[{ name: 'Danger Zone', link: '/network/settings/dangerzone/' }]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>