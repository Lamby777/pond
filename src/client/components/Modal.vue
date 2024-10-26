<script setup lang="ts">
import { defineProps } from "vue";

const props = defineProps<{ show: boolean }>();
</script>

<template>
    <div v-if="show" class="modal">
        <div class="modal-content">
            <slot></slot>
            <button @click="$emit('close')">Close</button>
        </div>
    </div>
</template>

<style scoped>
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
}

.modal-content {
    background: white;
    padding: 20px;
    border-radius: 5px;
}
</style>
