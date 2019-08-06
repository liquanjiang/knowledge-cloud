<template>
    <div class="edit-share">
        <div class="edit-header window-header">
            <h4>修改共享模型 ·
                <a :title="item.shareName"> {{dealString(item.shareName, 15)}}</a>
            </h4>
            <span @click="closeWindow(false)"></span>
        </div>
        <div class="edit-body">
            <div class="form-area">
                <span>模型名称</span>
                <input type="text" v-model="shareInfos.modelName">
            </div>
            <div class="form-area" style="margin-bottom: 10px;">
                <span>模型简介</span>
                <textarea v-model="shareInfos.modelBrief">

                </textarea>
            </div>
            <div class="form-p">
                <span>周期任务</span>
                <span>{{shareInfos.scheduleType}}</span>
            </div>
            <div class="form-p">
                <span>定时规则</span>
                <span>{{shareInfos.scheduleRule || '无'}}</span>
            </div>
            <div class="form-p">
                <span>共享周期</span>
                <div class="redio-area" style="width:400px">
                    <span class="radio-icon"
                          @click="changeShareDate('0')"
                          :class="{'active': shareInfos.shareDate === '0'}">
                    </span>
                    <span class="radio-text">永久</span>
                    <span class="radio-icon"
                          @click="changeShareDate('2')"
                          :class="{'active': shareInfos.shareDate === '2'}">
                    </span>
                    <span class="radio-text">30天</span>
                    <span class="radio-icon"
                          @click="changeShareDate('1')"
                          :class="{'active': shareInfos.shareDate === '1'}">
                    </span>
                    <span class="radio-text">15天</span>
                    <div class="time-area">
                        <input type="text" id="startTime">
                        <span class="radio-icon"
                              @click="changeShareDate('4')"
                              :class="{'active': shareInfos.shareDate === '4'}">
                        </span>
                        <span class="radio-text" style="margin-right:10px">自定义</span>
                        <span class="time-span" v-if="time && showTime">今天至{{time}}</span>
                        <span class="time-icon"></span>
                    </div>
                </div>
            </div>
            <div class="form-p">
                <span>共享方式</span>
                <div class="redio-area type-area">
                    <span class="radio-icon"
                          @click="changeShareType('2')"
                          :class="{'active': shareInfos.shareType === '2'}">
                    </span>
                    <span class="radio-text">公开共享</span>
                    <span class="radio-icon"
                          @click="changeShareType('1')"
                          :class="{'active': shareInfos.shareType === '1'}">
                    </span>
                    <span class="radio-text">定向共享</span>
                </div>
            </div>
            <div class="form-p" v-if="showList && shareInfos.shareType === '1'">
                <span>共享客户端</span>
                <div class="select-area">
                    <vueselect :listArray='shareListItems' :width="330" :height="30"
                               :outName="defaultClass.name"
                               :outValue="defaultClass.value"
                               @sendValue='selectClassValues'
                               :notSelect="false"
                               :namekey="'location_name'" :valuekey="'location_id'"></vueselect>
                </div>
            </div>
        </div>
        <div class="edit-footer">
            <div class="confirm-save" @click="editShareModel()">保存修改</div>
            <div class="cancel-close" @click="closeWindow(false)">关闭</div>
        </div>
    </div>
</template>

<script>
import '../../../assets/bootstrap-datetimepicker/bootstrap-datetimepicker.min.js'
import '../../../assets/bootstrap-datetimepicker/bootstrap-datetimepicker.min.css'
import '../../../assets/bootstrap-datetimepicker/bootstrap-datetimepicker.zh-CN.js'
import vueselect from '../../conmon/vueselect'

