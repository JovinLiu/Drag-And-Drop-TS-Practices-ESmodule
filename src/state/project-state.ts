namespace App {
  // Project State Management
  //泛型方程
  type Listener<T> = (items: T[]) => void;
  //这里给state也创建一个parent class是因为一个项目中可能有很多state类型，这里虽然只用一个project state
  class State<T> {
    //定义一个空数组叫listeners来收集所有的listener function
    //subscription pattern
    protected listeners: Listener<T>[] = [];

    //方法添加listenerFn
    addListener(listenerFn: Listener<T>) {
      this.listeners.push(listenerFn);
    }
  }

  //Project在上面class声明过了
  class ProjectState extends State<Project> {
    //这里的Project[]是从上面的class定义来的，这个是一个object[]，其中的每个object长得都和Project一样
    //就像之前type Vehicle = Car | Truck一样 这个type是由两个class构成的
    private projects: Project[] = [];
    private static instance: ProjectState;

    //singleton pattern
    private constructor() {
      super();
    }

    //利用Singleton Pattern创建一个Global State Management Object
    static getInstance() {
      if (this.instance) {
        return this.instance;
      }
      this.instance = new ProjectState();
      return this.instance;
    }

    //addProject方法用来创建新的item，如果需要添加project，就需要实例化之用，用这个唯一的global state management object的实例方法。既然是唯一的，就需要singleton pattern
    addProject(title: string, description: string, numOfPeople: number) {
      //传入argument创建实例
      const newProject = new Project(
        Math.random().toString(),
        title,
        description,
        numOfPeople,
        //默认选择active
        ProjectStatus.Active
      );

      //把实例放入projects array中
      this.projects.push(newProject);
      this.updateListeners();
    }

    moveProject(projectId: string, newStatus: ProjectStatus) {
      const project = this.projects.find((prj) => prj.id === projectId);
      if (project && project.status !== newStatus) {
        project.status = newStatus;
        this.updateListeners();
      }
    }

    //用来更新其他的
    private updateListeners() {
      for (const listenerFn of this.listeners) {
        //用.slice()做一次拷贝this.projects
        listenerFn(this.projects.slice());
      }
    }
  }

  //创建Singleton
  export const projectState = ProjectState.getInstance();
}
