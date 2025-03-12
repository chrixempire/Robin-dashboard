<template>
  <nav class="sidebar">
    <div class="logo-container">
      <div class="logo">
        <ILogo class="ILogo" :fontControlled="false" />
        <p class="app-name">App Name</p>
      </div>
      <div class="circle flex" @click="collapse">
        <IVector class="IVector" :fontControlled="false" />
      </div>
    </div>
    <div class="sidebar-content">
      <ul class="sections-container">
        <li v-for="menu in menuSections" :key="menu.name">
          <NuxtLink v-if="menu.isLink" :to="menu.link" :class="{ active: $route.path.startsWith(menu.link) }" class="sidebar-item">
            <img :src="`/svg/${menu.icon}.svg`" alt="" class="icon" />
            {{ menu.name }}
          </NuxtLink>
          <div v-else class="sidebar-item disabled">
            <img :src="`/svg/${menu.icon}.svg`" alt="" class="icon" />
            {{ menu.name }}
          </div>
        </li>
      </ul>
      <div class="lower-section-container">
        <div class="hr"></div>
        <div class="lower-section-content">
          <div class="sidebar-item disabled">
            <img src="/svg/colapse.svg" alt="" class="icon" />
            Collapse
          </div>
          <div class="sidebar-item feedback disabled">
            <img src="/svg/feedback.svg" alt="" class="icon" />
            Give Feedback
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { ILogo, IVector } from "~/components/svg";

const emit = defineEmits(['collapse'])
const router = useRouter();

const menuSections = computed(() => [
  { name: "Get started", link: "", icon: "get-started", isLink: false },
  { name: "Analytics", link: "/analytics", icon: "analytics", isLink: true },
  { name: "Chat", link: "/chat", icon: "chart", isLink: true },
  { name: "Moderation", link: "", icon: "moderation", isLink: false },
  { name: "API & Auth Keys", link: "", icon: "api-auth-keys", isLink: false },
  { name: "Announcement", link: "", icon: "announcement", isLink: false },
]);

function collapse(){
  emit('collapse')
}

</script>

<style scoped>
.sidebar {
  max-width: 270px;
  width: 100%;
  height: 100vh;
  background-color: white;
  padding-top: 37px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.logo-container {
  padding-left: 50px;
  display: flex;
  align-items: center;
  justify-content: start;
  gap: 39px;
}
.ILogo {
  width: 123px;
  height: 33px;
}
.IVector {
  width: 24px;
  height: 24px;
}
.circle {
  background: #e5e8ee;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: start;
  gap: 51px;
  padding: 0 29px;
}

.sections-container {
  display: flex;
  flex-direction: column;
  gap: 34px;
  padding-left: 21px;
}

.sidebar-item {
  display: flex;
  align-items: center;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  gap: 16px;
  transition: background-color 0.3s, color 0.3s;
  color: #9999bc;
  text-decoration: none;
}
.sidebar-item:hover, .sidebar-item.active {
  color: #ea8d51;
}
.sidebar-item:hover .icon, .sidebar-item.active .icon {
  filter: brightness(0) saturate(100%) invert(59%) sepia(64%) saturate(343%) hue-rotate(345deg) brightness(97%) contrast(96%);
}
.sidebar-item.disabled {
  cursor: not-allowed;
  pointer-events: none;
}

.lower-section-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.lower-section-content {
  display: flex;
  flex-direction: column;
  gap: 130px;
  padding-left: 21px;
}

.app-name {
  font-weight: 400;
  font-size: 12px;
  line-height: 24px;
  color: #8d9091;
}

.icon {
  width: 20px;
  height: 20px;
}

.feedback {
  color: #d53120;
}

ul li {
  list-style: none;
}
</style>
