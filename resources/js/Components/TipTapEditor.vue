<script setup>
import TipTapToolbar from '@/Components/TipTapToolbar.vue';
import { DragHandle } from '@tiptap/extension-drag-handle-vue-3';
import { EditorContent } from '@tiptap/vue-3';

const props = defineProps({
    editor: {
        type: Object,
        required: false,
        default: null,
    },
    minHeight: {
        type: String,
        default: '150px',
    },
});
</script>

<template>
    <div v-if="editor" class="tiptap-editor-wrapper border rounded overflow-hidden">
        <TipTapToolbar :editor="editor" />

        <div class="position-relative">
            <DragHandle :editor="editor">
                <div class="drag-handle-icon">
                    <i class="ri-draggable"></i>
                </div>
            </DragHandle>

            <EditorContent
                :editor="editor"
                :style="{ minHeight: minHeight }"
                class="tiptap-content tw-prose tw-prose-sm prose-p:tw-my-1"
            />
        </div>
    </div>
</template>

<style scoped>
.tiptap-editor-wrapper {
    background-color: var(--app-surface-elevated);
}

.drag-handle-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1rem;
    height: 1.5rem;
    border-radius: 0.25rem;
    cursor: grab;
    color: var(--bs-body-color);
    transition: all 0.2s;
    margin-left: 5px;
    margin-right: 5px;
}

.drag-handle-icon:hover {
    background: var(--bs-secondary-bg);
    color: var(--bs-body-color);
}

:deep(.ProseMirror) {
    padding: 1rem;
    outline: none;
}

:deep(.ProseMirror-focused) {
    outline: none;
}
</style>
