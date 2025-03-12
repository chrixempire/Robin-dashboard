<template>
  <div></div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

definePageMeta({
  layout: "responsive-sidebar-layout",
});

const router = useRouter();
onMounted(() => {
  router.push('/chat');
});
</script>
