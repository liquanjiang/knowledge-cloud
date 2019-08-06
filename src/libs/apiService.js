import axios from 'axios'
import qs from 'qs'
import Util from './util'
import router from '../router/index'

const JsonHeaders = { 'Content-Type': 'application/json' }
const FormHeaders = { 'Content-type': 'multipart/form-data;charset=UTF-8' }
const time = process.env.VUE_APP_CURRENTMODE === 'production' ? 50000 : 60000

const service = axios.create({
    headers: JsonHeaders,
    timeout: time
})

const formDataService = axios.create({
    // 需要非JSON格式交互数据时，设置以下格式
    headers: FormHeaders,
    timeout: time
})

formDataService.interceptors.request.use((config) => {
    const token = window.sessionStorage.getItem('token')
    if (token) {
        config.headers.common['Authorization'] = 'Bearer ' + token
    }
    return config
})

service.interceptors.request.use((config) => {
    const login = config.url.includes('login')
    const token = window.sessionStorage.getItem('token')
    if (token && !login) {
        config.headers.common['Authorization'] = 'Bearer ' + token
    } else if (!token && !login) {
        Util.showMessage('登录超时，请重新登录', 'warning', false)
        setTimeout(function () {
            router.push('/login')
        }, 3000)
    }
    return config
})

service.interceptors.response.use(res => {
    if (res.data.code === 500) {
        Util.showMessage('500: 服务器内部异常！', 'error', false)
    } else if (res.data.code === 401 || res.data.code === 444 || res.data.code === 403) {
        // 跳转到登录页面
        window.sessionStorage.clear()
        window.localStorage.clear()
        if (res.data.code === 444) {
            router.push('/expired')
            return res.data
        } else {
            Util.showMessage('登录超时，请重新登录', 'warning', false)
            Util.showMessage(res.data.message, 'error', false)
            setTimeout(function () {
                router.push('/login')
            }, 3000)
        }
    }
    return res.data
}, err => {
    return Promise.reject(err)
})

/* --------------- 接口配置文档 -------------------- */
const apiService = {
    home: {}, // 首页排行榜接口
    service: service,
    infoCount: {}, // home 首页相关接口
    activity: {}, //
    knowledge: {},
    myupload: {},
    message: {}
}

const prod = process.env.VUE_APP_CURRENTMODE === 'production'

const serviceURL = prod ? '/master' : '/master'

apiService.home = {
    getTopList: (param) => {
        const url = serviceURL + '/Comparison/model/getUnitTop'
        return service.get(url, { params: param })
    },
    // 获取我的钱包积分总数
    getPoints: () => {
        const url = serviceURL + '/Comparison/mart/purse/points/total'
        return service.get(url)
    },
    // 获取登录签到的信息
    loginSign: () => {
        const url = serviceURL + '/Comparison/sign_in'
        return service.post(url, {})
    }
}

apiService.knowledge = {
    // 获取警种列表
    getJz: (param) => {
        const url = serviceURL + '/model/getJz'
        return service.get(url, { params: param })
    },
    // 获取标签列表
    getTabs: (param) => {
        const url = serviceURL + '/modelList/getModelTag'
        return service.get(url, { params: param })
    },
    //
    getNews: (param) => {
        const url = serviceURL + '/Comparison/mart/news'
        return service.get(url, { params: param })
    },
    // 获取价值点列表
    getValPoint: (param) => {
        const url = serviceURL + '/modelList/getValuePoint'
        return service.get(url, { params: param })
    },
    // 上传文档接口
    uploadWd: (param) => {
        const url = serviceURL + '/Comparison/mart/upLoadFile'
        return service.post(url, param)
    },
    // 发布模型接口
    publish: (param) => {
        const url = serviceURL + '/Comparison/task'
        return service.put(url, param)
    },
    // 手动添加标签接口
    addTag: (param) => {
        const url = serviceURL + '/modelList/addModelTag'
        return service.get(url, { params: param })
    }
}
/* 首页相关接口 */
apiService.infoCount = {
    // 首页模型列表接口
    modelsList: (param) => {
        const url = serviceURL + '/Comparison/model/public'
        return service.post(url, param)
    },
    // 区块链轮播信息
    getPlayWords: (param) => {
        const url = serviceURL + '/Comparison/mart/public/points/info'
        return service.get(url, { params: param })
    },
    // 最新共享列表
    getSharesList: (param) => {
        const url = serviceURL + '/Comparison/mart/news'
        return service.get(url, { params: param })
    },
    // 标签
    getTagsList: (param) => {
        const url = serviceURL + '/modelList/getModelTag'
        return service.get(url, { params: param })
    },
    // 首页推荐模型--收藏
    collectAction: (param) => {
        const url = serviceURL + '/Comparison/mart/favorite?' + 'taskId=' + param.taskId
        return service.post(url, param)
    },
    // 首页推荐模型--克隆
    cloneAction: (param) => {
        const url = serviceURL + '/Comparison/task/result/clone'
        return service.post(url, param)
    },
    // 场景
    getScenario: (param) => {
        const url = serviceURL + '/Comparison/scenario/getCaseScenarioById'
        return service.get(url, { params: param })
    }
}

