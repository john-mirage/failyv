import WebSwitch from "../web-switch";

const LOCAL_STORAGE_KEY = "failyv-mode";
const WINDOW_MODE = "window";
const SCREEN_MODE = "screen";

class WebModeSwitch extends WebSwitch {
  #hasBeenMountedOnce = false;

  static get observedAttributes() {
    return [...super.observedAttributes, "data-mode"];
  }

  constructor() {
    super();
    this.handleInputChangeEvent = this.handleInputChangeEvent.bind(this);
  }

  get localMode() {
    const localstorageMode = JSON.parse(
      localStorage.getItem(LOCAL_STORAGE_KEY)
    );
    if (localstorageMode === SCREEN_MODE) {
      return SCREEN_MODE;
    } else {
      return WINDOW_MODE;
    }
  }

  set localMode(newLocalMode) {
    localStorage.setItem(
      LOCAL_STORAGE_KEY,
      JSON.stringify(newLocalMode === SCREEN_MODE ? SCREEN_MODE : WINDOW_MODE)
    );
  }

  get mode() {
    return this.dataset.mode;
  }

  set mode(newMode) {
    if (typeof newMode === "string") {
      this.dataset.mode = newMode;
    } else {
      this.removeAttribute("data-mode");
    }
  }

  connectedCallback() {
    super.connectedCallback();
    this.upgradeProperty("mode");
    if (!this.#hasBeenMountedOnce) {
      this.mode = this.localMode;
      if (this.mode === SCREEN_MODE) this.inputElement.checked = true;
      this.label = "Mode plein écran";
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

  sendAppModeEvent(newMode) {
    if (typeof newMode === "string") {
      const customEvent = new CustomEvent("app-mode", {
        bubbles: true,
        detail: { mode: newMode },
      });
      this.dispatchEvent(customEvent);
    } else {
      throw new Error("The new mode is not a string");
    }
  }

  attributeChangedCallback(name, _oldValue, newValue) {
    super.attributeChangedCallback(name, _oldValue, newValue);
    switch (name) {
      case "data-mode": {
        if (newValue === SCREEN_MODE) {
          this.sendAppModeEvent(SCREEN_MODE);
          this.localMode = SCREEN_MODE;
        } else {
          this.sendAppModeEvent(WINDOW_MODE);
          this.localMode = WINDOW_MODE;
        }
        break;
      }
    }
  }

  handleInputChangeEvent() {
    if (this.inputElement.checked) {
      this.mode = SCREEN_MODE;
    } else {
      this.mode = WINDOW_MODE;
    }
  }
}

export default WebModeSwitch;
