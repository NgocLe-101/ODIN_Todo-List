import { compareAsc, format } from "date-fns";
import { TaskConfig } from "./Config.js";

export default class Task {
    constructor(config) {
        Object.entries({...TaskConfig,...config}).forEach(([key, value]) => {
            this[key] = value;
        });
        this.state.dueDateExceeded = compareAsc(format(new Date(),'yyyy-MM-dd'), format(this.dueDate, 'yyyy-MM-dd')) === 1;
    }

    changeDueDate(date) {
        this.dueDate = date;
    }

    changePriority(priority) {
        this.priority = priority;
    }

    checkTask() {
        this.state.state = this.state.state === 'unfinished' ? 'finished' : 'unfinished';
    }

    finishTask() {
        this.state.state = 'finished';
    }
    
    getState() {
        return this.state;
    }
};