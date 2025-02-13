import { createApp } from "vue";
import "flowbite";
import "flowbite-vue";

import App from "./App.vue";
import { createPinia } from "pinia";
import router from "./routers/index";
// import tailwind css
import "./assets/main.css";
import axios from "axios";
window.axios = axios;
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";

library.add(fas, fab, far);
const app = createApp(App);
const pinia = createPinia();

app.component("font-awesome-icon", FontAwesomeIcon);
app.use(router);
app.use(pinia);
app.mount("#app");
