<script>
import MainLayout from '@/Layouts/MainLayout.vue';

export default {
    layout: MainLayout,
};
</script>

<script setup>
import { Head } from '@inertiajs/vue3';
</script>

<template>
    <Head title="Dashboard" />
    {{ $page.props.settings }}
</template>

<style scoped></style>