/* 打卡接口库 */
apiService.signAbout = {
    signIn: (param) => {
        const url = serviceURL + '/Comparison/sign_in'
        return service.post(url, param)
    },
    getSignInfo: (param) => {
        const url = serviceURL + '/Comparison/sign_in/info'
        return service.get(url, { params: param })
    },
    getSignBox: (param) => {
        const url = serviceURL + '/Comparison/sign_in/box'
        return service.get(url, { params: param })
    },
    repairSign: (param) => {
        const url = serviceURL + '/Comparison/sign_in/supplement'
        return service.post(url, {}, { params: param })
    },
    openSignBox: (param) => {
        const url = serviceURL + '/Comparison/sign_in/box/open'
        return service.post(url, {}, { params: param })
    },
    supplePoint: (param) => {
        const url = serviceURL + '/Comparison/sign_in/supplement/point'
        return service.get(url, { params: param })
    }
}

/* 个人中心接口列表 */
apiService.personalCenter = {
    // 个人中心，获取个人头部信息
    getUserInfo: (param) => {
        const url = serviceURL + '/Comparison/mart/user/info'
        return service.get(url, { params: param })
    },
    // 个人中心-我的主页，获取个人的信息
    getMyInfo: (param) => {
        const url = serviceURL + '/mart/get/user/info'
        return service.get(url, { params: param })
    },
    // 个人中心-我的发布-获取模型列表
    publishList: (param) => {
        const url = serviceURL + '/Comparison/model/public'
        return service.post(url, param)
    },
    // 个人中心-我的发布-删除发布模型
    delPublish: (param) => {
        const url = serviceURL + '/Comparison/task'
        return service.delete(url, { params: param })
    },
    // 个人中心-我的发布-获取已发布的模型的相关信息
    getPublish: (param) => {
        const url = serviceURL + '/Comparison/task'
        return service.get(url, { params: param })
    },
    // 个人中心-我的发布-获取已发布的模型的相关信息
    editPublish: (param) => {
        const url = serviceURL + '/Comparison/task'
        return service.put(url, param)
    },
    // 个人中心-我的收藏
    favList: (param) => {
        const url = serviceURL + '/Comparison/mart/collect/list'
        return service.post(url, param)
    },
    // 个人中心-我的克隆
    cloneList: (param) => {
        const url = serviceURL + '/Comparison/model/clone/task'
        return service.post(url, param)
    },
    // 个人中心-删除我的克隆
    deleteClone: (param) => {
        const url = serviceURL + '/Comparison/task/delete/clone/task'
        return service.post(url, param)
    },
    // 个人中心-我的共享
    shareList: (param, param1) => {
        const url = serviceURL + '/Comparison/share/result/list'
        return service.post(url, param, { params: param1 })
    },
    // 个人中心-我的共享-修改共享-获取共享模型信息
    getShareModelInfo: (param) => {
        const url = serviceURL + '/Comparison/mart/model/info'
        return service.get(url, { params: param })
    },
    // 个人中心-我的共享-修改共享-获取共享信息
    getShareInfo: (param) => {
        const url = serviceURL + '/Comparison/mart/get/share'
        return service.get(url, { params: param })
    },
    // 个人中心-我的共享-修改共享-获取共享-定向共享信息
    getLocationInfo: (param) => {
        const url = serviceURL + '/model/get/location/info'
        return service.get(url, { params: param })
    },
    getLogicInfo: (param) => {
        const url = serviceURL + '/Comparison/task/result/logic'
        return service.get(url, { params: param })
    },
    // 个人中心-我的共享-修改共享-查询结果集
    checkShare: (param) => {
        const url = serviceURL + '/Comparison/mart/check/share'
        return service.get(url, { params: param })
    },
    // 个人中心-我的共享-确认修改
    EditShare: (param) => {
        const url = serviceURL + '/Comparison/mart/set/share'
        return service.post(url, param)
    },
    // 个人中心-我的上传
    uploadList: (param, param1) => {
        const url = serviceURL + '/Comparison/source/result/list'
        return service.post(url, param, { params: param1 })
    },
    // 个人中心-Ta的主页，请求信息
    getNews: (param) => {
        const url = serviceURL + '/Comparison/mart/list/news'
        return service.get(url, { params: param })
    }
}

