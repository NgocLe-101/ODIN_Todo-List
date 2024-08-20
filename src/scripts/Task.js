import { compareAsc, parse } from "date-fns";
import { TaskConfig } from "./Config.js";

export default class Task {
    #_state;
    constructor(config) {
        Object.entries({...TaskConfig,...config}).forEach(([key, value]) => {
            this[key] = value;
        });
        this.#_state = 'unfinished';
    }

    changeDueDate(date) {
        this.dueDate = date;
    }

    changePriority(priority) {
        this.priority = priority;
    }

    checkTask() {
        this.#_state = this.#_state === 'unfinished' ? 'finished' : 'unfinished';
    }

    finishTask() {
        this.#_state = 'finished';
    }
    
    getState() {
        return {
            state: this.#_state,
            dueDateExceeded: compareAsc(new Date(), parse(this.dueDate, 'yyyy-MM-dd', new Date())) === 1
        }
    }
};