class WebCarPlate extends HTMLElement {
  #isMounted = false;
  #template;

  constructor() {
    super();
    const template = document.getElementById("template-web-car-plate");
    this.#template = template.content.cloneNode(true);
  }

  connectedCallback() {
    if (!this.#isMounted) {
      this.classList.add("webCarPlate");
      this.append(this.#template);
      this.#isMounted = true;
    }
  }
}

export default WebCarPlate;
