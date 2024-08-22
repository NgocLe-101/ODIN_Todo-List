import Icon from "./Icon";

class IconParser {
    #_DOMElem;
    constructor(icon) {
        this.#initDOMElem(icon);
    }
    #initDOMElem(icon) {
        this.#_DOMElem = this.#createDOMIcon(icon);
        this.putOnShow(icon.getDefaultIcon().name);
    }
    #createDOMIcon(icon) {
        const DOMIcon = document.createElement('div');
        DOMIcon.classList.add('icon-wrapper');
        icon.getIconList().forEach(icon => {
            DOMIcon.innerHTML += `
                <svg xmlns="${icon.xmlns}" viewBox="${icon.viewBox}" id="${icon.name.toLowerCase()}"><path d="${icon.pathD}"></svg>
            `
        });
        return DOMIcon;
    }
    addEventsToIcon(events) {
        Object.entries(events).forEach(([event, listener]) => {
            this.#_DOMElem.addEventListener(event, listener);
        });
    }
    addEventsToElement(events) {
        Object.entries(events).forEach(([event, listener]) => {
            this._DOMElem.addEventListener(event, listener);
        });
    }
    putOnShow(iconName) {
        Array.from(this.#_DOMElem.children).forEach(child => {
            if (child.id === iconName.toLowerCase()) {
                child.style.display = 'block';
            } else {
                child.style.display = 'none';
            }
        });
    }
    set id(id) {
        this.#_DOMElem.id = id;
    }
    get id() {
        return this.#_DOMElem.id;
    }
    parse() {
        return this.#_DOMElem;
    }
}
import { TaskConfig } from "./Config";
class TaskParser {
    #_DOMElem;
    #_task;
    constructor(task) {
        Object.assign(task, {modules: TaskConfig.modules});
        this.#_task = task;
        this.#_DOMElem = this.#createDOMTask();
    }

    changePriorityIndicator(priority) {
        const priorityIndicator = this.#_DOMElem.querySelector('.priority-indicator');
        if (priorityIndicator.classList.contains(/priority-[high|medium|low]/g)) {
            priorityIndicator.classList.remove(/priority-[high|medium|low]/g);
        }
        priorityIndicator.classList.add(`priority-${priority}`);
    }
    set id(id) {
        this.#_DOMElem.id = id;
    }
    get id() {
        return this.#_DOMElem.id;
    }
    addEventsToElement(events) {
        Object.entries(events).forEach(([event, listener]) => {
            console.log(event, listener);
            this.#_DOMElem.addEventListener(event, listener);
        });
    }
    #createTaskIcon(icon) {
        const iconParser = new IconParser(icon);
        return iconParser;
    }

    #createDOMTask() {
        const taskElem = document.createElement('div');
        taskElem.classList.add('task-item', 'task-list-item');
        if (this.#_task.getState().state === 'finished') {
            taskElem.classList.add('finished');
        }
        if (this.#_task.getState().dueDateExceeded) {
            taskElem.classList.add('due-date-exceeded');
        }
        
        const iconParser = this.#createTaskIcon(this.#_task.icon);
        const iconBehavior = {
            'mouseover': () => {
                if (this.#_task.getState().state === 'unfinished') {
                    iconParser.putOnShow('CHECK_UNFILLED');
                }
            },
            'mouseout': () => {
                if (this.#_task.getState().state === 'unfinished') {
                    iconParser.putOnShow('CIRCLE');
                }
            },
            'click': () => {
                this.#_task.checkTask();
                if (this.#_task.getState().state === 'finished') {
                    iconParser.putOnShow('CHECK_FILLED');
                } else {
                    iconParser.putOnShow('CIRCLE');
                }
            }
        }
        iconParser.addEventsToIcon(iconBehavior);
        if (this.#_task.getState().state === 'finished') {
            iconParser.putOnShow('CHECK_FILLED');
        }

        const taskItemText = document.createElement('div');
        taskItemText.classList.add('task-item-text');
        
        const taskItemContent = document.createElement('p');
        taskItemContent.textContent = this.#_task.title;
        taskItemText.appendChild(taskItemContent);
        
        taskElem.appendChild(iconParser.parse());
        taskElem.appendChild(taskItemText);
        this.#_task.modules.forEach(module => {
            taskElem.appendChild(module.getDOMModule(this.#_task));
        });

        const priorityIndicator = document.createElement('div');
        priorityIndicator.classList.add('priority-indicator', `priority-${this.#_task.priority}`);
        taskElem.appendChild(priorityIndicator);
        return taskElem;
    }
    addEventsToIcon(events) {
        const icon = this.#_DOMElem.querySelector('.icon-wrapper');
        Object.entries(events).forEach(([event, listener]) => {
            icon.addEventListener(event, listener);
        });
    }
    getTask() {
        return this.#_task;
    }

    parse() {
        return this.#_DOMElem;
    }
}

