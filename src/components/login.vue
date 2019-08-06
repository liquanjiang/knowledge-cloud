<template>
    <div style="height: 100%">
        <div class="login-wrapper" id="login-wrapper">
            <div class="login-container clearfix">
                <div class="login-logo clearfix"><i class="logo-icon"></i><i class="logo-font">共享模型联盟-模网</i></div>
                <div class="inner clearfix">
                    <div class="login-left pull-left"></div>
                    <div class="login-right pull-right">
                        <div class="login-form-wrap clearfix">
                            <form name="loginForm" class="form-horizontal" autocomplete="off">
                                <div class="face-login"></div>
                            </form>
                            <span class="wrong-message">{{errorMsg}}</span>
                        </div>
                        <div class="resolution"><label>推荐分辨率 1920*1080</label></div>
                    </div>
                </div>
                <div class="login-bottom"><i class="login-bottom-left"></i><span>共享模型联盟-模网</span><i
                    class="login-bottom-right"></i>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
const axios = require('axios')
export default {
    name: 'login',
    mounted () {
        let data = JSON.parse(decodeURIComponent(sessionStorage.getItem('faceLoginParam')))
        this.faceLogin(data)
    },
    data: function () {
        return {
            errorMsg: '权限验证中...'
        }
    },
    methods: {

        getUrlParams (variable) {
            const para = window.location.search || window.location.hash
            let query = para.substring(1)
            if (query.indexOf('?') !== -1) {
                query = query.substring(query.indexOf('?') + 1)
            }
            const vars = query.split('&')
            for (let i = 0; i < vars.length; i++) {
                const pair = vars[i].split('=')
                if (pair[0] === variable) {
                    return pair[1]
                }
            }
            return false
        },

        faceLogin (data) {
            let that = this
            let paramVal = '/' + (this.getUrlParams('from') || 'mw')

            document.getElementById('app').style.display = 'none'
            document.getElementById('body').style.background = 'url("./images/login-back.png") repeat'
            document.getElementById('body').style.backgroundSize = 'cover'
            if (window.FaceAuth) {
                const FaceAuth = window.FaceAuth
                // 提供系统编码和名称
                FaceAuth.getSystemName = function () {
                    return '警综系统'
                }

                // 提供swf文件路径
                FaceAuth.getSwfHttpPath = function () {
                    return './images/MyCamera.swf'
                }

                FaceAuth.init()

                // 调用登录方法，登录成功返回token
                FaceAuth.login = function (token) {
                    if (data) {
                        data.token = token
                    } else {
                        data = { token: token }
                    }
                    axios.post('/master/face/login', data).then(response => {
                        if (Number(response.data.status) !== 0) {
                            document.getElementById('app').style.display = 'block'
                            that.errorMsg = response.data.message
                            return
                        }
                        const userInfo = encodeURIComponent(JSON.stringify(response.data.data))
                        sessionStorage.setItem('userInfo', userInfo)
                        window.location.href = 'http://' + window.location.host + paramVal + '/#/main'
                    }).catch(error => {
                        // alert("人脸验证出错");
                        document.getElementById('app').style.display = 'block'
                        that.errorMsg = '人脸验证出错'
                    })
                }
            } else {
                document.getElementById('app').style.display = 'block'
                that.errorMsg = '人脸验证服务调用出错'
            }
        }
    }
}
</script>

<style scoped>
    .login-wrapper {
        position: relative;
        width: 100%;
        height: 100%;
        min-height: 600px;
    }

    .login-logo {
        width: 100%;
        text-align: center;
        margin-bottom: 20px;
    }

    .login-logo i {
        display: inline-block;
        vertical-align: middle;
    }

    .login-logo .logo-icon {
        min-width: 29px;
        min-height: 34px;
        margin-right: 10px;
        background: url("../assets/login-logo.png") no-repeat;
    }

    .login-logo .logo-font {
        font-size: 26px;
        font-weight: 700;
        color: #3F6BF4;
    }

    .login-bottom {
        width: 317px;
        margin: 15px auto;
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
        background: url("../assets/login/logo-left.png") no-repeat;
    }

    .login-bottom .login-bottom-right {
        background: url("../assets/login/logo-right.png") no-repeat;
    }

    .login-container {
        border-radius: 10px;
    }

    .login-container .login-left, .login-container .login-right {
        float: left;
    }

    .login-container .inner .login-left {
        width: 394px;
        height: 496px;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;
        background: url("../assets/login/login-image.png") no-repeat center;
    }

    .login-right {
        width: 500px;
        text-align: center;
    }

    .login-form-wrap {
        margin: 35px 50px;
    }

    .resolution label {
        font-size: 12px;
        color: #b2b2b2;
    }

    .login-container {
        position: absolute;
        top: 50%;
        left: 50%;
        margin-top: -300px;
        margin-left: -447px;
        height: 496px;
    }

    .login-container .inner {
        box-shadow: 0 13px 20px 0 rgba(174, 188, 218, 0.2);
        border-radius: 10px;
        background: rgba(255, 255, 255, 1);
    }

    .face-login {
        width: 400px;
        height: 400px;
    }

    .resolution {
        padding-right: 10px;
        text-align: right;
    }

    .resolution label {
        font-size: 12px;
        color: #b2b2b2;
        margin-bottom: 5px;
    }

    .clearfix {
        clear: both;
        content: " ";
        display: table;
    }

    .wrong-message {
        font-size: 12px;
        color: #fb5234;
    }

</style>
