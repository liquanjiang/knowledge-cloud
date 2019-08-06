<template>
    <div id="app">
        <div class="app-container" id="appContent" :class="{'all-height': !isLogin }">
            <headerNav v-if="isLogin"></headerNav>
            <keep-alive include="home,knowledge,example">
                <router-view></router-view>
            </keep-alive>
            <div class="empty" v-if="isLogin"></div>
        </div>
        <div id="goTop" v-on:click="goTop()"
             :class="{'to-top': this.scrollIndent > 69, 'to-top-hide': this.scrollIndent < 70}"><i></i>
            <b-tooltip target="goTop" container="goTop">返回顶部</b-tooltip>
        </div>
        <footBan v-if="isLogin"></footBan>
        <loading v-show="ShowLoading"></loading>
    </div>
</template>

<script>
import headerNav from './components/head/header.vue'
import footBan from './components/footer.vue'
import loading from './components/conmon/loadingAnimation'

export default {
    name: 'app',
    components: {
        headerNav: headerNav,
        footBan: footBan,
        loading: loading
    },
    data: function () {
        return {
            scrollIndent: 0
        }
    },
    computed: {
        isLogin: function () {
            return this.$store.state.isLogin
        },
        ShowLoading: function () {
            return this.$store.state.loading
        }
    },
    created () {

    },
    mounted () {
        const that = this
        window.addEventListener('scroll', function () {
            that.scrollIndent = document.body.scrollTop || document.documentElement.scrollTop
        }, true)
    },
    methods: {
        goTop () {
            document.getElementById('app').scrollIntoView(true)
        }
    }
}
</script>

<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #fff;
    }

    .app-container {
        min-height: 100%;
        margin-bottom: -100px;
    }

    .app-container.all-height {
        height: 100%;
    }

    .empty, footer {
        height: 100px;
    }

    * {
        font-family: MicrosoftYaHei;
        margin: 0;
        padding: 0;
    }

    #goTop {
        position: fixed;
        bottom: 1em;
        right: 1em;
        cursor: pointer;
        border: none;
        z-index: 1000;
        width: 77px;
    }

    #goTop i {
        background: url("./assets/to-top.png") no-repeat;
        width: 30px;
        height: 30px;
        display: inline-block;
    }

    #goTop i:hover {
        background: url("./assets/to-top-hover.png") no-repeat;
    }

    .to-top {
        -webkit-animation: fadeIn 1s; /* Safari, Chrome and Opera > 12.1 */
        -moz-animation: fadeIn 1s; /* Firefox < 16 */
        -ms-animation: fadeIn 1s; /* Internet Explorer */
        -o-animation: fadeIn 1s; /* Opera < 12.1 */
        animation: fadeIn 1s;
        animation-iteration-count: 1;
        -webkit-animation-iteration-count: 1; /* Safari 和 Chrome */
    }

    @keyframes fadeIn {
        from {
            opacity: 0
        }
        to {
            opacity: 1
        }
    }

    .to-top-hide {
        opacity: 0;
        display: none;
    }
</style>