class ModuleParser {
    _DOMElem;
    constructor() {
        this.#initDOMElem();
    }
    #initDOMElem() {
        this._DOMElem = this.#createDOMModule();
    }
    #createDOMModule() {
        let DOMModule = document.createElement('div');
        DOMModule.classList.add('module');
        return DOMModule;
    }
}
// **NOTICE**:
// Changing on _DOMElem won't change the actual DOM which would be rendered.
// This just a way to achieve protected property in JS
class DropdownModuleParser extends ModuleParser {
    #_DOMElem;
    constructor(options) {
        super();
        this.#_DOMElem = this._DOMElem;
        Object.entries(options).forEach(([key,value]) => {
            this[key] = value;
        });
        this.#initDOMElem();
    }
    #initDOMElem() {
        this.#syncDOMElem();
    }
    set id(id) {
        this.#_DOMElem.id = id;
    }
    get id() {
        return this.#_DOMElem.id;
    }
    set className(className) {
        this.#_DOMElem.classList.add(className);
    }
    get className() {
        return this.#_DOMElem.classList;
    }
    #syncDOMElem() {
        let dropdown = document.createElement('select');
        this.options.forEach(option => {
            dropdown.appendChild(new Option(option.toUpperCase(), option));
        });
        dropdown.selectedIndex = this.options.indexOf(this.defaultOption);
        this.#_DOMElem.innerHTML = '';
        this.#_DOMElem.appendChild(dropdown);
    }
    addOption(...option) {
        option.forEach(option => {
            this.dropdownOptions.push(option);
        });
        this.#syncDOMElem();
    }
    removeOption(...options) {
        options.forEach(option => {
            this.dropdownOptions = this.dropdownOptions.filter(opt => opt !== option);
        });
        this.#syncDOMElem();
    }
    clearOptions() {
        this.dropdownOptions = [];
        this.#syncDOMElem();
    }
    parse() {
        return this.#_DOMElem;
    }
}
import { format, parse } from 'date-fns';
class CalendarModuleParser extends ModuleParser {
    #_DOMElem;
    constructor() {
        super();
        this.#_DOMElem = this._DOMElem;
        this.#initDOMElem();
    }
    #initDOMElem() {
        this.#_DOMElem.id = 'calendar';
        let iconParser = new IconParser(
            new Icon({
                iconList: ['CALENDAR'],
                defaultIcon: 'CALENDAR',
            })
        );
        iconParser.addEventsToIcon({
            'click': () => {
                this.#addDatePicker();
            }
        })
        let dateInputContainer = document.createElement('div');
        dateInputContainer.classList.add('date-input-container');
        this.#_DOMElem.appendChild(iconParser.parse());
        this.#_DOMElem.appendChild(dateInputContainer);
    }
    #addDatePicker() {
        const dateInputContainer = this.#_DOMElem.lastChild;
        if (dateInputContainer.childElementCount > 0) {
            dateInputContainer.lastChild.remove();
        }
        let dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.placeholder = 'Due Date';
        dateInput.title = 'Add due date';
        dateInput.addEventListener('change', () => {
            dateInput.remove();
            let dateLabel = this.#createDateLabel(dateInput.value);
            dateLabel.addEventListener('click', () => {
                this.#addDatePicker();
            });
            this.#_DOMElem.lastChild.appendChild(dateLabel);
        });
        this.#_DOMElem.lastChild.appendChild(dateInput);
    }
    #createDateLabel(date) {
        let dateFormatted = format(parse(date, 'yyyy-MM-dd', new Date()), 'eee, MMM d yyyy');
        let dateLabel = document.createElement('p');
        dateLabel.textContent = dateFormatted;
        return dateLabel;
    }
    parse() {
        return this.#_DOMElem;
    }
}

export { IconParser, 
    ModuleParser, 
    TaskParser, 
    CalendarModuleParser, 
    DropdownModuleParser };