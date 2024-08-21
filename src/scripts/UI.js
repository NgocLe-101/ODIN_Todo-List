// import Storage from "./Storage.js";
// import { AddTaskBarConfig } from "./Config.js";
// import { IconParser, TaskParser } from "./DOMParserFactory.js";
// import Task from "./Task.js";
// import Icon from "./Icon.js";
// import { format } from "date-fns";
// export default class UI {
//   constructor() {

//   }
//   static renderHomepage() {
//     Storage.initLocalStorage();
//     this.Sidebar.renderUserInfo(Storage.getUserInfo());
//     this.Sidebar.renderDefaultArchive(Storage.getDefaultArchive());
//     this.Sidebar.renderProjectList(Storage.getProjects());
//     this.MainContent.renderAddTaskBar();
//     this.renderActiveProject(Storage.getActiveProject());
//     this.initEventListeners();
//   }

//   static Sidebar = (function () {
//     const renderUserInfo = (userInfo) => {
//       const userInfoContainer = document.querySelector(".sidebar .user-info");
//       const logo = userInfoContainer.querySelector(".logo");
//       const username = userInfoContainer.querySelector(".username-container");
//       const name = username.querySelector(".name-wrapper");
//       const email = username.querySelector(".email-wrapper");

//       logo.innerHTML = `
//             <img src="${userInfo.logo}" alt="User logo">
//         `;
//       name.textContent = userInfo.name;
//       email.textContent = userInfo.email;
//     };
//     const addSidebarItemEventListeners = (item) => {
//       item.addEventListener('click', () => {
//         UI.loadProject(item.id);
//       });
//       return item;
//     }
//     const createSidebarItem = (item) => {
//       let container = document.createElement("div");
//       container.classList.add("sidebar-item");
//       container.innerHTML = `
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="${item.svgIcon.viewBox}"><path d="${item.svgIcon.pathD}"/></svg>
//             <input type="text" value="${item.name}"readonly>
//         `;
//       container.id = item.id;
//       container = addSidebarItemEventListeners(container);
//       return container;
//     };

//     const renderDefaultArchive = (items) => {
//       const itemContainer = document.querySelector(
//         ".sidebar .sidebar-item-container"
//       );
//       items.forEach((item) => {
//         const itemElem = createSidebarItem(item);
//         itemElem.classList.add("sidebar-item-container");
//         itemElem.id = item.name.toLowerCase().replace(/\s/g, "-");
//         itemContainer.appendChild(itemElem);
//       });
//     };
//     const createRemoveProjectBtn = () => {
//       const removeProjectBtn = document.createElement("div");
//       removeProjectBtn.classList.add("remove-project-btn");
//       removeProjectBtn.innerHTML = `
//             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 64L384 0 224 160 64 0 0 64 160 224 0 384 64 448 224 288 384 448 448 384 288 224z"/></svg>
//         `;
//       removeProjectBtn.addEventListener('click', () => {
//         const projectToRemoveID = removeProjectBtn.parentElement.querySelector('.sidebar-item').id;
//         UI.removeProject(projectToRemoveID); // pretty bad design, should be refactored
//       })
//       return removeProjectBtn;
//     }
//     const addProjectListItemEventListeners = (item) => {
//       item.addEventListener('dblclick', () => {
//         const input = item.querySelector('input');
//         input.removeAttribute('readonly');
//         input.classList.add('active');
//       })
//       item.addEventListener('focusout', () => {
//         const input = item.querySelector('input');
//         input.setAttribute('readonly', true);
//         input.classList.remove('active');
//       })
//       const input = item.querySelector('input');
//       input.addEventListener('change', () => {
//         UI.changeProjectName(item.id, input.value);
//       });
//     }
//     const createProjectListItem = (item) => 
//     {
//       const projectDiv = document.createElement("div");
//         const projectElem = createSidebarItem(Object.assign(item.sidebarItem,{id: item.id}));
//         projectDiv.classList.add("project-item");
//         addProjectListItemEventListeners(projectElem);
//         projectDiv.appendChild(projectElem);
//         projectDiv.appendChild(createRemoveProjectBtn());
//         return projectDiv;
//     }
//     const addProjectToList = () => {
//       // This will add a project to the project list to let user add a new project
//       const projectList = document.querySelector('.sidebar #project > .section-content > div.project-list');
//       const {success, projectID} = Storage.addProject('New Project');
//       if (success) {
//         const project = Storage.getProjectData(projectID);
//         const projectDiv = createProjectListItem(project.data);
//         projectList.appendChild(projectDiv);
//         const input = projectList.lastChild.querySelector('input');
//         input.click();
//         input.dispatchEvent(new Event('dblclick', {
//           bubbles: true,
//           cancelable: true,
//           view: window
//         }))
//         input.select();
//       }
//     }
//     const renderProjectList = (projects) => {
//       const projectList = document.querySelector(
//         ".sidebar #project > .section-content > div.project-list"
//       );
//       projectList.innerHTML = "";
//       projects.forEach((project) => {
//         const projectDiv = createProjectListItem(project);
//         projectList.appendChild(projectDiv);
//       });
//     };
//     return { renderUserInfo, renderDefaultArchive, renderProjectList, addProjectToList };
//   })();