export default {
    name: 'cancelShare',
    props: {
        item: Object
    },
    components: {
        vueselect: vueselect
    },
    data: function () {
        return {
            shareObj: {
                resultId: '',
                shareDesc: '',
                shareKeepTime: '',
                shareKeepType: '',
                shareName: '',
                taskId: '',
                type: 1
            },
            shareInfos: {
                modelName: '',
                modelBrief: '',
                scheduleType: '',
                scheduleRule: '',
                shareType: '1',
                shareDate: '0',
                shareItem: '',
                shareLocationId: null
            },
            shareListItems: [],
            showList: false,
            defaultClass: {
                name: '',
                value: null
            },
            time: '',
            showTime: true
        }
    },
    created () {
        console.log(this.item)
        this.shareInfos.modelName = this.item.shareName
        this.shareInfos.modelBrief = this.item.shareDesc
        this.defaultClass.name = this.item.shareDeptName ? this.item.shareDeptName : ''
        this.defaultClass.value = this.item.shareDept ? parseInt(this.item.shareDept, 10) : null
    },
    methods: {
        // 关闭窗口
        closeWindow (flag) {
            this.$emit('close', flag)
        },
        // 处理超长字符串
        dealString (str, len) {
            return this.$util.dealString(str, len)
        },
        // 选中定向分享
        selectClassValues (item) {
            console.log(item)
            this.shareInfos.shareLocationId = item.value
        },
        // 获取该模型相关的模型信息
        getModelInfo () {
            const that = this
            const param = {
                taskId: this.item.taskId
            }
            this.$apiService.personalCenter.getShareModelInfo(param).then((res) => {
                that.shareInfos.scheduleType = res.timerMs ? '是' : '否'
                that.shareInfos.scheduleRule = res.timerMs ? res.timerMs : ''
            }).catch(res => {

            })
        },
        // 获取共享结果集信息
        getShareInfo () {
            const that = this
            const param = {
                resultId: this.item.resultId
            }
            this.$apiService.personalCenter.getShareInfo(param).then((res) => {
                that.shareInfos.shareLocationId = res.shareLocationId
                that.shareInfos.shareType = res.shareLocationId ? '1' : '2'
                if (res.shareKeepType === '4') {
                    that.time = res.shareKeepTime
                }
                that.shareInfos.shareDate = res.shareKeepType
                that.initdatapicker()
            }).catch(res => {

            })
        },
        // 获取定向共享信息
        getLocationInfo () {
            const that = this
            this.$apiService.personalCenter.getLocationInfo().then((res) => {
                that.shareListItems = res
                this.showList = true
            }).catch(res => {

            })
        },
        getLogic () {
            const that = this
            const param = {
                resultId: this.item.resultId
            }
            this.$apiService.personalCenter.getLogicInfo(param).then((res) => {
                console.log(res)
            }).catch(res => {

            })
        },
        // 切换共享类型
        changeShareType (index) {
            // this.shareInfos.shareType = index
            // this.showList = index === '1'
        },
        // 切换共享周期
        changeShareDate (index) {
            this.shareInfos.shareDate = index
            this.showTime = index === '4'
        },
        // 修改共享模型的方法
        editShareModel () {
            const vm = this
            const param = {
                'taskId': vm.item.taskId,
                'resultId': vm.item.resultId,
                'shareName': vm.shareInfos.modelName,
                'shareDesc': vm.shareInfos.modelBrief,
                'type': 1,
                'shareKeepType': vm.shareInfos.shareDate,
                'shareKeepTime': vm.shareInfos.shareDate === '0' ? '-1' : (vm.shareInfos.shareDate === '1' ? vm.$Util.formateGetDay(15) : vm.$Util.formateGetDay(30))
            }
            if (vm.shareInfos.shareLocationId) {
                param.shareLocationId = vm.shareInfos.shareLocationId
            }

            if (vm.shareInfos.shareDate === '4') {
                param.shareKeepTime = vm.time
            }

            if (vm.shareInfos.shareDate === '4' && !vm.time) {
                vm.$util.showMessage('尚未选择共享周期截止时间！', 'warning')
            } else {
                vm.$apiService.personalCenter.EditShare(param).then((res) => {
                    vm.$util.showMessage('修改共享模型成功！', 'success')
                    vm.closeWindow(true)
                }).catch((res) => {
                    vm.$util.showMessage('修改共享模型失败！' + res, 'error')
                    vm.closeWindow(false)
                })
            }
        },
        initdatapicker () {
            const that = this
            const time = that.time
            let date = new Date()
            date.setDate(date.getDate() + 3)
            const day = new Date(date)
            const startobj = {
                initialDate: time,
                autoclose: true,
                format: 'yyyy-mm-dd',
                language: 'zh-CN',
                weekStart: 0,
                minView: 2,
                todayHighlight: true,
                todayBtn: true,
                keyboardNavigation: true,
                pickerPosition: 'bottom-right',
                startDate: day
            }
            $('#startTime').datetimepicker(startobj).on('changeDate', (e) => {
                const value = e.date.valueOf()
                that.time = that.$util.formatDate(value)
            })
        }
    },
    mounted () {
        this.getLocationInfo()
        this.getModelInfo()
        this.getShareInfo()
        this.getLogic()
    }
}
</script>

