<script setup>
import SidebarMenuItem from '@/Components/Sidebar/SidebarMenuItem.vue';
import SidebarMenuLink from '@/Components/Sidebar/SidebarMenuLink.vue';
import useSidebarActive from '@/Composables/useSidebarActive.js';
import { Link, usePage } from '@inertiajs/vue3';
import { Collapse } from 'bootstrap';
import { computed, nextTick, onMounted, ref, watch } from 'vue';

const navbar = ref(null);
const body = ref(document.body);
const page = usePage();

const toggleNavbar = () => {
    if (navbar.value && navbar.value.classList.contains('show')) {
        navbar.value.classList.remove('show');
    }

    if (body.value.style.position === 'fixed') {
        body.value.style.position = 'relative';
    }
};

const { setParentIconStates } = useSidebarActive();

onMounted(() => {
    setParentIconStates();

    const sidebar = document.getElementById('sidebarMenu');
    if (!sidebar) {
        return;
    }

    const collapseElements = sidebar.querySelectorAll('.multi-level.collapse');

    collapseElements.forEach((collapseEl) => {
        collapseEl.addEventListener('show.bs.collapse', (event) => {
            if (event.target !== collapseEl) {
                return;
            }

            collapseElements.forEach((otherCollapseEl) => {
                if (
                    otherCollapseEl !== collapseEl &&
                    otherCollapseEl.classList.contains('show') &&
                    !otherCollapseEl.contains(collapseEl)
                ) {
                    const bsCollapse = Collapse.getOrCreateInstance(otherCollapseEl);

                    if (bsCollapse) {
                        bsCollapse.hide();
                    }
                }
            });
        });
    });
});

const manageAccordionState = () => {
    const sidebar = document.getElementById('sidebarMenu');
    if (!sidebar) {
        return;
    }

    const expandedMenus = sidebar.querySelectorAll('.multi-level.collapse.show');

    expandedMenus.forEach((collapseEl) => {
        const hasActiveChild = collapseEl.querySelector('.nav-item.active');

        if (!hasActiveChild) {
            const bsCollapse = Collapse.getOrCreateInstance(collapseEl);

            if (bsCollapse) {
                bsCollapse.hide();
            }
        }
    });
};

watch(
    () => page.url,
    () => {
        nextTick(() => {
            if (typeof window !== 'undefined' && window.innerWidth < 992) {
                toggleNavbar();
            }

            setParentIconStates();
            manageAccordionState();
        });
    },
);

const dashboardMenuConfig = computed(() => ({
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'ri-home-2-line',
    route: 'dashboard',
    contractedText: 'D',
    permissions: ['access_dashboard'],
}));

const accessControlMenuConfig = computed(() => ({
    id: 'access-control',
    label: 'Access Control',
    icon: 'ri-admin-line',
    contractedText: 'AC',
    permissions: ['access_user_management'],
    activeRoutes: ['users.*', 'roles.*'],
    children: [
        {
            id: 'users',
            label: 'Users',
            route: 'users.index',
            activeRoutes: ['users.*'],
            contractedText: 'U',
        },
        {
            id: 'roles',
            label: 'Manage Roles',
            route: 'roles.index',
            activeRoutes: ['roles.*'],
            contractedText: 'R',
        },
    ],
}));

const settingsMenuConfig = computed(() => ({
    id: 'settings',
    label: 'Settings',
    icon: 'ri-settings-3-line',
    contractedText: 'S',
    permissions: ['access_settings', 'access_currencies', 'access_payment_methods'],
    activeRoutes: ['settings.edit', 'currencies.*', 'payment-methods.*'],
    children: [
        {
            id: 'general',
            label: 'General',
            route: 'settings.edit',
            contractedText: 'GS',
            permissions: ['access_settings'],
        },
        {
            id: 'payment-methods',
            label: 'Payment Methods',
            route: 'payment-methods.index',
            activeRoutes: ['payment-methods.*'],
            contractedText: 'PM',
            permissions: ['access_payment_methods'],
        },
        {
            id: 'currencies',
            label: 'Currencies',
            route: 'currencies.index',
            activeRoutes: ['currencies.*'],
            contractedText: 'C',
            permissions: ['access_currencies'],
        },
    ],
}));

const activityLogsMenuConfig = computed(() => ({
    id: 'activity-logs',
    label: 'Activity Logs',
    icon: 'ri-time-line',
    route: 'activity-logs.index',
    activeRoutes: ['activity-logs.*'],
    contractedText: 'AL',
    permissions: ['access_activity_logs'],
}));
</script>

<template>
    <nav class="navbar navbar-dark navbar-theme-primary px-4 col-12 d-lg-none">
        <Link class="navbar-brand me-lg-5" :href="route('dashboard')">
            <h5 class="text-white mb-0">{{ $page.props.settings.company_name || 'Starter Kit' }}</h5>
        </Link>
        <div class="d-flex align-items-center">
            <button
                class="navbar-toggler d-lg-none collapsed"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#sidebarMenu"
                aria-controls="sidebarMenu"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
        </div>
    </nav>

    <nav
        ref="navbar"
        id="sidebarMenu"
        class="sidebar d-lg-block text-white collapse simplebar-scrollable-y shadow"
        data-simplebar
    >
        <div class="sidebar-inner tw-px-3 tw-pt-0">
            <div class="user-card d-flex d-md-none align-items-center justify-content-between justify-content-md-center pb-4">
                <div class="d-flex align-items-center">
                    <div class="avatar-lg me-4">
                        <img :src="$page.props.auth.user.avatar" class="card-img-top rounded-circle" alt="User Avatar" />
                    </div>
                    <div class="d-block">
                        <h2 class="h5 mb-3 mt-3">Welcome, {{ $page.props.auth.user.name }}</h2>
                        <Link
                            :href="route('logout')"
                            method="post"
                            as="button"
                            class="btn btn-secondary btn-sm d-inline-flex align-items-center"
                        >
                            <svg
                                class="icon icon-xxs me-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                ></path>
                            </svg>
                            Logout
                        </Link>
                    </div>
                </div>
                <div class="collapse-close d-md-none">
                    <a
                        href="#sidebarMenu"
                        data-bs-toggle="collapse"
                        data-bs-target="#sidebarMenu"
                        aria-controls="sidebarMenu"
                        aria-expanded="true"
                        aria-label="Toggle navigation"
                    >
                        <i class="ri-close-circle-fill fs-1"></i>
                    </a>
                </div>
            </div>

            <ul class="nav flex-column pt-3 pt-md-1">
                <li class="nav-item">
                    <Link
                        :href="route('dashboard')"
                        class="nav-link d-flex align-items-center justify-content-center hover:!tw-bg-transparent"
                    >
                        <img class="app-logo me-2" width="30" :src="$page.props.settings.logo" alt="App Logo" />
                        <img class="contracted-app-logo ms-4" width="30" :src="$page.props.settings.logo" alt="App Logo" />
                        <h6 class="app-logo mb-0">{{ $page.props.settings.company_name || 'Starter Kit' }}</h6>
                    </Link>
                </li>

                <SidebarMenuLink :item="dashboardMenuConfig" :level="1" />
                <SidebarMenuItem :item="accessControlMenuConfig" :level="1" parent-path="" />
                <SidebarMenuItem :item="settingsMenuConfig" :level="1" parent-path="" />
                <SidebarMenuLink :item="activityLogsMenuConfig" :level="1" />

                <div class="!tw-mb-20"></div>
            </ul>
        </div>
    </nav>
</template>
