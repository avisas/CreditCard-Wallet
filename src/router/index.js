import Vue from 'vue';
import Router from 'vue-router';
import Wallet from '@/components/Wallet';
import newCard from '@/components/newCard';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Wallet',
      component: Wallet,
    },
    {
      path: '/newCard',
      name: 'new-card',
      component: newCard,
    },
  ],
});
