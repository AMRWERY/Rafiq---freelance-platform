import { defineRule, configure } from "vee-validate";
import {
  required,
  min,
  max,
  alpha_spaces,
  regex,
  email,
  between,
  numeric,
  length,
  min_value,
  max_value,
  integer,
} from "@vee-validate/rules";
import { localize, setLocale } from "@vee-validate/i18n";
import en from "@vee-validate/i18n/dist/locale/en.json";
import ar from "@vee-validate/i18n/dist/locale/ar.json";

// The stock English messages all start with "The {field} field ...". Drop that
// leading "The" so messages read as "{field} field ..." instead.
const stripLeadingThe = (messages: Record<string, string>) =>
  Object.fromEntries(
    Object.entries(messages).map(([key, message]) => [
      key,
      message.replace(/^The /, ""),
    ]),
  );

export default defineNuxtPlugin((nuxtApp) => {
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);
  defineRule("max", max);
  defineRule("alpha_spaces", alpha_spaces);
  defineRule("regex", regex);
  defineRule("between", between);
  defineRule("numeric", numeric);
  defineRule("length", length);
  defineRule("min_value", min_value);
  defineRule("max_value", max_value);
  defineRule("integer", integer);

  configure({
    generateMessage: localize({
      en: { ...en, messages: stripLeadingThe(en.messages) },
      ar,
    }),
    validateOnBlur: true,
    validateOnChange: false,
    validateOnInput: true,
    validateOnModelUpdate: true,
  });

  if (import.meta.client) {
    const i18n = nuxtApp.$i18n as any;
    setLocale(i18n.locale.value);
    watch(
      () => i18n.locale.value,
      (newLocale: string) => setLocale(newLocale),
    );
  }
});