const normalTemplate = document.getElementById("favorite-account-normal-template");
const editTemplate = document.getElementById("favorite-account-edit-template");
const pasteTemplate = document.getElementById("favorite-account-paste-template");

/**
 * This class is used to create a favorite account that allow you to get 3 "views":
 * - Normal view
 * - Edit view
 * - Paste view
 *
 * The views are used by the lists for display specific HTML elements.
 *
 * @class
 */
export class FavoriteAccount {

  /**
   * @constructor
   * @param name {string} - The favorite account name.
   * @param number {string} - The favorite account number.
   */
  constructor(
    name,
    number
  ) {
    this.name = name;
    this.number = number;
    this.normalElement = false;
    this.editElement = false;
    this.pasteElement = false;
    this.isListenedForEditList = false;
    this.isListenedForPasteList = false;
  }

  /**
   * Get the HTML element of the normal view.
   *
   * @return {HTMLElement} - The HTML element of the view.
   */
  getNormalView() {
    if (!this.normalElement) {
      const fragment = normalTemplate.content.cloneNode(true);
      const element = fragment.querySelector(".favorite-account");
      const nameElement = element.querySelector('[data-name="account-owner"]');
      const numberElement = element.querySelector('[data-name="account-number"]');
      nameElement.textContent = this.name;
      numberElement.textContent = this.number;
      this.normalElement = element;
      return this.normalElement;
    }
    return this.normalElement;
  }

  /**
   * Get the HTML element of the edit view.
   *
   * @return {HTMLElement} - The HTML element of the view.
   */
  getEditView() {
    if (!this.editElement) {
      const fragment = editTemplate.content.cloneNode(true);
      this.editElement = fragment.querySelector(".favorite-account");
      return this.editElement;
    }
    return this.editElement;
  }

  /**
   * Get the HTML element of the paste view.
   *
   * @return {HTMLElement} - The HTML element of the view.
   */
  getPasteView() {
    if (!this.pasteElement) {
      const fragment = pasteTemplate.content.cloneNode(true);
      const element = fragment.querySelector(".favorite-account");
      const nameElement = element.querySelector('[data-name="favorite-account-name"]');
      const numberElement = element.querySelector('[data-name="favorite-account-number"]');
      nameElement.textContent = this.name;
      numberElement.textContent = this.number;
      this.pasteElement = element;
      return this.pasteElement;
    }
    return this.pasteElement;
  }
}