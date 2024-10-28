/// <reference path='components/project-input.ts' />
/// <reference path='components/project-list.ts' />

namespace App {
  //实例化三个class，生成三个list
  new ProjectInput();
  new ProjectList("active");
  new ProjectList("finished");
}
