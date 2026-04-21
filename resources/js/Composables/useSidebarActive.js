import { onMounted } from 'vue';

/**
 * Composable for managing sidebar active states and parent icon highlighting
 * Sets parent icons to secondary color when any child is active
 */
export default function useSidebarActive() {
    /**
     * Check if current route matches any pattern
     * @param {string|string[]} routePatterns - Route pattern(s) to check
     * @returns {boolean}
     */
    const isRouteActive = (routePatterns) => {
        if (!routePatterns) return false;

        const patterns = Array.isArray(routePatterns) ? routePatterns : [routePatterns];

        return patterns.some((pattern) => {
            return route().current(pattern);
        });
    };

    /**
     * Recursively check if any child has an active route
     * @param {Array} children - Array of menu items
     * @returns {boolean}
     */
    const hasActiveChild = (children) => {
        if (!children?.length) return false;

        return children.some((child) => {
            // Check if this child's route is active
            if (child.route && isRouteActive(child.route)) {
                return true;
            }

            // Recursively check nested children
            if (child.children?.length) {
                return hasActiveChild(child.children);
            }

            return false;
        });
    };

    /**
     * Set active state on parent icons when child is active
     * Traverses up the DOM tree to find all parent menus
     */
    const setParentIconStates = () => {
        const sidebar = document.getElementById('sidebarMenu');

        if (!sidebar) {
            return;
        }

        // CRITICAL: Reset ALL parent icons first before applying new active states
        // This prevents stale .text-secondary classes from persisting during navigation
        sidebar.querySelectorAll('.sidebar-icon i.text-secondary').forEach((icon) => {
            icon.classList.remove('text-secondary');
        });

        const subMenuLinks = sidebar.querySelectorAll('[data-submenu-link]');

        subMenuLinks.forEach((link) => {
            if (link.classList.contains('active')) {
                let parent = link.closest('[class*="multi-level-"]');

                while (parent) {
                    const arrow = parent.previousElementSibling;

                    if (arrow?.hasAttribute('data-bs-toggle')) {
                        const icon = arrow.querySelector('.sidebar-icon i');

                        if (icon) {
                            icon.classList.add('text-secondary');
                        }

                        parent.classList.add('show');
                        arrow.classList.remove('collapsed');
                    }

                    const parentUl = parent.closest('ul');
                    parent = parentUl?.closest('[class*="multi-level-"]');
                }
            }
        });
    };

    onMounted(() => {
        setTimeout(setParentIconStates, 100);
    });

    return {
        isRouteActive,
        hasActiveChild,
        setParentIconStates,
    };
}
