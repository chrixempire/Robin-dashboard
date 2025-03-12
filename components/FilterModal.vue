<template>
  <div v-if="isOpen" class="modal-container">
    <div class="modal-overlay" @click="closeModal"></div>
    <div class="modal-content" :class="{ 'slide-in': isOpen, 'slide-out': isClosing }">
      <div class="modal-header">
        <h2 class="modal-title">Filter Table</h2>
        <button class="close-button" @click="closeModal">×</button>
      </div>
      
      <div class="modal-body">
        <div class="time-filters">
          <button 
            v-for="period in timePeriods" 
            :key="period.value" 
            :class="['time-filter-btn', { active: selectedTimePeriod === period.value }]"
            @click="selectedTimePeriod = period.value"
          >
            {{ period.label }}
          </button>
        </div>
        
        <div class="date-filters">
          <div class="date-field">
            <label for="dateFrom">Date From</label>
            <div class="select-wrapper">
              <input 
                type="date" 
                id="dateFrom" 
                v-model="dateFrom" 
                class="date-input"
              />
              
            <span class="select-arrow">▼</span>
            </div>
          </div>
          
          <div class="date-field">
            <label for="dateTo">Date To</label>
            <div class="select-wrapper">
              <input 
                type="date" 
                id="dateTo" 
                v-model="dateTo" 
                class="date-input"
              />
              
            <span class="select-arrow">▼</span>
            </div>
          </div>
        </div>
        
        <div class="filter-field">
          <label for="messages">Messages</label>
          <div class="select-wrapper">
            <select id="messages" v-model="selectedMessages">
              <option value="" disabled>Please Select</option>
              <option v-for="option in messageOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <span class="select-arrow">▼</span>
          </div>
        </div>
        
        <div class="filter-field">
          <label for="mediaStorage">Media Storage Used</label>
          <div class="select-wrapper">
            <select id="mediaStorage" v-model="selectedMediaStorage">
              <option value="" disabled>Please Select</option>
              <option v-for="option in mediaStorageOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
            <span class="select-arrow">▼</span>
          </div>
        </div>
      </div>
      
      <div class="modal-footer">
        <button class="filter-button" @click="applyFilters">Filter Table</button>
        <button class="clear-button" @click="clearFilters">Clear Filter</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'apply-filters']);
const isOpen = ref(props.modelValue);
const isClosing = ref(false);
const selectedTimePeriod = ref('today');
const dateFrom = ref('');
const dateTo = ref('');
const selectedMessages = ref('');
const selectedMediaStorage = ref('');

const timePeriods = [
  { label: 'Today', value: 'today' },
  { label: 'Last 7 days', value: 'last7days' },
  { label: 'This month', value: 'thisMonth' },
  { label: 'Last 3 months', value: 'last3months' }
];

const messageOptions = [
  { label: '0 - 500 Messages', value: '0-500' },
  { label: '500 - 2000 Messages', value: '500-2000' },
  { label: '2000+ Messages', value: '2000+' }
];

const mediaStorageOptions = [
  { label: '0 - 50 MB', value: '0-50' },
  { label: '50 MB - 200MB', value: '50-200' },
  { label: '200MB - 1GB', value: '200-1000' },
  { label: '1GB+', value: '1000+' }
];

function formatDateForInput(date: Date): string  {
  return date.toISOString().split('T')[0]; 
};

