import {Locale} from "./PropsType";

let runTimeLocale: Locale;
const changeRunTimeLocale = (locale: Locale) => {
    runTimeLocale = locale;
};

export const getRunTimeLocale = () => runTimeLocale;

export const Theme = {light: 'light', dark: 'dark', red:"red",green:"green", blue: 'blue',};
