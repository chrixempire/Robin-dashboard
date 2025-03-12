<template>
  <header class="header">
    <div class="header-left">
      <div class="circle flex" @click="returnBack" v-if="collapsed">
        <IVector
          class="IVector"
          :fontControlled="false"
          :style="{ transform: 'rotate(90deg)' }"
        />
      </div>
      <span class="greeting">Hello Ayomide <span class="wave">👋</span></span>
    </div>

    <div class="header-right">
      <button class="download-btn btn">Download Report</button>

      <div class="profile-section" ref="profileRef">
        <button class="profile-trigger" @click="toggleDropdown">
          <div class="circle flex">
            <p class="ao">AO</p>
          </div>
          <IChevronDown
            class="IChevronDown"
            :fontControlled="false"
            :class="{ rotate: isDropdownOpen }"
            style="width: 8px; height: 8px"
          />
        </button>
        <transition name="slide-fade">
          <div class="dropdown-details" v-if="isDropdownOpen">
            <div class="user-info">
              <p class="user-name">Ayomide Odewale</p>
              <p class="user-role">Frontend developer</p>
            </div>
            <div class="dropdown-divider"></div>
            <button class="dropdown-items">
              <IProfile />
              Profile
            </button>
            <button class="dropdown-items logout">
         
              <ILogout
                class="ILogout"
                :fontControlled="false"
                style="width: 16px; height: 16px"
              />
              Logout
            </button>
          </div>
        </transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { IChevronDown, IProfile, ILogout } from "~/components/svg";
import {  IVector } from "~/components/svg";

defineProps({
  collapsed: {
    type: Boolean,
    required: false,
  },
});

const isDropdownOpen = ref(false);
const profileRef = ref<HTMLElement | null>(null);
const emit = defineEmits(["returnBack"]);

function returnBack() {
  emit("returnBack");
}

function toggleDropdown() {
  isDropdownOpen.value = !isDropdownOpen.value;
};

function handleClickOutside(event: MouseEvent){
  if (profileRef.value && !profileRef.value.contains(event.target as Node)) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 50px;
  background: #f3f7ff;
  border-bottom: 1px solid #e7e9ff;
}

.IVector {
  width: 24px;
  height: 24px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.greeting {
  font-size: 16px;
  color: #9999bc;
  font-weight: 400;
  line-height: 24px;
}

.wave {
  font-size: 18px;
  margin-left: 2px;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.download-btn {
  padding: 4px 35px;
  background: #4f46e5;
  color: white;
  border-radius: 30px;
  font-size: 16px;
  text-align: center;
  line-height: 24px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.download-btn:hover {
  background: #4338ca;
}

.profile-section {
  position: relative;
}

.profile-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #344054;
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

.ao {
  color: #000000;
  font-size: 12px;
  font-weight: 500;
}

.IChevronDown {
  transition: transform 0.2s ease-in-out;
}

.IChevronDown.rotate {
  transform: rotate(180deg);
}

.dropdown-details {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px -2px rgba(16, 24, 40, 0.05),
    0 12px 16px -4px rgba(16, 24, 40, 0.1);
  width: 240px;
  padding: 8px;
  z-index: 50;
}

.user-info {
  padding: 0px 8px;
  display: flex;
  flex-direction: column;
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #344054;
}

.user-role {
  font-size: 12px;
  color: #667085;
  margin-top: 2px;
}

.dropdown-divider {
  height: 1px;
  background: #eaecf0;
  margin: 8px 0;
}

.dropdown-items {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: none;
  border: none;
  border-radius: 6px;
  color: #344054;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.dropdown-items:hover {
  background: #f9fafb;
}

.dropdown-items.logout {
  color: #b42318;
}

.dropdown-items.logout:hover {
  background: #fef3f2;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .download-btn {
    padding: 6px 25px;
    font-size: 14px;
  }
  .header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

}

@media (max-width: 600px) {
  .download-btn {
    padding: 5px 10px;
    font-size: 13px;
    border-radius: 25px;
  }
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    background: #f3f7ff;
    border-bottom: 1px solid #e7e9ff;
  }

  .header-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

}

@media (max-width: 480px) {
  .download-btn {
    padding: 4px;
    font-size: 12px;
    border-radius: 20px;
  }
  .header-right {
  display: flex;
  align-items: center;
  gap: 6px;
}

}
</style>
