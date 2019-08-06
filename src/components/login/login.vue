<template>
    <div class="login-area">
        <div class="login">
            <div class="login-logo clearfix"><i class="logo-icon"></i><i class="logo-font">智力共享云平台-模网</i></div>
            <div class="login-left"></div>
            <div class="login-right">
                <div class="login-title-font">登录</div>
                <form name="loginForm" autocomplete="off" class="login-form">
                    <input placeholder="用户名" class="login-user-text" type="text" v-model="user.username"
                           name="user1" id="userName" autocomplete="off" required>
                    <input placeholder="密码" class="login-user-text" type="password" v-model="user.password"
                           :class="{'password-error': errorMsg}" @click="errorMsg = ''" @keyup.enter="login()"
                           name="user2" id="userPassword" autocomplete="off" required>
                    <span class="wrong-message">{{errorMsg}}</span>
                    <button class="login-btn" @click="login()" type="button">{{loginName}}</button>
                </form>
                <div class="resolution"><label>推荐分辨率 1920*1080</label></div>
            </div>
            <div class="login-bottom"><i class="login-bottom-left"></i><span>智力共享云平台-模网</span><i
                class="login-bottom-right"></i></div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'login',
    data: function () {
        return {
            user: {
                username: '',
                password: ''
            },
            loginName: '登录',
            errorMsg: null
        }
    },
    methods: {
        login (userParam) {
            const that = this
            if (!this.user.username) {
                that.$util.showMessage('请输入用户名', 'warning')
                return
            } else if (!this.user.password) {
                that.$util.showMessage('请输入密码', 'warning')
                return
            } else if (this.loginName === '登录中...') {
                return
            }
            this.loginName = '登录中...'
            const param = userParam || {
                username: this.user.username,
                password: this.$md5(this.user.password).toUpperCase()
            }
            this.$apiService.login.login(param).then((res) => {
                that.loginName = '登录'
                window.sessionStorage.setItem('isLogin', 'true')
                window.sessionStorage.setItem('token', res.token)
                const Json = JSON.stringify(res)
                window.localStorage.setItem('userInfo', encodeURIComponent(Json))
                window.sessionStorage.setItem('userInfo', encodeURIComponent(Json))
                this.$router.push('home')
                this.$store.dispatch('login')
            }).catch(res => {
                that.errorMsg = res.response.data.message
                // that.$util.showMessage('登录失败' + that.errorMsg, 'error')
                that.loginName = '登录'
            })
        },
        getUrlParams () {
            const para = window.location.search || window.location.hash
            let query = para.substring(para.indexOf('?') + 1)
            const vars = query.split('&')
            let paraObj = {}
            for (let i = 0; i < vars.length; i++) {
                const pair = vars[i].split('=')
                paraObj[pair[0]] = pair[1]
            }
            return paraObj
        },
        faceAuthLogin (data) {
            window.sessionStorage.put('faceLoginParam', encodeURIComponent(JSON.stringify(data)))
            window.location.href = 'http://' + window.location.host + '/auth/#/login?from=mw'
        }
    },
    mounted () {
        const that = this
        $(window).on('keyup', function (e) {
            if (e.key === 'Enter') {
                that.login()
            }
        })
        const paraObj = this.getUrlParams()
        if (paraObj.token) {
            this.loginName = '登录中...'
            this.$apiService.login.loginToken(paraObj).then(res => {
                that.loginName = '登录'
                if (Number(res.status) !== 0) {
                    that.errorMsg = res.message
                    return
                }
                const loginData = res.data
                if (!paraObj.flag) {
                    this.faceAuthLogin(loginData)
                } else {
                    const userInfo = encodeURIComponent(JSON.stringify(loginData))
                    window.sessionStorage.setItem('userInfo', userInfo)
                    window.localStorage.setItem('userInfo', userInfo)
                    window.sessionStorage.setItem('isLogin', 'true')
                    this.$store.dispatch('login')
                    this.$router.push('home')
                }
            }).catch(error => {
                that.loginName = '登录'
                that.errorMsg = '权限验证服务出错'
            })
        }
        if (paraObj.userName && paraObj.userPassword) {
            this.user.username = paraObj.userName
            this.user.password = paraObj.userPassword
            this.login(that.user)
        }
    },
    destroyed () {
        $(window).off('keyup')
    }
}
</script>

<style scoped>
    .login-area {
        width: 100%;
        height: 100%;
        position: relative;
        background: url("../../assets/login/login-back.png") no-repeat;
    }

    .login {
        min-width: 894px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fafafa;
        color: #333;
        border-radius: 10px;
        clear: both;
    }

    .login input {
        display: block;
        font-size: 14px;
        color: #333;
        height: 25px;
        width: 295px;
        border: none;
        outline: none;
        border-bottom: 1px solid #999;
        background: inherit;
        margin-bottom: 50px;
    }

    .login input:focus {
        border-bottom: 1px solid #4075FC;

    }

    .login-btn {
        width: 296px;
        height: 35px;
        background: #3F6BF4;
        border-radius: 5px;
        border: none;
        color: #fff;
        font-size: 14px;
        margin-top: 35px;
    }

    .login-btn:hover {
        background-color: #1E58E9;
    }

    .login .login-left, .login .login-right {
        float: left;
    }

    .login-left {
        width: 394px;
        height: 496px;
        background: url("../../assets/login/login-image.png") no-repeat center;
    }

    .login-form {
        width: 296px;
        margin: 70px 102px;
    }

    .login-right .login-title-font {
        font-size: 28px;
        font-weight: 400;
        color: rgba(63, 107, 244, 1);
        margin-top: 100px;
    }

    .resolution {
        padding-right: 10px;
        text-align: right;
        font-size: 12px;
        color: #b2b2b2;
        height: 30px;
        line-height: 30px;
    }

    .login-logo {
        text-align: center;
        position: absolute;
        top: -5vw;
        left: 35%;
    }

    .login-logo i {
        display: inline-block;
        vertical-align: middle;
    }

    .login-logo .logo-icon {
        min-width: 29px;
        min-height: 34px;
        margin-right: 10px;
        background: url("../../assets/login/login-logo.png") no-repeat;
    }

    .login-logo .logo-font {
        font-size: 26px;
        font-weight: 700;
        color: #3F6BF4;
    }

    .login-logo .logo-font {
        font-size: 26px;
        font-weight: 700;
        color: #3F6BF4;
        font-style: inherit;
    }

    .login-bottom {
        position: absolute;
        bottom: -3vw;
        left: 31%;
    }

    .login-bottom span {
        font-size: 14px;
        font-weight: 400;
        color: rgba(63, 107, 244, 1);
        vertical-align: -3px;
        padding: 0 11px;
    }

    .login-bottom i {
        display: inline-block;
        width: 87px;
        height: 1px;
    }

    .login-bottom .login-bottom-left {
        background: url("../../assets/login/logo-left.png") no-repeat;
    }

    .login-bottom .login-bottom-right {
        background: url("../../assets/login/logo-right.png") no-repeat;
    }

    .wrong-message {
        font-size: 12px;
        color: #fb5234;
        height: 15px;
        display: block;
        text-align: right;
    }

    .login .password-error {
        border-bottom: 1px solid #fb5234;
    }

    #userPassword {
        margin-bottom: 0;
    }
</style>
