<script setup lang="ts">
const emit = defineEmits(["click"]);
</script>

<template>
    <button type="button" @click="emit('click')">Upload!</button>
</template>
