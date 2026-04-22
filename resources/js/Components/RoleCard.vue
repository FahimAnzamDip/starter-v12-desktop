<script setup>
import { computed } from 'vue';

const props = defineProps({
    role: {
        type: Object,
        required: true,
    },
    modelValue: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['update:modelValue']);

const isSelected = computed(() => {
    return props.modelValue.includes(props.role.id);
});

const toggleRole = () => {
    let updated = [...props.modelValue];

    if (isSelected.value) {
        updated = updated.filter((id) => id !== props.role.id);
    } else {
        updated.push(props.role.id);
    }

    emit('update:modelValue', updated);
};
</script>

<template>
    <div class="card border-0 shadow h-100 theme-pattern-surface">
        <div class="card-header border-bottom py-2">
            <div class="d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center">
                    <i class="ri-user-settings-line fs-5 me-2 text-primary"></i>
                    <h6 class="mb-0 fw-semibold">{{ role.name }}</h6>
                </div>
            </div>
        </div>
        <div class="card-body">
            <div class="form-check form-switch mb-0">
                <input
                    class="form-check-input cursor-pointer"
                    :class="isSelected ? '!tw-bg-blue-500 !tw-border-blue-500' : ''"
                    type="checkbox"
                    :id="`role-${role.id}`"
                    :checked="isSelected"
                    @change="toggleRole"
                />
                <label class="form-check-label cursor-pointer fw-normal" :for="`role-${role.id}`">
                    {{ isSelected ? 'Enabled' : 'Disabled' }}
                </label>
            </div>
        </div>
    </div>
</template>

<style scoped>
.cursor-pointer {
    cursor: pointer;
}
</style>
