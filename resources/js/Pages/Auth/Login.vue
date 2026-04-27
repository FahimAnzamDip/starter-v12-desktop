<script setup>
import { Head, Link, useForm } from '@inertiajs/vue3';
import { ref } from 'vue';

defineProps({
    canResetPassword: {
        type: Boolean,
    },
    status: {
        type: String,
    },
    canRegister: {
        type: Boolean,
    },
    branches: {
        type: Array,
    },
});

const showPassword = ref(false);

const form = useForm({
    email: '',
    password: '',
    branch_id: null,
    remember: false,
});

const submit = () => {
    form.post(route('login'), {
        onFinish: () => form.reset('password'),
    });
};
</script>

<template>
    <Head>
        <title>Log in</title>
        <link rel="icon" type="image/png" sizes="32x32" :href="$page.props.settings?.favicon" />
    </Head>

    <div class="min-vh-100 d-flex flex-column flex-lg-row font-sans">
        <!-- Left decorative panel -->
        <div
            class="d-none d-lg-flex w-50 flex-column align-items-center justify-content-center position-relative overflow-hidden"
            style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 70%, #533483 100%)"
        >
            <!-- Content -->
            <div class="position-relative z-1 text-center px-5">
                <h1 class="display-5 fw-bold text-white mb-3">
                    {{ $page.props.settings?.company_name || 'Welcome Back' }}
                </h1>
                <p class="fs-5 mb-5" style="color: rgba(255, 255, 255, 0.65)">
                    We will highlight software features in this seciton.
                </p>

                <!-- Feature pills -->
                <div class="d-flex flex-column gap-3 mt-4 mx-auto" style="max-width: 500px">
                    <div
                        v-for="feature in ['Secure Authentication', 'Role-Based Access', 'Real-Time Dashboard']"
                        :key="feature"
                        class="d-flex align-items-center gap-3 px-4 py-2 rounded-3 text-start"
                        style="background: rgba(255, 255, 255, 0.07); border: 1px solid rgba(255, 255, 255, 0.1)"
                    >
                        <i class="ri-checkbox-circle-fill text-success fs-5"></i>
                        <span class="small fw-medium" style="color: rgba(255, 255, 255, 0.85)">{{ feature }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Right form panel -->
        <div class="w-100 d-flex align-items-center justify-content-center bg-light px-3 py-5" style="flex: 1">
            <div class="w-100" style="max-width: 400px">
                <!-- Mobile logo -->
                <div class="d-flex justify-content-center mb-5 d-lg-none">
                    <img
                        v-if="$page.props.settings?.logo"
                        :src="$page.props.settings.logo"
                        width="100"
                        alt="App Logo"
                    />
                    <img v-else src="/images/app-logo-dark.png" width="100" alt="App Logo" />
                </div>

                <!-- Heading -->
                <div class="mb-5">
                    <h2 class="h2 fw-bold text-dark mb-2">Sign in</h2>
                    <p class="text-muted small mb-0">Enter your credentials to continue</p>
                </div>

                <!-- Status message -->
                <div v-if="status" class="alert alert-success py-2 px-3 small mb-4" role="alert">
                    {{ status }}
                </div>

                <!-- Form -->
                <form @submit.prevent="submit" class="d-flex flex-column gap-4">
                    <!-- Email field -->
                    <div>
                        <label for="email" class="form-label fw-semibold small text-dark mb-2"> Email address </label>
                        <div class="input-group">
                            <span
                                class="input-group-text bg-white border-end-0 text-muted px-3"
                                :class="{ 'border-danger text-danger': form.errors.email }"
                            >
                                <i class="ri-mail-line"></i>
                            </span>
                            <input
                                v-model="form.email"
                                type="email"
                                id="email"
                                name="email"
                                autocomplete="email"
                                autofocus
                                placeholder="you@example.com"
                                class="form-control py-2 border-start-0 ps-0 shadow-none"
                                :class="{ 'border-danger': form.errors.email }"
                            />
                        </div>
                        <div v-if="form.errors.email" class="text-danger small d-flex align-items-center gap-1 mt-1">
                            <i class="ri-error-warning-fill"></i> {{ form.errors.email }}
                        </div>
                    </div>

                    <!-- Password field -->
                    <div>
                        <label for="password" class="form-label fw-semibold small text-dark mb-2"> Password </label>
                        <div class="input-group">
                            <span
                                class="input-group-text bg-white border-end-0 text-muted px-3"
                                :class="{ 'border-danger text-danger': form.errors.password }"
                            >
                                <i class="ri-lock-line"></i>
                            </span>
                            <input
                                v-model="form.password"
                                :type="showPassword ? 'text' : 'password'"
                                id="password"
                                name="password"
                                autocomplete="current-password"
                                placeholder="••••••••"
                                class="form-control py-2 border-start-0 border-end-0 px-0 shadow-none"
                                :class="{ 'border-danger': form.errors.password }"
                            />
                            <button
                                type="button"
                                @click="showPassword = !showPassword"
                                class="input-group-text bg-white border-start-0 text-muted px-3"
                                :class="{ 'border-danger text-danger': form.errors.password }"
                                style="cursor: pointer"
                            >
                                <i :class="showPassword ? 'ri-eye-off-line' : 'ri-eye-line'"></i>
                            </button>
                        </div>
                        <div v-if="form.errors.password" class="text-danger small d-flex align-items-center gap-1 mt-1">
                            <i class="ri-error-warning-fill"></i> {{ form.errors.password }}
                        </div>
                    </div>

                    <!-- Remember me + Forgot password -->
                    <div class="d-flex align-items-center justify-content-between mt-2">
                        <div class="form-check mb-0">
                            <input
                                class="form-check-input"
                                type="checkbox"
                                value="1"
                                id="remember"
                                name="remember"
                                v-model="form.remember"
                                style="cursor: pointer"
                            />
                            <label
                                class="form-check-label small text-muted user-select-none"
                                for="remember"
                                style="cursor: pointer"
                            >
                                Remember me
                            </label>
                        </div>

                        <Link
                            v-if="canResetPassword"
                            :href="route('password.request')"
                            class="small fw-semibold text-primary text-decoration-none"
                        >
                            Forgot password?
                        </Link>
                    </div>

                    <!-- Submit button -->
                    <button
                        type="submit"
                        :disabled="form.processing"
                        class="btn btn-primary w-100 py-2 d-flex align-items-center justify-content-center gap-2 mt-3 shadow-sm rounded-3 fw-semibold"
                        :class="{ 'opacity-75': form.processing }"
                        style="background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%); border: none"
                    >
                        <span
                            v-if="form.processing"
                            class="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                        ></span>
                        <i v-else class="ri-login-circle-line"></i>
                        <span>{{ form.processing ? 'Signing in…' : 'Sign in' }}</span>
                    </button>
                </form>

                <!-- Register link -->
                <p v-if="canRegister" class="text-center small text-muted mt-5 mb-0">
                    Don't have an account?
                    <Link :href="route('register')" class="fw-semibold text-primary text-decoration-none ms-1">
                        Create account
                    </Link>
                </p>

                <!-- Footer note -->
                <p class="text-center text-muted mt-4 mb-0" style="font-size: 0.75rem">
                    Powered by <a href="">Flashbyte Systems</a> © {{ new Date().getFullYear() }}
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Smooth autofill background override */
input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
    -webkit-box-shadow: 0 0 0 1000px #fff inset;
    transition: background-color 5000s ease-in-out 0s;
}

.input-group:focus-within .input-group-text,
.input-group:focus-within .form-control {
    border-color: #86b7fe;
    box-shadow: none;
}

.form-control:focus {
    box-shadow: none;
}
</style>
