namespace App {
  // Project Type
  //枚举
  export enum ProjectStatus {
    Active,
    Finished,
  }

  export class Project {
    //shorthand of assign parameters, 传入后自动编程property
    constructor(
      public id: string,
      public title: string,
      public description: string,
      public people: number,
      //status用于filter和分类projects，active的放进第一个list，finished放进第二个list，也可以用"active" | "finished"
      public status: ProjectStatus
    ) {}
  }
}
