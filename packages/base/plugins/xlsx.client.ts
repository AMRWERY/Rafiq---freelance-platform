import * as XLSX from "xlsx";

export default defineNuxtPlugin(() => {
  return {
    provide: {
      xlsx: XLSX,
    },
  };
});
