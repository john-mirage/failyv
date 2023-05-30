class WebInvestigation extends HTMLElement {
  #isMounted = false;
  #template;

  constructor() {
    super();
    const template = document.getElementById("template-web-investigation");
    this.#template = template.content.cloneNode(true);
  }

  connectedCallback() {
    if (!this.#isMounted) {
      this.classList.add("webInvestigation");
      this.append(this.#template);
      this.#isMounted = true;
    }
  }
}

export default WebInvestigation;
