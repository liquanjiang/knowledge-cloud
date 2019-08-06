<template>
    <div class="modal-backdrop">
        <div class="modal-wrap" :style="propStyles">
            <slot name="header">
                <span class="close-span"><i class="iconfont icon-guanbi" @click="closeSelf"></i></span>
            </slot>
            <slot name="body">modal</slot>
            <slot name="footer">
                <button type="button" class="btn-confirm">确认</button>
                <button type="button" class="btn-close" @click="closeSelf">取消</button>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Modal',
    props: {
        width: {
            type: [Number, String],
            default: 300
        },
        backgroundColor: {
            type: [String],
            default: '#fff'
        }
    },
    mounted () {

    },
    data: function () {
        return {
            fadeOut: false,
            propStyles: {
                width: `${parseInt(this.width)}px`,
                'background-color': `${this.backgroundColor}`
            }
        }
    },
    computed: {
        // propStyles() {
        //     return {
        //         width: `${parseInt(this.width)}px`;
        //         background-color: `${this.backgroundColor}`;
        //     }
        // }
    },
    methods: {
        closeSelf () {
            this.fadeOut = true
            this.$emit('on-cancel')
        }
    }
}
</script>

<style scoped>
    *{
        line-height: 1.5;
    }
    .modal-backdrop {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        background-color: rgba(0, 0, 0, .7);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-wrap {
        /*background-color: inherit;*/
        /*box-shadow: 2px 2px 20px 1px;*/
        border-radius: 5px;

        -webkit-animation-duration: 500ms;
        -webkit-animation-name: slideInUp;
        animation-duration: 500ms;
        animation-name: slideInUp;
    }

    @keyframes slideInUp {
        from {
            opacity: 0;
        }
        to {
            opacity: 1;
        }
    }

    .close-span {
        display: inline-block;
        position: relative;
        width: 100%;
    }

    .close-span i {
        float: right;
    }

    .btn-close, .btn-confirm {
        border-radius: 8px;
        margin-left: 16px;
        width: 56px;
        height: 36px;
        border: none;
        cursor: pointer;
    }

    .btn-close:focus, .btn-confirm:focus {
        outline: none;
    }

    .btn-close {
        color: #313131;
        background-color: lightgray;
    }

    .btn-confirm {
        color: #fff;
        background-color: #2d8cf0;
    }

</style>