<style scoped>
    .edit-share {
        width: 600px;
        height: 450px;
        background: #fff;
        border-radius: 5px;
        border: 1px solid rgba(0, 0, 0, 0.2);
        position: relative;
        top: 40%;
        left: 50%;
        transform: translate(-50%, -50%);
        padding: 10px 20px;
    }

    .edit-header {
        height: 30px;
        border-bottom: 1px solid #f2f2f2;
        position: relative;
    }

    .edit-header h4 {
        width: 400px;
        margin: 0 auto;
        height: 30px;
        line-height: 30px;
        text-align: center;
        color: #333;
        font-size: 14px;
        font-weight: bold;
    }

    .edit-header span {
        top: 5px;
        right: 0;
    }

    .edit-body {
        width: 500px;
        height: 320px;
        margin: 10px auto;
    }

    .edit-body .form-area, .edit-body .form-p {
        width: 100%;
        margin: 5px 0 20px 0;
        text-align: left;
        vertical-align: top;
    }

    .edit-body .form-p {
        margin: 0 0 2px 0;
        position: relative;
    }

    .edit-body .form-p:last-child {
        margin-top: 10px;
    }

    .edit-body .form-area > span, .edit-body .form-p > span {
        display: inline-block;
        width: 100px;
        margin-right: 20px;
        color: #333;
        text-align: right;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        vertical-align: top;
    }

    .edit-body .form-p span:nth-child(2) {
        text-align: left;
    }

    .edit-body .form-p div.select-area {
        position: absolute;
        left: 120px;
        top: 0;
        width: 200px;
        height: 30px;
    }

    .edit-body .form-p div.redio-area {
        position: absolute;
        left: 120px;
        top: 0;
        width: 200px;
        height: 30px;
    }

    .edit-body .form-p div.redio-area span {
        display: inline-block;
        color: #333;
        font-size: 12px;
        background-size: 100%;
        background-repeat: no-repeat;
    }

    .edit-body .form-p span.radio-icon {
        width: 14px;
        height: 14px;
        background-image: url("../../../assets/personal/public/unradio.svg");
        margin-right: 10px;
        position: relative;
        top: 3px;
        cursor: pointer;
    }

    .edit-body .form-p span.radio-icon.active {
        background-image: url("../../../assets/personal/public/radio.svg");
    }

    .edit-body .form-p span.radio-text {
        margin-right: 20px;
        height: 30px;
        line-height: 30px;
    }

    .edit-body .form-area input {
        width: 330px;
        border: 1px solid rgba(229, 233, 242, 1);
        color: #1a1a1a;
        height: 30px;
        font-size: 12px;
        text-indent: 10px;
        border-radius: 4px;
    }

    .edit-body .form-area textarea {
        width: 330px;
        border: 1px solid rgba(229, 233, 242, 1);
        color: #1a1a1a;
        height: 80px;
        font-size: 12px;
        text-indent: 5px;
        border-radius: 4px;
        padding: 5px;
    }

    .time-area {
        display: inline-block;
        width: 220px;
        position: absolute;
        left: 200px;
        top: 0;
        height: 30px;
    }

    .time-area input {
        width: 200px;
        position: absolute;
        left: 0;
        top: 0;
        height: 30px;
        border: none;
        opacity: 0;
        cursor: pointer;
    }

    .time-span {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        margin-right: 5px;
    }

    .time-icon {
        width: 20px;
        position: relative;
        top: 5px;
        height: 20px;
        background-repeat: no-repeat;
        background-size: 100%;
        background-image: url("../../../assets/personal/share/time.svg");
    }

    .edit-footer {
        margin-top: 20px;
    }

    .edit-footer .confirm-save {
        width: 100px;
        height: 36px;
        border-radius: 4px;
        background: #3f6bf4;
        color: #fff;
        display: inline-block;
        margin-right: 40px;
    }

    .edit-footer .confirm-save, .edit-footer .cancel-close {
        width: 100px;
        height: 36px;
        border-radius: 4px;
        background: #3f6bf4;
        color: #fff;
        display: inline-block;
        margin-right: 40px;
        font-size: 14px;
        line-height: 36px;
        cursor: pointer;
    }

    .edit-footer .cancel-close {
        background: rgba(245, 246, 250, 1);
        color: #333;
        border: 1px solid rgba(229, 233, 242, 1)
    }
</style>
