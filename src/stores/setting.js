import { defineStore } from "pinia";
import { ref } from "vue";
import { getFarTemp, mbToMmHg, kphToMph } from "@/utils";

export const useSettingStore = defineStore("setting", () => {
  const units = ref({
    temp: "temp_c",
    wind: "wind_mps",
    pressure: "pressure_mmHg",
  });

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

  return {
    units,
    getTemp,
    getUnitTemp,
    getPressure,
    getUnitWind,
    getWind,
    getUnitPressure,
    getUnitsUser,
  };
});
