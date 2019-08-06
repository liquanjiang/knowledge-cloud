<template>
    <div class="add-label">
        <h5>填写你要添加的标签</h5>
        <b-form-input v-model="label" placeholder="标签"></b-form-input>
        <div class="footer">
            <button type="button" class="btn sure" @click="addModelTag">确定</button>
            <button type="button" class="btn cancel" @click="cancel">取消</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'add-label',
    data: function () {
        return {
            label: ''
        }
    },
    methods: {
        addModelTag () {
            if (!this.label) {
                this.$util.showMessage('请输入要添加的标签！', 'error')
                return
            }
            this.$apiService.knowledge.addTag({ name: this.label }).then(res => {
                this.$emit('success')
                this.$util.showMessage('添加标签成功！', 'success')
            }).catch(err => {
                this.$util.showMessage(err.response.data.message || '添加标签失败！', 'error')
            })
        },
        cancel () {
            this.$emit('cancel')
        }
    }

}
</script>

<style scoped>
.add-label h5{font-size: 14px;
    color: #333;margin-bottom: 15px;}
.add-label input{font-size:14px;color:#555;}
.add-label .footer{text-align:center;margin-top:25px;}
.footer .btn{width: 120px;
    height: 38px;
    border-radius: 3px;
    font-size: 14px;}
.footer .btn:hover{}
.footer .sure{background-color: #3f6bf4;
    color: #fff;
    margin-right: 50px;}
.footer .cancel {
    background-color: #f5f6fa!important;
    border: 1px solid #e5e9f2;
    color: gray;
}
</style>
