<template>
  <SubNav
    title="Servers"
    :show="!$router.currentRoute.path.includes(`wizard`)"
    :items="[
      { name: 'List', link: '/network/servers/list' },
      { name: 'Incidents', link: '/network/servers/incidents', plus: true },
    ]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>