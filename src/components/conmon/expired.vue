<template>
    <div></div>
</template>

<script>
import router from '../../router/index'

export default {
    name: 'expired',
    mounted () {
        confirm('登录过期,请重新登录') ? router.push('/login') : router.push('/login')
    }
}
</script>

<style scoped>

</style>
