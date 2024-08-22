import { startOfWeek, endOfWeek, add, compareAsc, parse, format } from "date-fns";
import Project from "./Project";
const defaultArchive = [
    {
        sidebarItem: {
            name: "Inbox",
            svgIcon: {
              viewBox: "0 0 512 512",
              pathD:
                "M121 32C91.6 32 66 52 58.9 80.5L1.9 308.4C.6 313.5 0 318.7 0 323.9L0 416c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-92.1c0-5.2-.6-10.4-1.9-15.5l-57-227.9C446 52 420.4 32 391 32L121 32zm0 64l270 0 48 192-51.2 0c-12.1 0-23.2 6.8-28.6 17.7l-14.3 28.6c-5.4 10.8-16.5 17.7-28.6 17.7l-120.4 0c-12.1 0-23.2-6.8-28.6-17.7l-14.3-28.6c-5.4-10.8-16.5-17.7-28.6-17.7L73 288 121 96z",
            },
        },
        mainContent: {
            heading: {
                title: 'Inbox',
                subtitle: 'Your tasks are here',
            },
            taskList: [],
        },
        id: 'inbox'
      },
      {
        sidebarItem: {
        name: "Today",
        svgIcon: {
          viewBox: "0 0 448 512",
          pathD:
            "M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm80 64c-8.8 0-16 7.2-16 16l0 96c0 8.8 7.2 16 16 16l96 0c8.8 0 16-7.2 16-16l0-96c0-8.8-7.2-16-16-16l-96 0z",
        },
        },
        mainContent: {
        heading: {
            title: 'Today',
            subtitle: new Date().toDateString(),
        },
        taskList: [],
    },
    id: 'today'
      },
      {
        sidebarItem: {
        name: "This week",
        svgIcon: {
          viewBox: "0 0 448 512",
          pathD:
            "M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm80 64c-8.8 0-16 7.2-16 16l0 64c0 8.8 7.2 16 16 16l288 0c8.8 0 16-7.2 16-16l0-64c0-8.8-7.2-16-16-16L80 256z",
        },
        },
        mainContent: {
        heading: {
            title: 'This week',
            subtitle: `${add(startOfWeek(new Date()),{days: 1}).toDateString()} - ${add(endOfWeek(new Date()),{days: 1}).toDateString()}`,
        },
        taskList: [],
    },
    id: 'this-week'
      },
]
// current user info is hard coded
const defualtUserInfo = {
    logo: "https://wallpapers-clan.com/wp-content/uploads/2024/06/re-zero-rem-smile-desktop-wallpaper-preview.jpg",
      name: "Rem",
      email: "example@email.com" 
}

export default class Storage {
    static getProjectData(projectID) {
        const projects = JSON.parse(window.localStorage.getItem('projects'));
        if (projects[projectID] === undefined && projects['userProjects'][projectID] === undefined) {
                return {
                    success: false,
                    data: {}
                };
        }
        return {
                success: true,
                data: projects[projectID] || projects['userProjects'][projectID]
            };
    }
    static getUserInfo() {
        return JSON.parse(window.localStorage.getItem('userInfo'));
    }
    static getProjects() {
        return Object.values(JSON.parse(window.localStorage.getItem('projects'))['userProjects']);
    }
    static getTaskData(projectID, taskID) {
        const projects = JSON.parse(window.localStorage.getItem('projects'));
        const task = projects[projectID].mainContent.taskList.find(task => task.id === taskID);
        return task;
    }
    static addTaskToProject(projectID, task) {
        const instance = new Storage();
        const taskID = instance.#generateID();
        const taskObj = Object.assign(task, {id: taskID});
        instance.#addTaskToArchive(taskObj);
        if (projectID !== 'inbox') {
            const projects = JSON.parse(window.localStorage.getItem('projects'));
            projects['userProjects'][projectID].mainContent.taskList.push(taskObj);
            window.localStorage.setItem('projects', JSON.stringify(projects));
        }
        return {
            success: true,
            taskID: taskID
        }
    }

