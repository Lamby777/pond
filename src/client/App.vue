<script setup lang="ts">
import { ref } from "vue";
import UploadButton from "./components/UploadButton.vue";
import Progress from "./components/Progress.vue";
import Modal from "./components/Modal.vue";

function upload() {
    showModal.value = true;

    const interval = setInterval(() => {
        percent.value += 10;
        if (percent.value === 100) {
            clearInterval(interval);
        }
    }, 1000);
}

const percent = ref(0);
const showModal = ref(false);
</script>

<template>
    <h1 class="text-center">Ducc Pond</h1>
    <div class="text-center">
        <UploadButton class="block center" @click="upload()" />
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
