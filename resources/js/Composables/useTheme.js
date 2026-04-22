const THEME_KEY = 'theme';
const LIGHT_THEME = 'light';
const DARK_THEME = 'dark';
const VALID_THEMES = new Set([LIGHT_THEME, DARK_THEME]);

const canUseDom = typeof document !== 'undefined';
const canUseStorage = typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const resolveTheme = (value) => {
    return VALID_THEMES.has(value) ? value : LIGHT_THEME;
};

export const getStoredTheme = () => {
    if (!canUseStorage) {
        return LIGHT_THEME;
    }

    try {
        return resolveTheme(window.localStorage.getItem(THEME_KEY));
    } catch {
        return LIGHT_THEME;
    }
};

export const applyTheme = (theme) => {
    const resolvedTheme = resolveTheme(theme);

    if (!canUseDom) {
        return resolvedTheme;
    }

    document.documentElement.setAttribute('data-bs-theme', resolvedTheme);
    document.documentElement.classList.toggle('dark', resolvedTheme === DARK_THEME);

    return resolvedTheme;
};

export const setTheme = (theme) => {
    const resolvedTheme = applyTheme(theme);

    if (canUseStorage) {
        try {
            window.localStorage.setItem(THEME_KEY, resolvedTheme);
        } catch {
            // Ignore storage write issues (private mode / disabled storage).
        }
    }

    return resolvedTheme;
};

export const initializeTheme = () => {
    return applyTheme(getStoredTheme());
};

export const toggleTheme = () => {
    const currentTheme = getStoredTheme();
    const nextTheme = currentTheme === DARK_THEME ? LIGHT_THEME : DARK_THEME;

    return setTheme(nextTheme);
};

export const isDarkTheme = () => {
    if (!canUseDom) {
        return false;
    }

    return document.documentElement.getAttribute('data-bs-theme') === DARK_THEME;
};
