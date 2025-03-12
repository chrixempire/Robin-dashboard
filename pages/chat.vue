<template>
  <div class="page-container">
    <ChatMetrics />
    <ChatTable />
  </div>
</template>

<script setup>
import ChatMetrics from "~/components/ChatMetrics.vue";
import ChatTable from "~/components/ChatTable.vue";

definePageMeta({
  layout: "responsive-sidebar-layout",
});
</script>

<style scoped>
.page-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 46px;
  align-items: center;
}
</style>
