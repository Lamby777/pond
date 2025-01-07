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
    password: false,
    badpassword: false,
});

function handleFilesDropped(droppedFiles: File[]) {
    files.value.push(...droppedFiles);
}

function showPasswordPrompt() {
    modalsShown.password = true;

    // focus the password input
    setTimeout(() => {
        document.getElementById("upload-password").focus();
    }, 100);
}

async function upload(password?: string) {
    // if no password given when required, do nothing
    if (!password && instance.secured) return;

    // swap modals to the upload progress one
    modalsShown.password = false;
    modalsShown.upload = true;

    // start making a formdata object to send to the backend
    const formData = new FormData();

    // add the password to formdata
    if (password) formData.append("password", password);

    // add the files to formdata
    files.value.forEach((file) => {
        formData.append("files", file);
    });

    // make the request and animate the progress bar when it's progressing
    const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        onprogress: (event: ProgressEvent) => {
            if (event.lengthComputable) {
                uploadPercent.value = (event.loaded / event.total) * 100;
            }
        }
    });

    if (!res.ok) {
        const { error } = await res.json();
        uploadPercent.value = 0;
        modalsShown.upload = false;

        if (error === "badpassword") modalsShown.badpassword = true;
        return;
    }

    // reset the progress bar and the files list
    uploadPercent.value = 100;
    setTimeout(() => {
        uploadPercent.value = 0;
        modalsShown.upload = false;

        files.value = [];
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

        <button v-if="files.length > 0" @click="instance.secured ? showPasswordPrompt() : upload()">Upload!</button>
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

    <Modal :show="modalsShown.password" @close="modalsShown.password = false">
        <h2 class="text-center">Password Required</h2>
        <p>This instance is password-protected. Please enter the password to continue.</p>

        <form @submit.prevent="upload($event.target.password.value)">
            <!-- TODO make this box rounded and comfy -->
            <input id="upload-password" type="password" name="password" />
        </form>
    </Modal>

    <Modal :show="modalsShown.upload" @close="modalsShown.upload = false">
        <Progress class="block center" :percent="uploadPercent" />
    </Modal>

    <Modal :show="modalsShown.badpassword" @close="modalsShown.badpassword = false">
        <h2>Bad Password.</h2>
        <p>The password you entered was incorrect. Please try again. (Or please don't, depending on who you are. :P)</p>
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
