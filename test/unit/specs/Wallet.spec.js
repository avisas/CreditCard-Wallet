import Vue from 'vue';
import Wallet from '@/components/Wallet';

describe('Wallet.vue', () => {
  it('should render correct contents', () => {
    const Constructor = Vue.extend(Wallet);
    const vm = new Constructor().$mount();
    expect(vm.$el.querySelector('.wallet h1').textContent)
      .toEqual('Welcome to Your Vue.js App');
  });
});
