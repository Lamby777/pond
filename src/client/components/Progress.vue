<script setup lang="ts">
import { ref } from "vue";

defineProps<{ percent: number }>();
</script>

<template>
    <div>
        <p>Progress:</p>
        <progress :value="percent" max="100">{{ percent }}%</progress>
    </div>
</template>
