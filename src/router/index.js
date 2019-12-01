import Vue from 'vue';
import Router from 'vue-router';
import Wallet from '@/components/Wallet';
import navbar from '@/components/Navbar';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Wallet',
      component: Wallet,
    },
    {
      path: '/navbar',
      name: 'nav-bar',
      component: navbar,
    },
  ],
});
