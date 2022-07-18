import { createApp } from "vue";
import VueWidget from "./components/VueWidget.vue";

const filters = document.querySelectorAll(".filter");

filters.forEach((filter) => {
  const app = createApp({
    ...VueWidget,
    dataset: { ...filter.dataset },
  });

  app.mount(filter);
});
