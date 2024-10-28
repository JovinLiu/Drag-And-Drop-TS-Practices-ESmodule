namespace App {
  // Validation
  export interface Validatable {
    value: string | number;
    //·除了value是必须的，这些必须都是optional。
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  }

  //声明validate function
  //声明argument是validate interface
  export function validate(validatableInput: Validatable) {
    let isValid = true;
    if (validatableInput.required) {
      //&&后面添加判断条件
      isValid =
        isValid && validatableInput.value.toString().trim().length !== 0;
    }

    if (
      validatableInput.minLength != null &&
      typeof validatableInput.value === "string"
    ) {
      //&&后面添加判断条件
      isValid =
        isValid && validatableInput.value.length >= validatableInput.minLength;
    }

    if (
      validatableInput.maxLength != null &&
      typeof validatableInput.value === "string"
    ) {
      isValid =
        isValid && validatableInput.value.length <= validatableInput.maxLength;
    }

    if (
      validatableInput.min != null &&
      typeof validatableInput.value === "number"
    ) {
      isValid = isValid && validatableInput.value >= validatableInput.min;
    }

    if (
      validatableInput.max != null &&
      typeof validatableInput.value === "number"
    ) {
      isValid = isValid && validatableInput.value <= validatableInput.max;
    }

    return isValid;
  }
}