//   static MainContent = (function () {
//     const createAddTaskBar = (config) => {
//       const addTaskBarContainer = document.createElement("div");
//       addTaskBarContainer.classList.add("add-task-container", "task-item");
//       const iconParser = new IconParser(config.icon);
//       addTaskBarContainer.addEventListener("focus", () => {
//         iconParser.putOnShow("CIRCLE");
//       });
//       addTaskBarContainer.addEventListener("focusout", () => {
//         iconParser.putOnShow("CROSS");
//       });
//       addTaskBarContainer.appendChild(iconParser.parse());

//       const input = document.createElement("input");
//       input.type = "text";
//       input.placeholder = "Add a task...";
//       input.title = "Add a task...";
//       input.classList.add("task-item-text");
//       addTaskBarContainer.appendChild(input);

//       const utilityContainer = document.createElement("div");
//       utilityContainer.classList.add("util-option-container");
//       config.modules.forEach((module) => {
//         utilityContainer.appendChild(module.parse());
//       });
//       addTaskBarContainer.appendChild(utilityContainer);

//       return addTaskBarContainer;
//     };
//     const renderAddTaskBar = () => {
//       const mainContentBot = document.querySelector(".main-content .bot");
//       mainContentBot.innerHTML = "";
//       mainContentBot.appendChild(createAddTaskBar(AddTaskBarConfig));
//     };
//     const createEmptyDisplayPlaceholder = () => {
//       const container = document.createElement("div");
//       container.id = "empty-task-display-container";
//       container.innerHTML = `
//         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>
//         <p>No task</p>
//       `;
//       return container;
//     };
//     const renderTaskList = (taskList) => {
//       const taskListContainer = document.querySelector(
//         ".main-content .top .task-list-container"
//       );
//       taskListContainer.innerHTML = "";
//       if (taskList.length === 0) {
//         taskListContainer.appendChild(createEmptyDisplayPlaceholder());
//       } else {
//         taskList.forEach((task) => {
//           task.icon = new Icon(task.icon);
//           const TaskObj = new Task(task);
//           const taskParser = new TaskParser(TaskObj);
//           const taskElem = taskParser.parse();
//           taskElem.addEventListener('click', () => {
//             UI.openTaskDetail(task.id);
//           })
//           taskListContainer.appendChild(taskParser.parse());
//         });
//       }
//     };
//     const renderMainContent = (mainContent) => {
//       const headingWrapper = document.querySelector(
//         ".main-content .top .heading-wrapper"
//       );
//       const title = headingWrapper.querySelector(".title");
//       const subtitle = headingWrapper.querySelector(".subtitle");
//       title.textContent = mainContent.heading.title;
//       subtitle.textContent = mainContent.heading.subtitle;

//       renderTaskList(mainContent.taskList);
//     };
//     return { renderAddTaskBar, renderMainContent };
//   })();

//   static renderActiveProject(project) {
//     const sidebarItem = document.querySelectorAll(".sidebar-item");
//     sidebarItem.forEach((item) => {
//       if (item.id !== project.id) {
//         item.classList.remove("active");
//       } else {
//         item.classList.add("active");
//       }
//     });
//     this.MainContent.renderMainContent(project.mainContent);
//   }

