<script setup lang="ts">
import { defineEmits } from "vue";
const emit = defineEmits(["click"]);
</script>

<template>
    <button type="button" @click="emit('click')">Upload!</button>
</template>
