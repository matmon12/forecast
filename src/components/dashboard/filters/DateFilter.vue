<template>
  <div class="datefilter">
    <DatePicker
      v-model="date"
      date-format="dd.mm.y"
      show-icon
      fluid
      :show-on-focus="false"
      :manual-input="false"
      :min-date="minDate"
      :max-date="maxDate"
      showButtonBar
      selection-mode="range"
      @date-select="emits('dateSelect')"
      @clear-click="(date = ''), emits('clearClick')"
      placeholder="Select date"
      :pt="{
        ...getClasses('dashboard').datepicker,
        pcInput: getClasses('dashboard-datepicker').inputtext,
      }"
    />
  </div>
</template>

<script setup>
import { ref, defineProps, defineModel, defineEmits } from "vue";
import DatePicker from "primevue/datepicker";
import { getClasses } from "@/utils/classes";

const date = defineModel();

const emits = defineEmits(["dateSelect", "clearClick"]);

const minDate = ref(new Date());
const maxDate = ref(new Date());

// datepicker
const setMinMaxDate = () => {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  const startMonth = month;
  const startYear = year - 1;
  const endMonth = month;
  const endYear = year;

  minDate.value.setMonth(startMonth);
  minDate.value.setFullYear(startYear);
  maxDate.value.setMonth(endMonth);
  maxDate.value.setFullYear(endYear);
};
setMinMaxDate();
</script>

<style lang="scss" scoped>
.datefilter {
  height: 100%;
}
:deep() {
  .dashboard {
    &-datepicker {
      height: 100%;

      &-inputtext {
        border-color: var(--grey-740);
        background-color: var(--grey-1050);
        font-size: 13px;
        overflow: visible;
        padding: 10px;
        color: var(--white);

        &::placeholder {
          color: var(--placeholder-filter);
          font-size: 14px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.dashboard {
  &-datepicker {
    &-dropdown {
      border-color: var(--grey-740);
      background-color: var(--grey-920);
    }
    &-dropdown-icon {
    }
    &-input-icon-container {
    }
    &-input-icon {
    }
    &-panel {
      background-color: var(--modal);
    }
    &-calendar-container {
    }
    &-calendar {
    }
    &-header {
      height: 40px;
      background-color: var(--modal);
    }
    &-prev-button {
    }
    &-title {
      font-size: 14px;
    }
    &-select-month {
      width: 100px;
      color: var(--white);
      &:enabled:hover {
        background: var(--grey-970);
        color: var(--white);
      }
    }
    &-select-year {
      color: var(--white);
      &:enabled:hover {
        background: var(--grey-970);
        color: var(--white);
      }
    }
    &-decade {
      color: var(--white);
    }
    &-day-view {
      font-size: 14px;
      margin: 5px 0;
    }

    &-container {
    }
    &-table {
    }
    &-tableheader {
    }
    &-tableheader-row {
      display: flex;
      justify-content: space-between;
    }
    &-weekheader {
    }
    &-weekheader-label {
    }
    &-tableheader-cell {
    }
    &-weekday-cell {
    }
    &-weekday {
      color: var(--blue-340);
    }
    &-table-body {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
    &-table-body-row {
      display: flex;
      justify-content: space-between;
    }
    &-weeknumber {
    }
    &-weeklabel-container {
    }
    &-day-cell {
      padding: 0;
      &.p-datepicker-today {
        .dashboard-datepicker-day {
          background: var(--grey-770);
          color: #fff;
        }
      }
    }
    &-day {
      height: 28px;
      width: 28px;
      margin: 0;
      color: var(--white);

      &.p-datepicker-day-selected {
        background-color: var(--blue-100);
        color: #000;
        font-weight: 500;
      }
      &.p-datepicker-day-selected-range {
        background: var(--blue-100);
        filter: brightness(var(--brightness-range));
        color: #000;
      }
      &:not(.p-datepicker-day-selected):not(.p-disabled):hover {
        background: var(--grey-970);
        color: var(--white);
      }
    }
    &-month-view {
      margin: 5px 0;
    }
    &-month {
      font-size: 14px;
      padding: 3px;
      color: var(--white);

      &.p-datepicker-month-selected {
        background: var(--blue-100);
        color: #000;
      }

      &:not(.p-disabled):not(.p-datepicker-month-selected):hover {
        color: var(--white);
        background: var(--grey-970);
      }
    }
    &-year-view {
      margin: 5px 0;
    }
    &-year {
      font-size: 14px;
      color: var(--white);

      &.p-datepicker-year-selected {
        background: var(--blue-100);
        color: #000;
      }

      &:not(.p-disabled):not(.p-datepicker-year-selected):hover {
        color: var(--white);
        background: var(--grey-970);
      }
    }
    &-time-picker {
    }
    &-hour-picker {
    }
    &-hour {
    }
    &-separator-container {
    }
    &-separator {
    }
    &-minute-picker {
    }
    &-minute {
    }
    &-second-picker {
    }
    &-second {
    }
    &-ampm-picker {
    }
    &-ampm {
    }
    &-buttonbar {
      .p-button {
        padding: 3px 10px;
      }
      .p-datepicker-today-button {
        color: var(--placeholder-filter);
        &:not(:disabled):hover {
          background: var(--grey-970);
          color: var(--placeholder-filter);
        }
      }
      .p-datepicker-clear-button {
        background-color: var(--blue-100);
        color: #000;
        transition: filter 0.3s;
        &:hover {
          filter: brightness(1.1);
        }
      }
    }
    &-increment-button {
    }
    &-decrement-button {
    }
    &-today-button {
    }
    &-clear-button {
    }
    &-hidden-selectedday {
    }
    &-hidden-month {
    }
    &-hidden-year {
    }
  }
}
.p-datepicker-next-button,
.p-datepicker-prev-button {
  height: 35px;
  width: 35px;
  color: var(--placeholder-filter);
  svg {
    width: 15px;
    height: 15px;
  }
  &:not(:disabled):hover {
    background: var(--grey-970);
    color: var(--placeholder-filter);
  }
}
</style>
