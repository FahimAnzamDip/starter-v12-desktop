<script setup>
import ArrowLink from '@/Components/Icons/ArrowLink.vue';
import usePermission, { usePermissionAll } from '@/Composables/usePermission.js';
import { usePage } from '@inertiajs/vue3';
import { computed } from 'vue';
import SidebarMenuLink from './SidebarMenuLink.vue';

const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
    level: {
        type: Number,
        default: 1,
    },
    parentPath: {
        type: String,
        default: '',
    },
});

const page = usePage();

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

const hasChildren = computed(() => {
    return props.item.children && props.item.children.length > 0;
});

const checkChildPermissions = (child) => {
    if (!child.permissions?.length && !child.permissionsAll?.length) {
        return true;
    }

    if (child.permissions?.length && usePermission(child.permissions)) {
        return true;
    }

    if (child.permissionsAll?.length && usePermissionAll(child.permissionsAll)) {
        return true;
    }

    if (child.children?.length) {
        return child.children.some((grandchild) => checkChildPermissions(grandchild));
    }

    return false;
};

const visibleChildren = computed(() => {
    if (!props.item.children?.length) {
        return [];
    }

    return props.item.children.filter((child) => checkChildPermissions(child));
});

const hasActiveChild = (children) => {
    const currentUrl = page.url;

    if (!currentUrl || !children?.length) {
        return false;
    }

    return children.some((child) => {
        let routeMatches = false;

        if (child.activeRoutes) {
            const activeRoutes = Array.isArray(child.activeRoutes) ? child.activeRoutes : [child.activeRoutes];
            routeMatches = activeRoutes.some((pattern) => route().current(pattern));
        }

        if (!routeMatches && child.route) {
            const routes = Array.isArray(child.route) ? child.route : [child.route];
            routeMatches = routes.some((routeName) => route().current(routeName));
        }

        if (routeMatches && child.routeParams) {
            const currentParams = route().params;

            for (const [paramKey, allowedValues] of Object.entries(child.routeParams)) {
                const currentValue = currentParams[paramKey];

                if (currentValue !== undefined && currentValue !== null) {
                    if (!allowedValues.includes(currentValue)) {
                        routeMatches = false;
                        break;
                    }
                }
            }
        }

        if (routeMatches) {
            return true;
        }

        if (child.children?.length) {
            return hasActiveChild(child.children);
        }

        return false;
    });
};

const isExpanded = computed(() => {
    return hasActiveChild(props.item.children);
});

const isCurrentRouteActive = computed(() => {
    const currentUrl = page.url;

    if (!currentUrl || !props.item.route) {
        return false;
    }

    const routes = Array.isArray(props.item.route) ? props.item.route : [props.item.route];

    return routes.some((routePattern) => route().current(routePattern));
});

const collapseId = computed(() => {
    return `submenu-${props.parentPath ? `${props.parentPath}-` : ''}${props.item.id}`;
});

const currentPath = computed(() => {
    return props.parentPath ? `${props.parentPath}-${props.item.id}` : props.item.id;
});

const multiLevelClass = computed(() => {
    return `multi-level-${props.level}`;
});

const parentLinkClasses = computed(() => ({
    collapsed: !isExpanded.value,
}));

const navItemClasses = computed(() => ({
    'has-submenu': hasChildren.value,
    active: isExpanded.value || isCurrentRouteActive.value,
}));
</script>

<template>
    <li v-if="hasPermission && visibleChildren.length > 0" class="nav-item" :class="navItemClasses">
        <span
            v-if="hasChildren"
            id="hasArrow"
            class="nav-link d-flex justify-content-between align-items-center"
            :class="parentLinkClasses"
            data-bs-toggle="collapse"
            :data-bs-target="`#${collapseId}`"
        >
            <span class="d-flex align-items-center">
                <span v-if="item.icon && level === 1" class="sidebar-icon d-flex align-items-center">
                    <i :class="item.icon"></i>
                </span>
                <i v-if="level > 1" class="ri-subtract-line submenu-indicator text-secondary"></i>
                <span v-if="level > 1" class="sidebar-text-contracted">{{
                    item.contractedText || item.label.substring(0, 2)
                }}</span>
                <span v-if="item.labelHtml" class="sidebar-text d-inline-block" v-html="item.labelHtml"></span>
                <span v-else class="sidebar-text d-inline-block">{{ item.label }}</span>
            </span>
            <span class="link-arrow">
                <ArrowLink />
            </span>
        </span>

        <div
            v-if="hasChildren"
            :id="collapseId"
            :class="['multi-level', multiLevelClass, 'collapse', { show: isExpanded }]"
            role="list"
            aria-expanded="false"
        >
            <ul class="flex-column nav">
                <template v-for="child in visibleChildren" :key="child.id">
                    <SidebarMenuItem
                        v-if="child.children && child.children.length > 0"
                        :item="child"
                        :level="level + 1"
                        :parent-path="currentPath"
                    />
                    <SidebarMenuLink v-else :item="child" :level="level + 1" />
                </template>
            </ul>
        </div>
    </li>
</template>
