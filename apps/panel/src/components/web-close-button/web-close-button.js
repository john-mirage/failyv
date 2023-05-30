import WebButton from "../web-button";

class WebCloseButton extends WebButton {
  static get observedAttributes() {
    return [...super.observedAttributes];
  }

  constructor() {
    super();
    this.handleButtonClickEvent = this.handleButtonClickEvent.bind(this);
  }

  connectedCallback() {
    super.connectedCallback();
    this.buttonElement.addEventListener("click", this.handleButtonClickEvent);
  }

  disconnectedCallback() {
    this.buttonElement.removeEventListener(
      "click",
      this.handleButtonClickEvent
    );
  }

  handleButtonClickEvent() {
    const customEvent = new CustomEvent("app-shutdown", {
      bubbles: true,
    });
    this.dispatchEvent(customEvent);
  }
}

export default WebCloseButton;
