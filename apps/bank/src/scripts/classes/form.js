export class Form {
  constructor(inputElements, formElement, buttonElement) {
    this.inputElements = inputElements;
    this.formElement = formElement;
    this.buttonElement = buttonElement;
    this.buttonIsActive = false;
    this.inputElements.forEach((inputElement) => {
      inputElement.addEventListener("input", this.checkFields.bind(this));
    });
  }

  checkFields() {
    const fieldsAreValid = this.inputElements.every((field) => field.validity.valid);
    if (fieldsAreValid && !this.buttonIsActive) {
      this.activateSubmitButton();
    } else if (!fieldsAreValid && this.buttonIsActive) {
      this.deactivateSubmitButton();
    }
  }

  reset() {
    this.formElement.reset();
    this.deactivateSubmitButton();
  }

  activateSubmitButton() {
    this.buttonIsActive = true;
    const oldClass = this.buttonElement.dataset.disabledClass;
    const newClass = this.buttonElement.dataset.activeClass;
    this.buttonElement.classList.replace(oldClass, newClass);
    this.buttonElement.removeAttribute("disabled");
  }

  deactivateSubmitButton() {
    this.buttonIsActive = false;
    const oldClass = this.buttonElement.dataset.activeClass;
    const newClass = this.buttonElement.dataset.disabledClass;
    this.buttonElement.classList.replace(oldClass, newClass);
    this.buttonElement.setAttribute("disabled", "");
  }
}
