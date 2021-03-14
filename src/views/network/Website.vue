<template>
  <SubNav
    title="Website"
    :items="[
      { name: 'Template', link: '/network/website/template/' },
      { name: 'Pages', link: '/network/website/pages/' },
      { name: 'Marketplace', link: '/network/website/marketplace/' },
    ]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>