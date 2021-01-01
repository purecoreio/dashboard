<template>
  <SubNav
    title="Profile"
    :items="[
      { name: 'Plan', link: '/account/plan/' },
      { name: 'Billing', link: '/account/billing/' },
      { name: 'Voting Sites', link: '/account/votingsites/' },
      { name: 'Machines', link: '/account/machines/', plus: true },
    ]"
  >
    <transition mode="out-in" name="fade">
      <router-view />
    </transition>
  </SubNav>
</template>