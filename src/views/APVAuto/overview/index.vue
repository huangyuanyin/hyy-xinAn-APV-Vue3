<template>
  <div class="overview-wrap" style="height: 100%;">
    <VersionDetails class="VersionDetails" />
  </div>
</template>

<script lang='ts' setup>
import { defineComponent, onMounted, inject, ref, nextTick } from "vue";
import VersionDetails from './component/VersionDetails.vue'

onMounted(() => {
})
</script>

<style lang="scss" scoped>

</style>