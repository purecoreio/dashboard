<template>
  <SubNav
    :title="$t('website')"
    :items="[
      { name: $t('template'), link: '/network/website/template/' },
      { name: $t('pages'), link: '/network/website/pages/' },
      { name: $t('marketplace'), link: '/network/website/marketplace/' },
    ]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>