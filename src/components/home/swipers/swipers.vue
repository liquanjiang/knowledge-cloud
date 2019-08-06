<template>
    <div class="swiper-container" id="swiper-container">
        <div class="swiper-wrapper">
            <div class="swiper-slide" v-for="(slide, index) in dataObj.slides" :key="index">
                <img :src="slide.imgUrl" alt="">
                <div class="title-zone">
                    <div class="title">{{slide.title}}</div>
                    <div class="sub-title pinyin" v-if="index === 0">{{slide.subTitle}}</div>
                    <div class="sub-title" v-if="index !== 0">实例场景</div>
                    <div class="see-more" @click="goToDetail(slide)" v-if="index !== 0">
                        立即查看
                    </div>
                </div>
            </div>
        </div>
        <div class="swiper-pagination"></div>
    </div>
</template>

<script>
import { Swiper } from 'vue-awesome-swiper'

export default {
    name: 'swipers',
    components: {
        Swiper: Swiper
    },
    data: function () {
        return {
            dataObj: {
                slides:
                    [
                        {
                            imgUrl: require('../../../assets/home/banner0.png'),
                            url: '',
                            title: '智力共享驱动智慧警务',
                            subTitle: 'ZHI LI GONG XIANG QU DONG ZHI HUI JING WU'
                        },
                        {
                            imgUrl: require('../../../assets/home/banner2.png'),
                            url: '/example/1',
                            title: '流动人口智能感知预警'
                        },
                        {
                            imgUrl: require('../../../assets/home/banner1.png'),
                            url: '/example/2',
                            title: '景区扒窃前科人员流入监控'
                        },
                        {
                            imgUrl: require('../../../assets/home/banner3.png'),
                            url: '/example/3',
                            title: '涉黑恶-警情分析挖掘'
                        }
                    ]
            }
        }
    },
    mounted () {
        const mySwiper = new Swiper('.swiper-container', {
            // spaceBetween: 0,
            mousewheel: false,
            centeredSlides: true,
            preventClicks: false,
            loop: true,
            // waitForTransition: true,
            effect: 'slide',
            freeMode: false,
            autoplay: {
                delay: 1800,
                disableOnInteraction: false
            },
            speed: 1000,
            pagination: {
                el: '.swiper-pagination',
                clickable: true
            },
            on: {},
            slides: this.dataObj.slides
        })

        $('.swiper-pagination-bullet').hover(function () {
            $(this).trigger('click')
        })

        document.getElementById('swiper-container').addEventListener('mouseenter',
            function () {
                mySwiper.autoplay.stop()
            })
        document.getElementById('swiper-container').addEventListener('mouseleave',
            function () {
                mySwiper.autoplay.start()
            })
    },
    methods: {
        goToDetail (item) {
            this.$router.push(item.url)
        }
    }
}
</script>

<style scoped>
</style>
<style>

    .swiper-container {
        height: 100%
    }

    .swiper-pagination-bullets .swiper-pagination-bullet {
        width: 35px;
        height: 4px;
        background: rgba(255, 255, 255, 1);
        opacity: 0.3;
        border-radius: 2px;
    }

    .swiper-pagination-bullets .swiper-pagination-bullet-active {
        width: 35px;
        height: 4px;
        background: rgba(255, 255, 255, 1);
        opacity: 0.8;
        border-radius: 2px;
    }

    .swiper-wrapper .swiper-slide {
        background-size: 100% 100%;
        background-repeat: no-repeat;
    }

    .swiper-wrapper .swiper-slide img {
        display: inline-block;
        width: 100%;
        height: 100%;
    }

    .swiper-slide .title-zone {
        position: absolute;
        left: 20%;
        top: 30%;
        color: #fff;
        z-index: 300;
    }

    .swiper-slide .title-zone .title {
        font-size: 42px;
        height: 80px;
        line-height: 80px;
    }

    .swiper-slide .title-zone .sub-title {
        font-size: 16px;
        height: 30px;
        line-height: 30px;
    }

    .swiper-slide .title-zone .sub-title.pinyin {
        font-family: MicrosoftYaHeiLight,sans-serif;
    }

    .swiper-slide .title-zone .see-more {
        margin-top: 30px;
        width: 120px;
        height: 40px;
        line-height: 40px;
        background: #fff;
        border: 1px solid #fff;
        border-radius: 2px;
        box-shadow: 1px 2px 3px 0 rgba(65, 93, 251, 0.4);
        color: #4e67ff;
        cursor: pointer;
        text-align: center;
    }
</style>
