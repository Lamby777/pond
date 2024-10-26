<script setup lang="ts">
import { defineEmits } from "vue";
// defineProps<>();

const emit = defineEmits(["openModal"]);
</script>

<template>
    <button type="button" @click="emit('openModal')">Upload!</button>
</template>
