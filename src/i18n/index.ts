import { en } from "./en";
import { am } from "./am";
import { om } from "./om";
import { ti } from "./ti";

export type Language = "en" | "am" | "om" | "ti";

export type Translations = typeof en;

export const translations: Record<Language, Translations> = { en, am, om, ti };
