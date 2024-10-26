<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<template>
    <progress value="32" min="0" max="100"> 32% </progress>
</template>
