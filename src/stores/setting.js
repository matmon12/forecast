import { defineStore } from "pinia";
import { ref } from "vue";
import { getFarTemp, mbToMmHg, kphToMph } from "@/utils";
import { utils } from "swapy";

export const useSettingStore = defineStore("setting", () => {
  const savedAddress = ref();
  const defaultUnits = {
    temp: "temp_c",
    wind: "wind_mps",
    pressure: "pressure_mmHg",
  };
  const units = ref({ ...defaultUnits });
  const cards = ref([
    { id: "1", title: "today" },
    { id: "2", title: "highlight" },
    { id: "3", title: "sun" },
    { id: "4", title: "moon" },
  ]);
  const slotItemMap = ref(utils.initSlotItemMap(cards.value, "id"));
  const isDraggable = ref(false);

  const getTemp = (temp) => {
    if (typeof temp === "number") {
      return units.value.temp === "temp_c"
        ? Math.round(temp)
        : Math.round(getFarTemp(temp));
    }
  };

  const getPressure = (pressure) => {
    if (typeof pressure === "number") {
      return units.value.pressure === "pressure_mmHg"
        ? mbToMmHg(pressure)
        : pressure;
    }
  };

  const getWind = (wind) => {
    if (typeof wind === "number") {
      return units.value.wind === "wind_mps"
        ? kphToMph(wind)
        : Math.round(wind);
    }
  };

  const getUnitTemp = () => {
    return units.value.temp === "temp_c" ? "°C" : "°F";
  };

  const getUnitWind = () => {
    return units.value.wind === "wind_mps" ? "mps" : "kph";
  };

  const getUnitPressure = () => {
    return units.value.pressure === "pressure_mmHg" ? "mmHg" : "mb";
  };

  const getUnitsUser = (unitsUser) => {
    if (unitsUser) {
      units.value = { ...unitsUser };
    }
  };

  const getAddressUser = (address) => {
    if (address) {
      savedAddress.value = { ...address };
    }
  };

  const getOrderUser = (order) => {
    if (order) {
      slotItemMap.value = JSON.parse(order);
    }
  };

  const resetSetting = () => {
    slotItemMap.value = utils.initSlotItemMap(cards.value, "id");
    units.value = { ...defaultUnits };
    savedAddress.value = null;
  };

  return {
    units,
    savedAddress,
    getTemp,
    getUnitTemp,
    getPressure,
    getUnitWind,
    getWind,
    getUnitPressure,
    getUnitsUser,
    getAddressUser,
    getOrderUser,
    slotItemMap,
    isDraggable,
    cards,
    resetSetting,
  };
});
