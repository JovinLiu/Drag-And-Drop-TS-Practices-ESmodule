import { something } from "./base-component.js";
//如果使用default export导出时，导入时可以随意改名，不需要as
import Cmp from "./base-component.js";
//grouping来避免name collision
import * as Validation from "../util/validation.js";
//用aliases来避免name collision
import { autobind as bind } from "../decorators/autobind.js";
import { projectState } from "../state/project-state.js";

console.log(something);
// ProjectInput Class
//声明T和U是Div和Form
export class ProjectInput extends Cmp<HTMLDivElement, HTMLFormElement> {
  //选择mount之后的表单中的三个input元素
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    //·选择titleinput， descriptioninput，peopleInput，由于是通过选择ID选择的，需要使用type casting声明是他们的类型
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.configure();
  }

  //·设置事件监听
  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }

  renderContent() {}

  //返回的是union type： tuple ｜ void
  private gatherUserInput(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    //·声明validate的option
    const titleValidatable: Validation.Validatable = {
      value: enteredTitle,
      required: true,
    };

    const descriptionValidatable: Validation.Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validation.Validatable = {
      value: +enteredPeople,
      required: true,
      min: 1,
      max: 5,
    };

    if (
      //validate会返回true或者false
      !Validation.validate(titleValidatable) ||
      !Validation.validate(descriptionValidatable) ||
      !Validation.validate(peopleValidatable)
    ) {
      alert("Invalid input, please try again!");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }
  }

  private clearInputs() {
    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }

  //·submitHandler的this不指向class，而是当前的event。需要添加autobind method decorator
  @bind
  private submitHandler(event: Event) {
    event.preventDefault();
    const userInput = this.gatherUserInput();
    if (Array.isArray(userInput)) {
      const [title, desc, people] = userInput;
      //·这里因为projectState被实例化了，在就可以在任何地方都可以调用这个state object，运用其中的方法，添加title, desc, people
      projectState.addProject(title, desc, people);
      this.clearInputs();
    }
  }
}
