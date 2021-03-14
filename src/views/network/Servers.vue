<template>
  <SubNav
    :title="$t('servers')"
    :show="!$router.currentRoute.path.includes(`wizard`)"
    :items="[
      { name: $t('list'), link: '/network/servers/list' },
      { name: $t('incidents'), link: '/network/servers/incidents', plus: true },
    ]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>