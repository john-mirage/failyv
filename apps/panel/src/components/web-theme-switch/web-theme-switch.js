import WebSwitch from "../web-switch";

const LOCAL_STORAGE_KEY = "failyv-theme";
const LIGHT_THEME = "light";
const DARK_THEME = "dark";

class WebThemeSwitch extends WebSwitch {
  #hasBeenMountedOnce = false;

  static get observedAttributes() {
    return [...super.observedAttributes, "data-theme"];
  }

  constructor() {
    super();
    this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
  }

  get localTheme() {
    const localstorageTheme = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY)
    );
    const userThemeIsDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    if (
      localstorageTheme === DARK_THEME ||
      (!localstorageTheme && userThemeIsDark)
    ) {
      return DARK_THEME;
    } else {
      return LIGHT_THEME;
    }
  }

  set localTheme(newLocalTheme) {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(newLocalTheme === DARK_THEME ? DARK_THEME : LIGHT_THEME)
    );
  }

  get theme() {
    return this.dataset.theme;
  }

  set theme(newTheme) {
    if (typeof newTheme === "string") {
      this.dataset.theme = newTheme;
    } else {
      this.removeAttribute("data-theme");
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.upgradeProperty("theme");
    if (!this.#hasBeenMountedOnce) {
      this.theme = this.localTheme;
      if (this.theme === DARK_THEME) this.inputElement.checked = true;
      this.label = "Mode nuit";
      this.#hasBeenMountedOnce = true;
    }
    this.inputElement.addEventListener("change", this.handleInputChangeEvent);
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener(
      "change",
      this.handleInputChangeEvent
    );
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    super.attributeChangedCallback(name, _oldValue, newValue);
    switch (name) {
      case "data-theme":
        if (newValue === DARK_THEME) {
          document.documentElement.dataset.theme = DARK_THEME;
          this.localTheme = DARK_THEME;
        } else {
          document.documentElement.dataset.theme = LIGHT_THEME;
          this.localTheme = LIGHT_THEME;
        }
        break;
    }
  }

  handleInputChangeEvent() {
    if (this.inputElement.checked) {
      this.theme = DARK_THEME;
    } else {
      this.theme = LIGHT_THEME;
    }
  }
}

export default WebThemeSwitch;
