import axios from "axios";
import { useSearchStore } from "@/stores/search";

const axiosApiInstance = axios.create();

const apiKey = import.meta.env.VITE_API_KEY_WEATHER;

axiosApiInstance.interceptors.request.use((config) => {
  let params = new URLSearchParams();
  params.append("key", apiKey);
  config.params = params;
  return config;
});

axiosApiInstance.interceptors.response.use(
  (response) => {
    const searchStore = useSearchStore();
    searchStore.error = "";
    return response;
  },
  async function (error) {
    const searchStore = useSearchStore();
    searchStore.error = error.response.data.error.code;
  }
);

export { axiosApiInstance };
