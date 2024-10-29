<script setup lang="ts">
import { ref, reactive } from "vue";

import Progress from "./components/Progress.vue";
import Modal from "./components/Modal.vue";
import DropZone from "./components/DropZone.vue";
import FileList from "./components/FileList.vue";

import instance from "./stores/instanceInfo";

const files = ref<File[]>([]);
const uploadPercent = ref(0);

const modalsShown = reactive({
    rules: false,
    instance: false,
    upload: false,
});

function handleFilesDropped(droppedFiles: File[]) {
    files.value.push(...droppedFiles);
}

async function upload() {
    modalsShown.upload = true;

    const formData = new FormData();
    files.value.forEach((file) => {
        formData.append("files", file);
    });

    await fetch("/api/upload", {
        method: "POST",
        body: formData,
        onprogress: (event: ProgressEvent) => {
            if (event.lengthComputable) {
                uploadPercent.value = (event.loaded / event.total) * 99;
            }
        }
    })

    uploadPercent.value = 100;
    setTimeout(() => {
        uploadPercent.value = 0;
        files.value = [];
        modalsShown.upload = false;
    }, 1000);
}
</script>

<template>
    <h1 class="text-center">Ducc Pond</h1>
    <div class="text-center">
        <DropZone @filesDropped="handleFilesDropped">
            <p>Drop file(s) here...</p>
        </DropZone>

        <FileList :files="files" />

        <button @click="upload">Upload!</button>
    </div>

    <div class="footer text-center">
        <button @click="modalsShown.rules = true">Rules</button>
        <button @click="modalsShown.instance = true">Instance</button>
    </div>

    <Modal :show="modalsShown.rules" @close="modalsShown.rules = false">
        <h2 class="text-center">Rules</h2>
        <p>TL;DR use common sense. Failure to comply on public instances will probably get you banned.</p>
        <ol>
            <li>Don't upload any illegal content.</li>
            <li>Don't upload anything that you don't have permission to upload.</li>
            <li>Don't use this site as a place to distribute malware.</li>
            <li>Don't bypass the file size limit by uploading chunks. (might set an hourly quota later)</li>
            <li>Don't try to hack or take down the server (unless you're going to report bugs responsibly)</li>
        </ol>
    </Modal>

    <Modal :show="modalsShown.instance" @close="modalsShown.instance = false">
        <h2 class="text-center">Instance Info</h2>
        <ul>
            <li>This instance is {{ instance.secured ? "" : "NOT " }}protected by a password</li>
            <li>This instance is running `pond` version {{ instance.backendVersion }}</li>
        </ul>
    </Modal>

    <Modal :show="modalsShown.upload" @close="modalsShown.upload = false">
        <Progress class="block center" :percent="uploadPercent" />
    </Modal>
</template>

<style lang="scss" scoped>
h1 {
    font-size: 3.2em;
}

.footer {
    position: fixed;
    bottom: 0;
    width: 100%;
    background-color: #6272a4;
    padding: 0.2em;

    display: flex;
    column-gap: 0.5em;
    justify-content: center;
}
</style>