//   // Init event listeners
//   static initEventListeners() {
//     this.initAddProjectEventListeners();
//     this.initAddTaskEventListeners();
//     this.initTaskDetailEventListeners();
//   }
//   static initAddProjectEventListeners() {
//     const addProjectBtn = document.querySelector('.sidebar .sidebar-section .add-project-btn');
//     addProjectBtn.addEventListener('click', () => {
//       this.Sidebar.addProjectToList();
//     })
//   }
//   static initAddTaskEventListeners() {
//     const addTaskContainer = document.querySelector('.main-content .bot .add-task-container');
//     addTaskContainer.addEventListener('keydown', (e) => {
//       if (e.key === "Enter") {
//         const input = addTaskContainer.querySelector('input');
//         if (input.value === "") return;
//         const dueDateText = addTaskContainer.querySelector('p');
//         const dueDate = dueDateText === null ? format(new Date(), 'yyyy-MM-dd') : format(dueDateText.textContent, 'yyyy-MM-dd');
//         const priority = addTaskContainer.querySelector('select').value;
//         this.addTaskToCurrentProject(new Task({
//           title: input.value,
//           dueDate: dueDate,
//           priority: priority.toLowerCase()
//         }));
//         input.value = "";
//       }
//     })
//   }
//   static initTaskDetailEventListeners() {
//     const taskDetailContainer = document.querySelector('.task-detail-container');
//     taskDetailContainer.addEventListener('click', (e) => {
//       if (e.target.id === 'detail-container') {
//         const taskID = taskDetailContainer.classList[1].split('-')[1];
//         const newDescription = taskDetailContainer.querySelector('.task-detail-content-description textarea').value;
//         Storage.updateTaskInProject(Storage.getActiveProject().id, {
//           id: taskID,
//           description: newDescription
//         });
//         taskDetailContainer.classList.remove('active');
//         taskDetailContainer.classList.remove(`taskID-${taskID}`);
//       }
//     })

//     const deleteBtn = taskDetailContainer.querySelector('.task-delete');
//     deleteBtn.addEventListener('click', () => {
//       const taskID = taskDetailContainer.classList[2].split('-')[1];
//       Storage.removeTaskFromProject(Storage.getActiveProject().id, taskID);
//       taskDetailContainer.classList.remove('active');
//       taskDetailContainer.classList.remove(`taskID-${taskID}`);
//       this.MainContent.renderMainContent(Storage.getActiveProject().mainContent);
//     })
//   }

//   static addTaskToCurrentProject(task) {
//     const taskID = Storage.addTaskToProject(Storage.getActiveProject().id, task);
//     if (taskID.success) {
//       this.MainContent.renderMainContent(Storage.getActiveProject().mainContent);
//     } else {
//       console.error("Error: Task not added");
//     }
//   }
  
//   static loadProject(projectID) {
//     const projectData = Storage.getProjectData(projectID);
//     if (projectData.success) {
//       Storage.updateActiveProject(projectID);
//       this.renderActiveProject(projectData.data);
//     } else {
//       console.error("Error: Project data not found");
//     }
//   }
//   static removeProject(projectID) {
//     if(Storage.removeProject(projectID).success) {
//       // Reload the project list
//       UI.Sidebar.renderProjectList(Storage.getProjects());
//     } else {
//       console.error("Error: Project not found");
//     }
//   }
//   static changeProjectName(projectID,newName) {
//     const heading = document.querySelector('.main-content .top .heading-wrapper .title');
//     heading.textContent = newName;
//     Storage.updateProjectName(projectID, newName);
//   }
//   static openTaskDetail(taskID) {
//     const task = Storage.getTaskData(Storage.getActiveProject().id, taskID);
//     const taskDetailContainer = document.querySelector('.task-detail-container .task-detail');
//     const taskTitle = taskDetailContainer.querySelector('.task-detail-header-title');
//     const taskDescription = taskDetailContainer.querySelector('.task-detail-content-description textarea');
//     const taskDueDate = taskDetailContainer.querySelector('.task-detail-header-date');
//     const taskPriority = taskDetailContainer.querySelector('.task-detail-header-priority');

//     taskTitle.textContent = task.title;
//     taskDescription.value = task.description;
//     taskDueDate.textContent = task.dueDate;
//     taskPriority.textContent = task.priority.toUpperCase();

//     taskDetailContainer.parentElement.classList.add('active', `taskID-${taskID}`);
//   }
// }

import Storage from "./Storage.js";
import { AddTaskBarConfig } from "./Config.js";
import { IconParser, TaskParser } from "./DOMParserFactory.js";
import Task from "./Task.js";
import Icon from "./Icon.js";
import { format } from "date-fns";
import PubSub from "./PubSub.js";

