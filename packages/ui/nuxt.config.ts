// Shared UI component layer — extended by packages/base's consumers (admin, web).
// Add reusable presentational components under ./components (e.g. VButton.vue).
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const currentDir = dirname(fileURLToPath(import.meta.url));

export default defineNuxtConfig({
  components: [
    {
      path: join(currentDir, "components"),
    },
  ],
});
