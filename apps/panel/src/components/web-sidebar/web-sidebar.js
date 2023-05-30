class WebSidebar extends HTMLElement {
  #hasBeenMountedOnce = false;
  #template;

  constructor() {
    super();
    const template = document.getElementById("template-web-sidebar");
    this.#template = template.content.cloneNode(true);
  }

  connectedCallback() {
    if (!this.#hasBeenMountedOnce) {
      this.classList.add("webSidebar");
      this.append(this.#template);
      this.#hasBeenMountedOnce = true;
    }
  }
}

export default WebSidebar;
