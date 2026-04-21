import { Color } from '@tiptap/extension-color';
import Highlight from '@tiptap/extension-highlight';
import { Table } from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import { TextStyle } from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import { useEditor } from '@tiptap/vue-3';
import { onBeforeUnmount, watch } from 'vue';

export function useTipTap({ model, editable = true, toolbar = null } = {}) {
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [2, 3, 4],
                },
                codeBlock: false,
                blockquote: false,
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph'],
                alignments: ['left', 'center', 'right', 'justify'],
            }),
            Highlight.configure({
                multicolor: true,
            }),
            TextStyle,
            Color,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
        ],
        content: model?.value || '',
        editable: editable,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[200px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            if (model) {
                model.value = editor.getHTML();
            }
        },
    });

    // Watch for external changes to the model
    if (model) {
        watch(
            () => model.value,
            (newValue) => {
                const isSame = editor.value?.getHTML() === newValue;
                if (!isSame && newValue !== editor.value?.getHTML()) {
                    editor.value?.commands.setContent(newValue || '', false);
                }
            },
        );
    }

    function setContent(html) {
        if (editor.value) {
            editor.value.commands.setContent(html || '', false);
        }
    }

    function clearContent() {
        if (editor.value) {
            editor.value.commands.clearContent();
        }
    }

    // Cleanup on unmount
    onBeforeUnmount(() => {
        editor.value?.destroy();
    });

    return { editor, setContent, clearContent };
}
