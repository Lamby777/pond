<script setup lang="ts">
import { defineEmits, ref } from "vue";

const emit = defineEmits<{
    (e: 'filesDropped', files: File[]): void;
}>();

const fileInput = ref<HTMLInputElement | null>(null);

function handleDrop(event: DragEvent) {
    const files = Array.from(event.dataTransfer?.files || []);
    emit("filesDropped", files);
}

function triggerFileSelect() {
    fileInput.value?.click();
}

function handleFileSelect(event: Event) {
    const files = Array.from((event.target as HTMLInputElement).files || []);
    emit("filesDropped", files);
}
</script>

<template>
    <div class="drop-zone" @dragover.prevent @drop.prevent="handleDrop" @click="triggerFileSelect">
        <slot>Drag and drop files here or click to select</slot>
        <input ref="fileInput" type="file" multiple class="hidden" @change="handleFileSelect" />
    </div>
</template>

<style scoped>
.drop-zone {
    border: 2px dashed #aaa;
    padding: 20px;
    text-align: center;
    cursor: pointer;
    transition: background-color 0.2s;
}

.drop-zone:hover {
    background-color: #f5f5f5;
}
</style>