function formatDateForDisplay(dateString: string): string{
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} - ${month} - ${year}`;
  } catch (e) {
    console.error('Error formatting date:', e);
    return '';
  }
};

function getToday(): string {
  return formatDateForInput(new Date());
};

function getDaysAgo (days: number): string {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return formatDateForInput(date);
};

function getMonthsAgo (months: number): string {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return formatDateForInput(date);
};

function updateDatesByTimePeriod ()  {
  const today = getToday();
  switch (selectedTimePeriod.value) {
    case 'today':
      dateFrom.value = today;
      dateTo.value = today;
      break;
    case 'last7days':
      dateFrom.value = getDaysAgo(7);
      dateTo.value = today;
      break;
    case 'thisMonth':
      dateFrom.value = getMonthsAgo(1);
      dateTo.value = today;
      break;
    case 'last3months':
      dateFrom.value = getMonthsAgo(3);
      dateTo.value = today;
      break;
  }
  
};

function closeModal () {
  isClosing.value = true;
  setTimeout(() => {
    isOpen.value = false;
    isClosing.value = false;
  }, 300);
};

function applyFilters () {
  const filters = {
    timePeriod: selectedTimePeriod.value,
    dateFrom: dateFrom.value ? formatDateForDisplay(dateFrom.value) : '',
    dateTo: dateTo.value ? formatDateForDisplay(dateTo.value) : '',
    messages: selectedMessages.value,
    mediaStorage: selectedMediaStorage.value
  };
  emit('apply-filters', filters);
  closeModal();
};

function clearFilters (){
  selectedTimePeriod.value = 'today';
  updateDatesByTimePeriod(); 
  selectedMessages.value = '';
  selectedMediaStorage.value = '';

  const clearedFilters = {
    timePeriod: 'today',
    dateFrom: '',
    dateTo: '',
    messages: '',
    mediaStorage: ''
  };
  emit('apply-filters', clearedFilters);
  closeModal();
};

watch(selectedTimePeriod, () => {
  updateDatesByTimePeriod();
});

watch(() => props.modelValue, (newVal) => {
  isOpen.value = newVal;
  if (!newVal) {
    isClosing.value = false;
  }
});

watch(isOpen, (newVal) => {
  emit('update:modelValue', newVal);
});

onMounted(() => {
  updateDatesByTimePeriod();
});
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  z-index: 50;
}

.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 51;
}

.modal-content {
  position: relative;
  max-width: 590px;
  width:100%;
  height: 100%;
  background-color: white;
  z-index: 52;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transform: translateX(100%);
  display: flex;
  flex-direction: column;
}

.slide-in {
  animation: slideIn 0.3s forwards;
}

.slide-out {
  animation: slideOut 0.3s forwards;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes slideOut {
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 40px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 18px;
  font-weight: 500;
  margin: 0;
  color: #000;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #ff3b30;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-body {
  padding: 20px 40px;
  flex-grow: 1;
}

.time-filters {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
}

.time-filter-btn {
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  background: white;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  color: #333;
}

.time-filter-btn.active {
  border-color: #ff9500;
  color: #ff9500;
}

.date-filters {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.date-field {
  flex: 1;
}

.filter-field {
  margin-bottom: 20px;
}

label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 8px;
}

.select-wrapper {
  position: relative;
}

input, select {
  width: 100%;
  padding: 12px 16px;
  border-radius: 6px;
  border: 1px solid #9999BC;
  background-color: #F5F7FC;
  font-size: 14px;
  color: #333;
  appearance: none;
}

input::placeholder, select option:first-child {
  color: #999;
}

.select-arrow {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 10px;
  color: #999;
  pointer-events: none;
}

.modal-footer {
  padding: 20px 40px 40px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin-top: auto;
}

.filter-button {
  width: 85%;
  padding: 14px;
  background-color: #4169e1;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
}

.clear-button { 
  width: 85%;
  padding: 14px;
  border-radius: 25px;
  background: none;
  border: none;
  color: #666;
  font-size: 14px;
  cursor: pointer;
}

.clear-button:hover {
  background: #d3d3d3; 
  color: #ffffff; 
}


@media (max-width: 768px) {
  .modal-content {
    width: 70%;
  }
}

@media (max-width: 480px) {
  .modal-content {
    width: 90%;
  }
  
  .date-filters {
    flex-direction: column;
  }
}

.date-input {
  width: 100%;
  padding: 12px 16px;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  background-color: #f5f3ff;
  font-size: 14px;
  color: #333;
  appearance: none;
}

.date-input::-webkit-calendar-picker-indicator {
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  cursor: pointer;
}
</style>