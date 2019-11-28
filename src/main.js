// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import Vue from 'vue';
import App from './App';
import router from './router';

Vue.use(BootstrapVue);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
});

const firebaseConfig = {
  apiKey: 'AIzaSyAtylARmiL7tEBR95LkSfcI8dHQSM1YtT8',
  authDomain: 'challenge-ivisa.firebaseapp.com',
  databaseURL: 'https://challenge-ivisa.firebaseio.com',
  projectId: 'challenge-ivisa',
  storageBucket: 'challenge-ivisa.appspot.com',
  messagingSenderId: '633499607649',
  appId: '1:633499607649:web:e4530465952910acb08020',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
