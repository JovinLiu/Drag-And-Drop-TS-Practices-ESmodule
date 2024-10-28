/// <reference path='base-component.ts' />
/// <reference path='../models/drag-drop.ts' />
/// <reference path='../models/project.ts' />
/// <reference path='../state/project-state.ts' />
/// <reference path='../decorators/autobind.ts' />

namespace App {
  // ProjectList Class
  //·用来渲染两个列表
  export class ProjectList
    //声明T和U为div和html element
    extends Component<HTMLDivElement, HTMLElement>
    implements DragTarget
  {
    //这里的Project[]是从上面的class定义来的，这个是一个object[]，其中的每个object长得都和Project一样
    //就像之前type Vehicle = Car | Truck一样 这个type是由两个class构成的
    assignedProjects: Project[];

    constructor(private type: "active" | "finished") {
      //创建ProjectList的时候，是个argument分别代表：模版ID，渲染的目标ID，是否在开始的地方插入，新元素的ID
      super("project-list", "app", false, `${type}-projects`);

      this.assignedProjects = [];
      this.configure();
      this.renderContent();
    }

    @autobind
    dragOverHandler(event: DragEvent) {
      if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
        event.preventDefault();
        const listEl = this.element.querySelector("ul")!;
        listEl.classList.add("droppable");
      }
    }

    @autobind
    dropHandler(event: DragEvent) {
      const prjId = event.dataTransfer!.getData("text/plain");
      projectState.moveProject(
        prjId,
        this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
      );
    }

    @autobind
    dragLeaveHandler(_: DragEvent) {
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.remove("droppable");
    }

    configure() {
      this.element.addEventListener("dragover", this.dragOverHandler);
      this.element.addEventListener("dragleave", this.dragLeaveHandler);
      this.element.addEventListener("drop", this.dropHandler);

      //register listener
      //把这个function放入Listener array
      projectState.addListener((projects: Project[]) => {
        const relevantProjects = projects.filter((prj) => {
          if (this.type === "active") {
            return prj.status === ProjectStatus.Active;
          }
          return prj.status === ProjectStatus.Finished;
        });
        this.assignedProjects = relevantProjects;
        this.renderProjects();
      });
    }

    //渲染空的list
    renderContent() {
      //声明ID，添加样式
      const listId = `${this.type}-projects-list`;
      this.element.querySelector("ul")!.id = listId;
      //添加Header
      this.element.querySelector("h2")!.textContent =
        this.type.toUpperCase() + " PROJECTS";
    }

    private renderProjects() {
      const listEl = document.getElementById(
        `${this.type}-projects-list`
      )! as HTMLUListElement;
      listEl.innerHTML = "";
      for (const prjItem of this.assignedProjects) {
        //给每一个project创建new projectItem
        new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
      }
    }
  }
}
