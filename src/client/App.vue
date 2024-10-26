<script setup lang="ts">
import { ref } from "vue";
import UploadButton from "./components/UploadButton.vue";
import Progress from "./components/Progress.vue";
import Modal from "./components/Modal.vue";

const showModal = ref(false);
</script>

<template>
    <h1 class="text-center">Ducc Pond</h1>
    <div class="text-center">
        <UploadButton class="block center" @openModal="showModal = true" />
        <!-- <Progress class="block center" /> -->
        <Modal :show="showModal" @close="showModal = false">
            <p>Your modal content goes here!</p>
        </Modal>
    </div>
</template>

<style scoped>
h1 {
    font-size: 3.2em;
}
</style>
