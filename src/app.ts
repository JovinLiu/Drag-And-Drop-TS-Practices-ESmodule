import { ProjectInput } from "./components/project-input.js";
import { ProjectList } from "./components/project-list.js";
//实例化三个class，生成三个list
new ProjectInput();
new ProjectList("active");
new ProjectList("finished");
