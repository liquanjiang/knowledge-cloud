import Vue from 'vue'
import App from './App.vue'
import 'babel-polyfill'
import router from './router'
import echarts from 'echarts'
import store from './store/index'
import lodash from 'lodash'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VueAwesomeSwiper from 'vue-awesome-swiper'

// require styles
import 'swiper/dist/css/swiper.css'

// 引入的组件
import fontawesome from '@fortawesome/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import solid from '@fortawesome/fontawesome-free-solid'
import regular from '@fortawesome/fontawesome-free-regular'
import brands from '@fortawesome/fontawesome-free-brands'
import './assets/font-icon/iconfont.css'
import apiService from './libs/apiService'
import utils from './libs/util.js'
import md5 from 'js-md5'
import nodata from './components/conmon/nodata.vue'
import page from './components/conmon/page'

fontawesome.library.add(solid)
fontawesome.library.add(regular)
fontawesome.library.add(brands)

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false
Vue.prototype.$apiService = apiService
Vue.prototype.$util = utils
Vue.prototype.$Util = utils
Vue.prototype.$lodash = lodash
Vue.prototype.$md5 = md5
Vue.prototype.$newAppUrl = '/mw1'
Vue.prototype.$testUrl = 'http://10.4.106.5:7017'
Vue.prototype.$pathUrl = process.env.NODE_ENV === 'production' ? window.location.origin : 'http://10.4.138.221:7017/'

Vue.component('font-awesome-icon', FontAwesomeIcon)
Vue.component('nodata', nodata)
Vue.component('page', page)

Vue.use(BootstrapVue, VueAwesomeSwiper)

Vue.filter('dateFormatMill', function (value) {
    function appendLeadingZeroes (n) {
        return n <= 9 ? '0' + n : n
    }
    const date = new Date(value)
    return date.getFullYear() + '-' + appendLeadingZeroes(date.getMonth() + 1) + '-' + appendLeadingZeroes(date.getDate()) +
        ' ' + appendLeadingZeroes(date.getHours()) + ':' + appendLeadingZeroes(date.getMinutes()) + ':' + appendLeadingZeroes(date.getSeconds())
})

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app')
