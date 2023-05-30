const LOCAL_STORAGE_KEY = "failybank-theme";
const DARK_THEME = "dark";
const LIGHT_THEME = "light";

export class ThemeSwitch {
  constructor(inputElement) {
    this.inputElement = inputElement;
    this.handleLocalTheme();
    this.inputElement.addEventListener("change", this.handleInputChange.bind(this));
  }

  addDarkClass() {
    if (!document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.add("dark");
    }
  }

  removeDarkClass() {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
    }
  }

  saveLocalTheme(theme) {
    const localTheme = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY)
    );
    if (localTheme !== theme) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(theme));
    }
  }

  handleLocalTheme() {
    const localTheme = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY)
    );
    const userThemeIsDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (
      localTheme === DARK_THEME ||
      (!localTheme && userThemeIsDark)
    ) {
      this.inputElement.checked = true;
      this.addDarkClass();
      this.saveLocalTheme(DARK_THEME);
    } else {
      this.removeDarkClass();
      this.saveLocalTheme(LIGHT_THEME);
    }
  }

  handleInputChange() {
    if (this.inputElement.checked) {
      this.addDarkClass();
      this.saveLocalTheme(DARK_THEME);
    } else {
      this.removeDarkClass();
      this.saveLocalTheme(LIGHT_THEME);
    }
  }
}