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

// before upload, ask for password if necessary
async function promptUpload() {
    if (instance.secured) {
        const password = prompt("Enter the password to upload files");
        if (password === null) return;

        upload(password);
    }
}

async function upload(password?: string) {
    modalsShown.upload = true;

    const formData = new FormData();

    // add the password to formdata
    if (password) formData.append("password", password);

    // add the files to formdata
    files.value.forEach((file) => {
        formData.append("files", file);
    });

    // make the request and animate the progress bar when it's progressing
    await fetch("/api/upload", {
        method: "POST",
        body: formData,
        onprogress: (event: ProgressEvent) => {
            if (event.lengthComputable) {
                uploadPercent.value = (event.loaded / event.total) * 100;
            }
        }
    })

    // reset the progress bar and the files list
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

        <button @click="instance.secured ? promptUpload() : upload()">Upload!</button>
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
            <li>
                Don't try to hack or take down the server (unless you're on your own instance for testing purposes, of
                course)
            </li>
        </ol>
    </Modal>

    <Modal :show="modalsShown.instance" @close="modalsShown.instance = false">
        <h2 class="text-center">Instance Info</h2>
        <ul>
            <li>
                This instance is {{ instance.secured ? "" : "NOT " }}protected by a password!
                <span v-if="instance.secured">🔒</span>
                <span v-else>🔓</span>
            </li>
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
