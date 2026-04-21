<script setup>
import usePermission, { usePermissionAll } from '@/Composables/usePermission.js';
import { Link, usePage } from '@inertiajs/vue3';
import { computed } from 'vue';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    level: {
        type: Number,
        default: 1,
    },
});

const page = usePage();

const primaryRouteName = computed(() => {
    if (!props.item.route) {
        return null;
    }

    return Array.isArray(props.item.route) ? props.item.route[0] : props.item.route;
});

const hasPermission = computed(() => {
    if (!props.item.permissions?.length && !props.item.permissionsAll?.length) {
        return true;
    }

    if (props.item.permissions?.length) {
        return usePermission(props.item.permissions);
    }

    if (props.item.permissionsAll?.length) {
        return usePermissionAll(props.item.permissionsAll);
    }

    return true;
});

const isActive = computed(() => {
    if (!props.item.route && !props.item.activeRoutes) {
        return false;
    }

    const currentUrl = page.url;

    if (!currentUrl) {
        return false;
    }

    let routeMatches = false;

    if (props.item.activeRoutes) {
        const activeRoutes = Array.isArray(props.item.activeRoutes)
            ? props.item.activeRoutes
            : [props.item.activeRoutes];

        if (activeRoutes.some((pattern) => route().current(pattern))) {
            routeMatches = true;
        }
    }

    if (!routeMatches && props.item.route) {
        const routes = Array.isArray(props.item.route) ? props.item.route : [props.item.route];
        routeMatches = routes.some((routeName) => route().current(routeName));
    }

    if (!routeMatches) {
        return false;
    }

    if (props.item.routeParams) {
        const currentParams = route().params;

        for (const [paramKey, allowedValues] of Object.entries(props.item.routeParams)) {
            const currentValue = currentParams[paramKey];

            if (currentValue !== undefined && currentValue !== null) {
                if (!allowedValues.includes(currentValue)) {
                    return false;
                }
            }
        }
    }

    return true;
});
</script>

<template>
    <li v-if="hasPermission" class="nav-item" :class="{ active: isActive }" data-submenu-link :data-level="level">
        <Link :href="primaryRouteName ? route(primaryRouteName, item.routeData || {}) : '#'" class="nav-link d-flex align-items-center">
            <span v-if="level === 1 && item.icon" class="sidebar-icon d-flex align-items-center">
                <i :class="item.icon"></i>
            </span>
            <span v-if="level > 1" class="sidebar-text-contracted">{{
                item.contractedText || item.label.substring(0, 2)
            }}</span>
            <span v-if="item.labelHtml" class="sidebar-text d-inline-block" v-html="item.labelHtml"></span>
            <span v-else class="sidebar-text d-inline-block">{{ item.label }}</span>
            <span v-if="item.badge" class="badge bg-secondary ms-auto">{{ item.badge }}</span>
        </Link>
    </li>
</template>