export default class UI {
  #_pubSub;
  constructor() {
    this.#_pubSub = new PubSub();
    this.Sidebar = this.createSidebar();
    this.MainContent = this.createMainContent();
    Storage.initLocalStorage();
  }
  
  renderHomepage() {
    this.Sidebar.renderUserInfo(Storage.getUserInfo());
    this.Sidebar.renderDefaultArchive(Storage.getDefaultArchive());
    this.Sidebar.renderProjectList(Storage.getProjects());
    this.MainContent.renderAddTaskBar();
    this.renderActiveProject(Storage.getActiveProject());
    this.initEventListeners();
    this.initPubSub();
  }

  createSidebar() {
    const renderUserInfo = (userInfo) => {
      const userInfoContainer = document.querySelector(".sidebar .user-info");
      const logo = userInfoContainer.querySelector(".logo");
      const username = userInfoContainer.querySelector(".username-container");
      const name = username.querySelector(".name-wrapper");
      const email = username.querySelector(".email-wrapper");

      logo.innerHTML = `
            <img src="${userInfo.logo}" alt="User logo">
        `;
      name.textContent = userInfo.name;
      email.textContent = userInfo.email;
    };

    const addSidebarItemEventListeners = (item) => {
      item.addEventListener('click', () => {
        this.#_pubSub.publish('projectChange', item.id);
      });
      return item;
    };

    const createSidebarItem = (item) => {
      let container = document.createElement("div");
      container.classList.add("sidebar-item");
      container.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="${item.svgIcon.viewBox}"><path d="${item.svgIcon.pathD}"/></svg>
            <input type="text" value="${item.name}" readonly>
        `;
      container.id = item.id;
      container = addSidebarItemEventListeners(container);
      return container;
    };

    const renderDefaultArchive = (items) => {
      const itemContainer = document.querySelector(
        ".sidebar .sidebar-item-container"
      );
      items.forEach((item) => {
        const itemElem = createSidebarItem(item);
        itemElem.classList.add("sidebar-item-container");
        itemElem.id = item.name.toLowerCase().replace(/\s/g, "-");
        itemContainer.appendChild(itemElem);
      });
    };

    const createRemoveProjectBtn = () => {
      const removeProjectBtn = document.createElement("div");
      removeProjectBtn.classList.add("remove-project-btn");
      removeProjectBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M448 64L384 0 224 160 64 0 0 64 160 224 0 384 64 448 224 288 384 448 448 384 288 224z"/></svg>
        `;
      removeProjectBtn.addEventListener('click', () => {
        const projectToRemoveID = removeProjectBtn.parentElement.querySelector('.sidebar-item').id;
        this.removeProject(projectToRemoveID); // pretty bad design, should be refactored
      });
      return removeProjectBtn;
    };

    const addProjectListItemEventListeners = (item) => {
      item.addEventListener('dblclick', () => {
        const input = item.querySelector('input');
        input.removeAttribute('readonly');
        input.classList.add('active');
      });
      item.addEventListener('focusout', () => {
        const input = item.querySelector('input');
        input.setAttribute('readonly', true);
        input.classList.remove('active');
      });
      const input = item.querySelector('input');
      input.addEventListener('change', () => {
        this.changeProjectName(item.id, input.value);
      });
    };

    const createProjectListItem = (item) => {
      const projectDiv = document.createElement("div");
      const projectElem = createSidebarItem(Object.assign(item.sidebarItem, { id: item.id }));
      projectDiv.classList.add("project-item");
      addProjectListItemEventListeners(projectElem);
      projectDiv.appendChild(projectElem);
      projectDiv.appendChild(createRemoveProjectBtn());
      return projectDiv;
    };

    const addProjectToList = () => {
      // This will add a project to the project list to let user add a new project
      const projectList = document.querySelector('.sidebar #project > .section-content > div.project-list');
      const { success, projectID } = Storage.addProject('New Project');
      if (success) {
        const project = Storage.getProjectData(projectID);
        const projectDiv = createProjectListItem(project.data);
        projectList.appendChild(projectDiv);
        const input = projectList.lastChild.querySelector('input');
        input.click();
        input.dispatchEvent(new Event('dblclick', {
          bubbles: true,
          cancelable: true,
          view: window
        }));
        input.select();
      }
    };

    const renderProjectList = (projects) => {
      const projectList = document.querySelector(
        ".sidebar #project > .section-content > div.project-list"
      );
      projectList.innerHTML = "";
      projects.forEach((project) => {
        const projectDiv = createProjectListItem(project);
        projectList.appendChild(projectDiv);
      });
    };

    return { renderUserInfo, renderDefaultArchive, renderProjectList, addProjectToList };
  }

