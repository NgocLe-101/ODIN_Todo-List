import { ProjectConfig } from "./Config";

export default class Project {
    constructor(options) {
        Object.entries({...ProjectConfig,...options}).forEach(([key, value])=> {
            this[key] = value;
        })
    }
    getProjectStorageObj() {
        return {
            id: this.id,
            mainContent: {
                heading: {
                    title: this.title,
                    subtitle: this.subtitle
                },
                taskList: this.taskList
            },
            sidebarItem: {
                name: this.title,
                svgIcon: this.svgIcon
            }
        }
    }
}