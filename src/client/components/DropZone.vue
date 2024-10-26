<script setup lang="ts">
import { defineEmits } from "vue";

const emit = defineEmits<{
    (e: 'filesDropped', files: File[]): void;
}>();

function handleDrop(event: DragEvent) {
    const files = Array.from(event.dataTransfer?.files || []);
    emit("filesDropped", files);
}
</script>

<template>
    <div class="drop-zone" @dragover.prevent @drop.prevent="handleDrop">
        <slot>Drag and drop files here</slot>
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