  createMainContent() {
    const createAddTaskBar = (config) => {
      const addTaskBarContainer = document.createElement("div");
      addTaskBarContainer.classList.add("add-task-container", "task-item");
      const iconParser = new IconParser(config.icon);
      addTaskBarContainer.addEventListener("focus", () => {
        iconParser.putOnShow("CIRCLE");
      });
      addTaskBarContainer.addEventListener("focusout", () => {
        iconParser.putOnShow("CROSS");
      });
      addTaskBarContainer.appendChild(iconParser.parse());

      const input = document.createElement("input");
      input.type = "text";
      input.placeholder = "Add a task...";
      input.title = "Add a task...";
      input.classList.add("task-item-text");
      addTaskBarContainer.appendChild(input);

      const utilityContainer = document.createElement("div");
      utilityContainer.classList.add("util-option-container");
      config.modules.forEach((module) => {
        utilityContainer.appendChild(module.parse());
      });
      addTaskBarContainer.appendChild(utilityContainer);

      return addTaskBarContainer;
    };

    const renderAddTaskBar = () => {
      const mainContentBot = document.querySelector(".main-content .bot");
      if (mainContentBot.innerHTML !== "") {
        const activePrj = Storage.getActiveProject().id;
        const addTaskContainer = mainContentBot.querySelector('.add-task-container');
        if (activePrj === 'today' || activePrj === 'this-week') {
          addTaskContainer.classList.add('disabled');
        } else {
          addTaskContainer.classList.remove('disabled');
        }
      } else {
        mainContentBot.appendChild(createAddTaskBar(AddTaskBarConfig));
      }
    };

    const createEmptyDisplayPlaceholder = () => {
      const container = document.createElement("div");
      container.id = "empty-task-display-container";
      container.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>
        <p>No task</p>
      `;
      return container;
    };

    const renderTaskList = (taskList) => {
      const taskListContainer = document.querySelector(
        ".main-content .top .task-list-container"
      );
      taskListContainer.innerHTML = "";
      if (taskList.length === 0) {
        taskListContainer.appendChild(createEmptyDisplayPlaceholder());
      } else {
        taskList.forEach((task) => {
          task.icon = new Icon(task.icon);
          const TaskObj = new Task(task);
          const taskParser = new TaskParser(TaskObj);
          const taskElem = taskParser.parse();
          taskElem.addEventListener('click', () => {
            this.openTaskDetail(task.id);
          });
          taskListContainer.appendChild(taskParser.parse());
        });
      }
    };

    const renderMainContent = (mainContent) => {
      const headingWrapper = document.querySelector(
        ".main-content .top .heading-wrapper"
      );
      const title = headingWrapper.querySelector(".title");
      const subtitle = headingWrapper.querySelector(".subtitle");
      title.textContent = mainContent.heading.title;
      subtitle.textContent = mainContent.heading.subtitle;

      renderTaskList(mainContent.taskList);
    };

    return { renderAddTaskBar, renderMainContent };
  }

  renderActiveProject(project) {
    const sidebarItem = document.querySelectorAll(".sidebar-item");
    sidebarItem.forEach((item) => {
      if (item.id !== project.id) {
        item.classList.remove("active");
      } else {
        item.classList.add("active");
      }
    });
    this.MainContent.renderMainContent(project.mainContent);
  }

  // Init pubsub
  initPubSub() {
    this.#_pubSub.subscribe('addTask', (task) => {
      this.addTaskToCurrentProject(task);
    })
    this.#_pubSub.subscribe('projectChange', (projectID) => {
      this.loadProject(projectID);
    })
    this.#_pubSub.subscribe('exitTaskDetail', (taskID) => {
      const taskDetailContainer = document.querySelector('.task-detail-container');
      taskDetailContainer.classList.remove('active');
      taskDetailContainer.classList.remove(`taskID-${taskID}`);
      this.MainContent.renderMainContent(Storage.getActiveProject().mainContent);
    })
    this.#_pubSub.subscribe('projectChange', () => {
      const mainContentBot = document.querySelector(".main-content .bot");
      const activePrj = Storage.getActiveProject().id;
        const addTaskContainer = mainContentBot.querySelector('.add-task-container');
        if (activePrj === 'today' || activePrj === 'this-week') {
          addTaskContainer.classList.add('disabled');
        } else {
          addTaskContainer.classList.remove('disabled');
        }
    })
    this.#_pubSub.subscribe('projectRemove', () => {
      this.Sidebar.renderProjectList(Storage.getProjects());
      this.#_pubSub.publish('projectChange', 'inbox');
    })
  }

  // Init event listeners
  initEventListeners() {
    this.initAddProjectEventListeners();
    this.initAddTaskEventListeners();
    this.initTaskDetailEventListeners();
  }

  initAddProjectEventListeners() {
    const addProjectBtn = document.querySelector('.sidebar .sidebar-section .add-project-btn');
    addProjectBtn.addEventListener('click', () => {
      this.Sidebar.addProjectToList();
    });
  }

  initAddTaskEventListeners() {
    const addTaskContainer = document.querySelector('.main-content .bot .add-task-container');
    addTaskContainer.addEventListener('keydown', (e) => {
      if (e.key === "Enter") {
        const input = addTaskContainer.querySelector('input');
        if (input.value === "") return;
        const dueDateText = addTaskContainer.querySelector('p');
        const dueDate = dueDateText === null ? format(new Date(), 'yyyy-MM-dd') : format(dueDateText.textContent, 'yyyy-MM-dd');
        const priority = addTaskContainer.querySelector('select').value;
        this.#_pubSub.publish('addTask', new Task({
          title: input.value,
          dueDate: dueDate,
          priority: priority.toLowerCase()
        }));
        input.value = "";
      }
    });
  }

  initTaskDetailEventListeners() {
    const taskDetailContainer = document.querySelector('.task-detail-container');
    taskDetailContainer.addEventListener('click', (e) => {
      if (e.target.id === 'detail-container') {
        let taskID
        taskDetailContainer.classList.forEach((className) => {
          if (className.includes('taskID-')) {
            taskID = className.split('-')[1];
          }
        });
        const newDescription = taskDetailContainer.querySelector('.task-detail-content-description textarea').value;
        Storage.updateTaskInProject(Storage.getActiveProject().id, {
          id: taskID,
          description: newDescription
        });
        this.#_pubSub.publish('exitTaskDetail', taskID);
      }
    });

    const deleteBtn = taskDetailContainer.querySelector('.task-delete');
    deleteBtn.addEventListener('click', () => {
      let taskID
        taskDetailContainer.classList.forEach((className) => {
          if (className.includes('taskID-')) {
            taskID = className.split('-')[1];
          }
        });
      Storage.removeTaskFromProject(Storage.getActiveProject().id, taskID);
      this.#_pubSub.publish('exitTaskDetail', taskID);
    });
  }

  addTaskToCurrentProject(task) {
    const taskID = Storage.addTaskToProject(Storage.getActiveProject().id, task);
    if (taskID.success) {
      this.MainContent.renderMainContent(Storage.getActiveProject().mainContent);
    } else {
      console.error("Error: Task not added");
    }
  }

  loadProject(projectID) {
    const projectData = Storage.getProjectData(projectID);
    if (projectData.success) {
      Storage.updateActiveProject(projectID);
      this.renderActiveProject(projectData.data);
    } else {
      console.error("Error: Project data not found");
    }
  }

  removeProject(projectID) {
    if (Storage.removeProject(projectID).success) {
      this.#_pubSub.publish('projectRemove');
    } else {
      console.error("Error: Project not found");
    }
  }

  changeProjectName(projectID, newName) {
    const heading = document.querySelector('.main-content .top .heading-wrapper .title');
    heading.textContent = newName;
    Storage.updateProjectName(projectID, newName);
  }

  openTaskDetail(taskID) {
    const task = Storage.getTaskData(Storage.getActiveProject().id, taskID);
    const taskDetailContainer = document.querySelector('.task-detail-container .task-detail');
    const taskTitle = taskDetailContainer.querySelector('.task-detail-header-title');
    const taskDescription = taskDetailContainer.querySelector('.task-detail-content-description textarea');
    const taskDueDate = taskDetailContainer.querySelector('.task-detail-header-date');
    const taskPriority = taskDetailContainer.querySelector('.task-detail-header-priority');

    taskTitle.textContent = task.title;
    taskDescription.value = task.description;
    taskDueDate.textContent = task.dueDate;
    taskPriority.textContent = task.priority.toUpperCase();

    taskDetailContainer.parentElement.classList.add('active', `taskID-${taskID}`);
  }
}