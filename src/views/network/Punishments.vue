<template>
  <SubNav
    title="Punishments"
    :items="[{ name: 'List', link: '/network/punishment/list/' }]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>