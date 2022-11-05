<template>
    <!-- <router-view></router-view> -->
    <router-view v-slot="{ Component }">
        <keep-alive>
            <component :is="Component" :key="$route.fullPath" v-if="$route.meta.keepAlive" />
        </keep-alive>
        <component :is="Component" :key="$route.fullPath" v-if="!$route.meta.keepAlive" />
    </router-view>
</template>
  