/* 发布模型相关接口 */
apiService.publishModel = {
    // 获取模型列表
    getModelList: (param) => {
        const url = serviceURL + '/Comparison/task/search'
        return service.post(url, param)
    },
    // 获取所有警察种类列表
    getPoliceList: () => {
        const url = serviceURL + 'model/getJz'
        return service.get(url)
    },
    // 获取所有标签列表
    getTags: (param) => {
        const url = serviceURL + 'model/getModelTag'
        return service.get(url, { params: param })
    }
}

apiService.myupload = {
    // 上传文件
    uploadFile: (param) => {
        const url = serviceURL + '/zuul/datacenter/template/get/file/data'
        return formDataService.post(url, param)
    },
    // 确定上传
    saveUploadFile: (param) => {
        const url = serviceURL + '/zuul/datacenter/template/upload/file'
        return service.post(url, param)
    },
    // 编辑我的上传-请求数据
    getColumns: (param) => {
        const url = serviceURL + '/zuul/datacenter/column/find/columns'
        return service.get(url, { params: param })
    },
    // 编辑我的上传-保存修改
    saveEdit: (param) => {
        const url = serviceURL + '/zuul/datacenter/column/add/column'
        return service.post(url, param)
    },
    // 我的上传-删除资源
    deleteExcel: (param, param1) => {
        const url = serviceURL + '/zuul/datacenter/folder/delete/folders'
        return service.post(url, param, { params: param1 })
    }
}

// 留言板相关的接口
apiService.message = {
    // 查询我的留言板ID
    queryBoardId: (param) => {
        const url = serviceURL + '/Comparison/board/message/query'
        return service.post(url, param)
    },
    // 打开留言板
    openBoard: (param) => {
        const url = serviceURL + '/Comparison/board/message/open'
        return service.post(url, {}, { params: param })
    },
    // 关闭留言板
    closeBoard: (param) => {
        const url = serviceURL + '/Comparison/board/message/close'
        return service.post(url, {}, { params: param })
    },
    // 留言板消息列表
    messageList: (param) => {
        const url = serviceURL + '/Comparison/reply/message/list'
        return service.post(url, param)
    },
    // 留言板-新增留言
    addMessage: (param) => {
        const url = serviceURL + '/Comparison/reply/message/save'
        return service.post(url, param)
    },
    // 留言-回复留言
    replyMessage: (param) => {
        const url = serviceURL + '/Comparison/back/message/save'
        return service.post(url, param)
    },
    // 删除留言板回复的方法
    removeBackMessage: (param) => {
        const url = serviceURL + '/Comparison/back/message/remove'
        return service.post(url, {}, { params: param })
    },
    // 删除留言板消息的方法
    removeMessage: (param) => {
        const url = serviceURL + '/Comparison/reply/message/remove'
        return service.post(url, {}, { params: param })
    }
}

apiService.activity = {
    //

}

apiService.login = {
    login: (param) => {
        const url = serviceURL + '/login'
        return service.post(url, param)
    },
    loginToken: (param) => {
        const url = serviceURL + '/token/login'
        return service.post(url, param)
    }
}

export default apiService
