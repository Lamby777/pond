<script setup lang="ts">
defineProps<{ files: File[] }>();
</script>

<script lang="ts">
function fileSizeStr(bytes: number) {
    const units = ["B", "KB", "MB", "GB", "TB"];

    let unitIndex = 0;
    while (bytes >= 1024) {
        bytes /= 1024;
        unitIndex++;
    }

    return `${bytes.toFixed(2)} ${units[unitIndex]}`;
}
</script>

<template>
    <ul>
        <li v-for="(file, index) in files" :key="index">
            {{ file.name }} ({{ fileSizeStr(file.size) }})
        </li>
    </ul>
</template>