    static getDefaultArchive() {
        const archiveToSend = defaultArchive.map(archive => {
            return archive.sidebarItem;
        });
        return archiveToSend;
    }
    static initLocalStorage() {
        if (window.localStorage.getItem('projects') === null) {
            window.localStorage.setItem('projects', JSON.stringify({}));
        }
        const projects = JSON.parse(window.localStorage.getItem('projects'));
        if (projects['inbox'] === undefined) {
            defaultArchive.forEach(archive => {
                projects[archive.id] = archive;
            })
        }
        if (projects['userProjects'] === undefined) {
            projects['userProjects'] = {};
        }

        const userInfo = JSON.parse(window.localStorage.getItem('userInfo'));
        if (userInfo === null) {
            window.localStorage.setItem('userInfo', JSON.stringify(defualtUserInfo));
        }
        if (projects['activeProject'] === undefined) {
            projects['activeProject'] = defaultArchive[0].id;
        }
        window.localStorage.setItem('projects', JSON.stringify(projects));
    }
    #generateID() {
        return Math.random().toString(36).substr(2, 9);
    }
    static getActiveProject() {
        const projects = JSON.parse(window.localStorage.getItem('projects'));
        const activeProjectID = projects['activeProject'];
        return projects[activeProjectID] || projects['userProjects'][activeProjectID] || projects[defaultArchive[0].id];
    }
    static removeTaskFromProject(projectID, taskID) {
        const projects = JSON.parse(window.localStorage.getItem('projects'));
        const taskList = projects[projectID].mainContent.taskList;
        const newTaskList = taskList.filter(task => task.id !== taskID);
        projects[projectID].mainContent.taskList = newTaskList;
        window.localStorage.setItem('projects', JSON.stringify(projects));
        const instance = new Storage();
        instance.#removeTaskFromArchive(taskID);
    }
    #isTodayTask(task) {
        const taskDate = task.dueDate;
        const today = new Date();
        return compareAsc(format(today, 'yyyy-MM-dd'), format(taskDate, 'yyyy-MM-dd')) === 0;
    }
    #isThisWeekTask(task) {
        const taskDate = task.dueDate;
        const today = new Date();
        const startOfWeekDate = startOfWeek(today);
        const endOfWeekDate = add(endOfWeek(today), {days: 2});
        return compareAsc(parse(taskDate, 'yyyy-MM-dd', new Date()), startOfWeekDate) === 1 && compareAsc(parse(taskDate, 'yyyy-MM-dd', new Date()), endOfWeekDate) === -1;
    }
    #addTaskToArchive(task) {
        const projects = JSON.parse(window.localStorage.getItem('projects'));
        projects['inbox'].mainContent.taskList.push(task);
        if (this.#isTodayTask(task)) {
            projects['today'].mainContent.taskList.push(task);
        }
        if (this.#isThisWeekTask(task)) {
            projects['this-week'].mainContent.taskList.push(task);
        }
        window.localStorage.setItem('projects', JSON.stringify(projects));
    }
    #removeTaskFromArchive(taskID) {
        const projects = JSON.parse(window.localStorage.getItem('projects'));
        const archiveList = ['inbox', 'today', 'this-week'];
        archiveList.forEach(archive => {
            const taskList = projects[archive].mainContent.taskList;
            const newTaskList = taskList.filter(task => task.id !== taskID);
            projects[archive].mainContent.taskList = newTaskList;
        });
        window.localStorage.setItem('projects', JSON.stringify(projects));
    }
    static updateTaskInProject(projectID, task) {
        const projects = JSON.parse(window.localStorage.getItem('projects'));
        if (this.existProject(projectID)) {
            const project = projects[projectID] || projects['userProjects'][projectID];
            const taskList = project.mainContent.taskList;
            const newTaskList = taskList.map(taskItem => {
                if (taskItem.id === task.id) {
                    const updatedTask = Object.assign(taskItem, task);
                    return updatedTask;
                }
                return taskItem;
            });
        if (projects[projectID] !== undefined) {
        projects[projectID].mainContent.taskList = newTaskList;
        } else {
            projects['userProjects'][projectID].mainContent.taskList = newTaskList;
        }
        window.localStorage.setItem('projects', JSON.stringify(projects));
        }
    }
    static existProject(projectID) {
        const projects = JSON.parse(window.localStorage.getItem('projects'));
        if (projects[projectID] !== undefined || projects['userProjects'][projectID] !== undefined) {
            return true;
        }
        return false;
    }
    static updateProjectName(projectID, newProjectName) {
        const projects = JSON.parse(window.localStorage.getItem('projects'));
        if (this.existProject(projectID)) {
            projects['userProjects'][projectID].mainContent.heading.title = newProjectName;
            projects['userProjects'][projectID].sidebarItem.name = newProjectName;
            window.localStorage.setItem('projects', JSON.stringify(projects));
        }
    }
    static updateActiveProject(projectID) {
        const projects = JSON.parse(window.localStorage.getItem('projects'));
        if (this.existProject(projectID)) {
            projects['activeProject'] = projectID;
        }
        window.localStorage.setItem('projects', JSON.stringify(projects));
    }
    static addProject(projectTitle) {
        const projects = JSON.parse(window.localStorage.getItem('projects'));
        const instance = new Storage();
        const projectID = instance.#generateID();
        const projectObj = new Project({
            id: projectID,
            title: projectTitle
        })
        projects['userProjects'][projectObj.id] = projectObj.getProjectStorageObj();
        window.localStorage.setItem('projects', JSON.stringify(projects));
        return {
            success: true,
            projectID: projectID
        }
    }
    static removeProject(projectID) {
        const projects = JSON.parse(window.localStorage.getItem('projects'));
        if (projects['userProjects'][projectID] !== undefined) {
            // Remove all tasks from archive
            const taskList = projects['userProjects'][projectID].mainContent.taskList;
            delete projects['userProjects'][projectID];
            window.localStorage.setItem('projects', JSON.stringify(projects));
            const instance = new Storage();
            taskList.forEach(task => {
                instance.#removeTaskFromArchive(task.id);
            });
            return {
                success: true
            }
        }
        return {
            success: false
        }
    }
}