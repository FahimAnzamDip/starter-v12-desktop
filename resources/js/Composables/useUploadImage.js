import vueFilePondModule from 'vue-filepond';

import FilePondPluginFilePoster from 'filepond-plugin-file-poster';
import FilePondPluginFileValidateSize from 'filepond-plugin-file-validate-size';
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type/dist/filepond-plugin-file-validate-type.esm.js';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.esm.js';

import 'filepond-plugin-file-poster/dist/filepond-plugin-file-poster.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css';
import 'filepond/dist/filepond.min.css';

import { router } from '@inertiajs/vue3';
import { ref } from 'vue';

const createFilePond = (...plugins) => {
    const factory = typeof vueFilePondModule === 'function' ? vueFilePondModule : vueFilePondModule?.default;

    if (typeof factory !== 'function') {
        throw new TypeError('vue-filepond factory is unavailable');
    }

    return factory(...plugins);
};

export function useUploadImage(form, savedImages = null, imagePaths = null, fieldName = 'images') {
    let FilePond = createFilePond(
        FilePondPluginFileValidateType,
        FilePondPluginImagePreview,
        FilePondPluginFileValidateSize,
        FilePondPluginFilePoster,
    );
    let pond = ref(null);

    const handleFilePondLoad = (response) => {
        form[fieldName].push(response);

        return response;
    };

    const handleFilePondRevert = (uniqueID, load, error) => {
        form[fieldName] = form[fieldName].filter((image) => image !== uniqueID);
        router.delete(route('filepond.revert', uniqueID));
        load();
    };

    const handleFilePondInit = () => {
        if (imagePaths.value) {
            savedImages.value = [];

            for (let i = 0; i < imagePaths.value.length; i++) {
                savedImages.value.push({
                    source: imagePaths.value[i],
                    options: {
                        type: 'local',
                        metadata: {
                            poster: imagePaths.value[i],
                        },
                    },
                });
            }
        }
    };

    const handleFilePondRemove = (source, load, error) => {
        let filename = source.substring(source.lastIndexOf('/') + 1);
        form[fieldName] = form[fieldName].filter((image) => image !== filename);
        router.delete(route('filepond.remove', filename));

        load();
    };

    return { FilePond, pond, handleFilePondLoad, handleFilePondRevert, handleFilePondInit, handleFilePondRemove };
}
