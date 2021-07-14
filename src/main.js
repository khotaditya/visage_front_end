import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from './router'
import Vuelidate from 'vuelidate'
import { Simplert } from 'vue2-simplert-plugin';
import 'vue2-simplert-plugin/dist/vue2-simplert-plugin.min.css';



Vue.config.productionTip = false

Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(Vuelidate);
Vue.use(Simplert);



new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
