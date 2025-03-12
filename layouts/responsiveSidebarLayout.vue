<template>
  <div class="layout">
    <div
      v-if="isSmallScreen && !isCollapsed"
      class="sidebar-overlay"
      @click="collapse"
    ></div>
    <NavSidebar
      class="layout-sidebar"
      :class="{ collapsed: isCollapsed, 'mobile-sidebar': isSmallScreen }"
      @collapse="collapse"
    />
    <div class="layout-content" :class="{ expanded: isCollapsed }">
      <NavHeader class="layout-header" @returnBack="collapse" :collapsed="collapsed" />
      <main class="layout-main">
        <div class="slot-container">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

const isCollapsed = ref(false);
const collapsed = ref(false);
const isSmallScreen = ref(false);

function collapse() {
  collapsed.value = !collapsed.value;
  isCollapsed.value = !isCollapsed.value;
}

function checkScreenWidth() {
  isSmallScreen.value = window.innerWidth <= 768;
  if (window.innerWidth <= 1200) {
    isCollapsed.value = true;
    collapsed.value = true;
  } else if (window.innerWidth > 1200) {
    isCollapsed.value = false;
    collapsed.value = false;
  }
}

onMounted(() => {
  checkScreenWidth();
  window.addEventListener("resize", checkScreenWidth);
});

onUnmounted(() => {
  window.removeEventListener("resize", checkScreenWidth);
});
</script>

<style >
.layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}
.slot-container {
  max-width: 90%;
  width: 100%;
  margin: 0 auto;
}
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 35;
  cursor: pointer;
}

.layout-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 40;
  width: 270px;
  height: 100vh;
  transition: transform 0.3s ease-in-out;
}

.layout-sidebar.collapsed {
  transform: translateX(-100%);
}

.mobile-sidebar {
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);
}

.layout-content {
  width: calc(100% - 270px);
  display: flex;
  justify-content: end;
  flex-direction: column;
  height: 100vh;
  margin-left: 270px;
  background-color: #f3f7ff;
  transition: margin-left 0.3s ease-in-out, width 0.3s ease-in-out;
}

.layout-content.expanded {
  width: 100%;
  margin-left: 0;
}

.layout-header {
  position: sticky;
  top: 0;
  width: 100%;
  z-index: 30;
}

.layout-main {
  height: calc(100vh - 81px);
  width: 100%;
  margin: auto;
  overflow-y: auto;
  padding: 20px 0px 100px 0px;
}

@media (max-width: 768px) {
  .layout-content {
    width: 100%;
    margin-left: 0;
  }

  .mobile-sidebar {
    z-index: 50;
  }

  .layout-content.expanded {
    margin-left: 0;
    width: 100%;
  }
}
</style>
