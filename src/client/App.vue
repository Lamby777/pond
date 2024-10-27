<script setup lang="ts">
import { ref } from "vue";
import UploadButton from "./components/UploadButton.vue";
import Progress from "./components/Progress.vue";
import Modal from "./components/Modal.vue";
import DropZone from "./components/DropZone.vue";
import FileList from "./components/FileList.vue";

const files = ref<File[]>([]);
const percent = ref(0);
const showModal = ref(false);

function handleFilesDropped(droppedFiles: File[]) {
    files.value.push(...droppedFiles);
}

function upload() {
    showModal.value = true;

    const formData = new FormData();
    files.value.forEach((file) => {
        formData.append("files", file);
    });

    fetch("/api/upload", {
        method: "POST",
        body: formData,
        onprogress: (event: ProgressEvent) => {
            if (event.lengthComputable) {
                percent.value = (event.loaded / event.total) * 99;
            }
        }
    }).then(() => {
        percent.value = 100;
        setTimeout(() => {
            percent.value = 0;
            files.value = [];
            showModal.value = false;
        }, 1000);
    });
}
</script>

<template>
    <h1 class="text-center">Ducc Pond</h1>
    <div class="text-center">
        <DropZone @filesDropped="handleFilesDropped">
            <p>Drop file(s) here...</p>
        </DropZone>

        <FileList :files="files" />

        <UploadButton class="block center" @click="upload" />
        <Modal :show="showModal" @close="showModal = false">
            <Progress class="block center" :percent="percent" />
        </Modal>
    </div>
</template>

<style scoped>
h1 {
    font-size: 3.2em;
}
</style>
