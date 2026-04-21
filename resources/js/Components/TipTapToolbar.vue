<template>
    <div v-if="editor" class="tiptap-toolbar bg-light d-flex align-items-center gap-1 p-2 border-bottom flex-wrap">
        <!-- Undo -->
        <button
            @click="editor.chain().focus().undo().run()"
            :disabled="!editor.can().undo()"
            class="btn btn-sm bg-gray-100 border-0"
            type="button"
            title="Undo"
        >
            <i class="ri-arrow-go-back-line"></i>
        </button>

        <!-- Redo -->
        <button
            @click="editor.chain().focus().redo().run()"
            :disabled="!editor.can().redo()"
            class="btn btn-sm bg-gray-100 border-0"
            type="button"
            title="Redo"
        >
            <i class="ri-arrow-go-forward-line"></i>
        </button>

        <!-- Heading Dropdown -->
        <div class="dropdown">
            <button
                class="btn btn-sm bg-gray-100 border-0 dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Heading"
            >
                <i class="ri-h-1"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-custom">
                <li>
                    <a
                        class="dropdown-item"
                        :class="{ active: editor.isActive('paragraph') }"
                        @click.prevent="editor.chain().focus().setParagraph().run()"
                        href="#"
                    >
                        Normal
                    </a>
                </li>
                <li>
                    <a
                        class="dropdown-item"
                        :class="{ active: editor.isActive('heading', { level: 2 }) }"
                        @click.prevent="editor.chain().focus().toggleHeading({ level: 2 }).run()"
                        href="#"
                    >
                        <strong>Heading 2</strong>
                    </a>
                </li>
                <li>
                    <a
                        class="dropdown-item"
                        :class="{ active: editor.isActive('heading', { level: 3 }) }"
                        @click.prevent="editor.chain().focus().toggleHeading({ level: 3 }).run()"
                        href="#"
                    >
                        <strong>Heading 3</strong>
                    </a>
                </li>
                <li>
                    <a
                        class="dropdown-item"
                        :class="{ active: editor.isActive('heading', { level: 4 }) }"
                        @click.prevent="editor.chain().focus().toggleHeading({ level: 4 }).run()"
                        href="#"
                    >
                        <strong>Heading 4</strong>
                    </a>
                </li>
            </ul>
        </div>

        <!-- Bullet List -->
        <button
            @click="editor.chain().focus().toggleBulletList().run()"
            :class="{ 'active bg-primary text-white': editor.isActive('bulletList') }"
            class="btn btn-sm bg-gray-100 border-0"
            type="button"
            title="Bullet List"
        >
            <i class="ri-list-unordered"></i>
        </button>

        <!-- Ordered List -->
        <button
            @click="editor.chain().focus().toggleOrderedList().run()"
            :class="{ 'active bg-primary text-white': editor.isActive('orderedList') }"
            class="btn btn-sm bg-gray-100 border-0"
            type="button"
            title="Ordered List"
        >
            <i class="ri-list-ordered"></i>
        </button>

        <!-- Bold -->
        <button
            @click="editor.chain().focus().toggleBold().run()"
            :class="{ 'active bg-primary text-white': editor.isActive('bold') }"
            class="btn btn-sm bg-gray-100 border-0"
            type="button"
            title="Bold"
        >
            <i class="ri-bold"></i>
        </button>

        <!-- Italic -->
        <button
            @click="editor.chain().focus().toggleItalic().run()"
            :class="{ 'active bg-primary text-white': editor.isActive('italic') }"
            class="btn btn-sm bg-gray-100 border-0"
            type="button"
            title="Italic"
        >
            <i class="ri-italic"></i>
        </button>

        <!-- Strike -->
        <button
            @click="editor.chain().focus().toggleStrike().run()"
            :class="{ 'active bg-primary text-white': editor.isActive('strike') }"
            class="btn btn-sm bg-gray-100 border-0"
            type="button"
            title="Strikethrough"
        >
            <i class="ri-strikethrough"></i>
        </button>

        <!-- Table -->
        <div class="dropdown">
            <button
                class="btn btn-sm bg-gray-100 border-0 dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Table"
            >
                <i class="ri-table-line"></i>
            </button>
            <ul class="dropdown-menu dropdown-menu-custom">
                <li>
                    <a
                        class="dropdown-item"
                        @click.prevent="
                            editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()
                        "
                        href="#"
                    >
                        Insert Table
                    </a>
                </li>
                <li><hr class="dropdown-divider border-gray-300" /></li>
                <li>
                    <a
                        class="dropdown-item"
                        @click.prevent="editor.chain().focus().addColumnBefore().run()"
                        :class="{ disabled: !editor.can().addColumnBefore() }"
                        href="#"
                    >
                        Add Column Before
                    </a>
                </li>
                <li>
                    <a
                        class="dropdown-item"
                        @click.prevent="editor.chain().focus().addColumnAfter().run()"
                        :class="{ disabled: !editor.can().addColumnAfter() }"
                        href="#"
                    >
                        Add Column After
                    </a>
                </li>
                <li>
                    <a
                        class="dropdown-item"
                        @click.prevent="editor.chain().focus().deleteColumn().run()"
                        :class="{ disabled: !editor.can().deleteColumn() }"
                        href="#"
                    >
                        Delete Column
                    </a>
                </li>
                <li><hr class="dropdown-divider border-gray-300" /></li>
                <li>
                    <a
                        class="dropdown-item"
                        @click.prevent="editor.chain().focus().addRowBefore().run()"
                        :class="{ disabled: !editor.can().addRowBefore() }"
                        href="#"
                    >
                        Add Row Before
                    </a>
                </li>
                <li>
                    <a
                        class="dropdown-item"
                        @click.prevent="editor.chain().focus().addRowAfter().run()"
                        :class="{ disabled: !editor.can().addRowAfter() }"
                        href="#"
                    >
                        Add Row After
                    </a>
                </li>
                <li>
                    <a
                        class="dropdown-item"
                        @click.prevent="editor.chain().focus().deleteRow().run()"
                        :class="{ disabled: !editor.can().deleteRow() }"
                        href="#"
                    >
                        Delete Row
                    </a>
                </li>
                <li><hr class="dropdown-divider border-gray-300" /></li>
                <li>
                    <a
                        class="dropdown-item"
                        @click.prevent="editor.chain().focus().deleteTable().run()"
                        :class="{ disabled: !editor.can().deleteTable() }"
                        href="#"
                    >
                        Delete Table
                    </a>
                </li>
            </ul>
        </div>

        <!-- Underline -->
        <button
            @click="editor.chain().focus().toggleUnderline().run()"
            :class="{ 'active bg-primary text-white': editor.isActive('underline') }"
            class="btn btn-sm bg-gray-100 border-0"
            type="button"
            title="Underline"
        >
            <i class="ri-underline"></i>
        </button>

        <!-- Highlight Color -->
        <div class="dropdown">
            <button
                class="btn btn-sm bg-gray-100 border-0"
                :class="{ 'active bg-primary text-white': editor.isActive('highlight') }"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                title="Highlight"
            >
                <i class="ri-mark-pen-line"></i>
            </button>
            <ul class="dropdown-menu p-2 dropdown-menu-custom">
                <li class="d-flex gap-1 mb-2">
                    <button
                        @click.prevent="editor.chain().focus().toggleHighlight({ color: '#fef08a' }).run()"
                        class="btn btn-sm p-2"
                        style="background-color: #fef08a; width: 30px; height: 30px"
                        type="button"
                    ></button>
                    <button
                        @click.prevent="editor.chain().focus().toggleHighlight({ color: '#86efac' }).run()"
                        class="btn btn-sm p-2"
                        style="background-color: #86efac; width: 30px; height: 30px"
                        type="button"
                    ></button>
                    <button
                        @click.prevent="editor.chain().focus().toggleHighlight({ color: '#93c5fd' }).run()"
                        class="btn btn-sm p-2"
                        style="background-color: #93c5fd; width: 30px; height: 30px"
                        type="button"
                    ></button>
                    <button
                        @click.prevent="editor.chain().focus().toggleHighlight({ color: '#f9a8d4' }).run()"
                        class="btn btn-sm p-2"
                        style="background-color: #f9a8d4; width: 30px; height: 30px"
                        type="button"
                    ></button>
                    <button
                        @click.prevent="editor.chain().focus().toggleHighlight({ color: '#fdba74' }).run()"
                        class="btn btn-sm p-2"
                        style="background-color: #fdba74; width: 30px; height: 30px"
                        type="button"
                    ></button>
                </li>
                <li>
                    <button
                        @click.prevent="editor.chain().focus().unsetHighlight().run()"
                        class="btn btn-sm btn-outline-secondary w-100"
                        type="button"
                    >
                        Remove Highlight
                    </button>
                </li>
            </ul>
        </div>

        <!-- Text Align Left -->
        <button
            @click="editor.chain().focus().setTextAlign('left').run()"
            :class="{ 'active bg-primary text-white': editor.isActive({ textAlign: 'left' }) }"
            class="btn btn-sm bg-gray-100 border-0"
            type="button"
            title="Align Left"
        >
            <i class="ri-align-left"></i>
        </button>

        <!-- Text Align Center -->
        <button
            @click="editor.chain().focus().setTextAlign('center').run()"
            :class="{ 'active bg-primary text-white': editor.isActive({ textAlign: 'center' }) }"
            class="btn btn-sm bg-gray-100 border-0"
            type="button"
            title="Align Center"
        >
            <i class="ri-align-center"></i>
        </button>

        <!-- Text Align Right -->
        <button
            @click="editor.chain().focus().setTextAlign('right').run()"
            :class="{ 'active bg-primary text-white': editor.isActive({ textAlign: 'right' }) }"
            class="btn btn-sm bg-gray-100 border-0"
            type="button"
            title="Align Right"
        >
            <i class="ri-align-right"></i>
        </button>

        <!-- Text Align Justify -->
        <button
            @click="editor.chain().focus().setTextAlign('justify').run()"
            :class="{ 'active bg-primary text-white': editor.isActive({ textAlign: 'justify' }) }"
            class="btn btn-sm bg-gray-100 border-0"
            type="button"
            title="Justify"
        >
            <i class="ri-align-justify"></i>
        </button>

        <!-- Clear Formatting -->
        <button
            @click="editor.chain().focus().unsetAllMarks().clearNodes().run()"
            class="btn btn-sm bg-gray-100 border-0 text-danger"
            type="button"
            title="Clear Formatting"
        >
            <i class="ri-format-clear"></i>
        </button>
    </div>
</template>

<script setup>
const props = defineProps({
    editor: {
        type: Object,
        required: true,
    },
});
</script>

<style scoped>
.tiptap-toolbar button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.tiptap-toolbar .bg-gray-100 {
    background-color: transparent;
}

.tiptap-toolbar .bg-gray-100:hover {
    background-color: #e9ecef;
}

.tiptap-toolbar .bg-gray-100.active {
    background-color: #0d6efd !important;
    color: white !important;
}

.dropdown-menu-custom {
    border: 1px solid #e5e7eb;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    border-radius: 0.5rem;
}

.dropdown-menu-custom .dropdown-item {
    padding: 0.5rem 0.75rem;
    border-radius: 0.375rem;
    margin: 0.125rem 0.25rem;
    transition: all 0.15s ease-in-out;
}

.dropdown-menu-custom .dropdown-item:hover {
    background-color: #f3f4f6;
}
</style>
