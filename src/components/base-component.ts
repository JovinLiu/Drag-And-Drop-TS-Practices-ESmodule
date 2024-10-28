namespace App {
  // Component Base Class
  // 这里的component后面要被projectsItem，projectsList，projectsInput继承，这些子class中带有具体实现具体功能的方法和属性，所以这里component实际上提供了最抽象最通用的方法和属性。
  // 表单和list都有相似的部分，这里创建一个abstract class，标记成抽象class，不允许实例化。
  //T和U是某个类型的HTMLElement，但是不确定具体是什么类型，可以使用泛型声明是某种HTMLElement，然后后面继承的时候制定具体是哪种HTML element
  export abstract class Component<
    T extends HTMLElement,
    U extends HTMLElement
  > {
    //模版元素
    //这个模版的类型是确定的，一定是template，所以不需要使用泛型
    templateElement: HTMLTemplateElement;
    //目标元素
    hostElement: T;
    //要被渲染的element
    element: U;

    constructor(
      templateId: string,
      hostElementId: string,
      insertAtStart: boolean,
      newElementId?: string
    ) {
      //初始化获得模版元素
      this.templateElement = document.getElementById(
        templateId
      )! as HTMLTemplateElement;
      //初始化获得目标元素
      this.hostElement = document.getElementById(hostElementId)! as T;

      //·声明要导入的片段，true代表deep clone，所有的子element都会被导入进去。但是下面的attach方法无法访问到constructor内部的变量，所以在field中声明element
      const importedNode = document.importNode(
        this.templateElement.content,
        true
      );
      //·声明element之后赋值
      this.element = importedNode.firstElementChild as U;

      if (newElementId) {
        //给模版添加个id，添加样式
        this.element.id = newElementId;
      }

      //onMount一个元素
      this.attach(insertAtStart);
    }

    //·hostElement是目标的位置，在目标位置用insertAdjacentElement插入模版片段
    private attach(insertAtBeginning: boolean) {
      this.hostElement.insertAdjacentElement(
        insertAtBeginning ? "afterbegin" : "beforeend",
        this.element
      );
    }

    //声明下面两个方法，但都是abstract方法，强迫子class必须有继承这两个方法，提供具体的操作。用于继承后overwrite
    abstract configure(): void;
    abstract renderContent(): void;
  }
}
