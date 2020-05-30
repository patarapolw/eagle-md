import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

Vue.component<{ template: string }>('raw', {
  functional: true,
  render: function (h, context) {
    if (!context.props.template) return h()
    return h(Vue.compile(context.props.template))
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
