import { CalendarModuleParser, DropdownModuleParser, IconParser } from "./DOMParserFactory";
import Icon from "./Icon";
const TaskConfig = {
    title: '',
    description: '',
    dueDate: undefined,
    priority: 'medium',
    icon: new Icon({
        defaultIcon: 'CIRCLE',
        iconList: ['CIRCLE', 'CHECK_UNFILLED', 'CHECK_FILLED']
    })
    ,
    modules: [
        // currently not implemented
        // CalendarModule
        {
            createTaskIcon: function(icon) {
                const iconParser = new IconParser(icon);
                return iconParser;
            },
            createDOMModule: function(task) {
                const DOMElem = document.createElement('div');
                DOMElem.classList.add('task-module','calendar-module');
                const calendarIcon = this.createTaskIcon(
                    new Icon({
                        defaultIcon: 'CALENDAR',
                        iconList: ['CALENDAR']
                    })
                );
                DOMElem.appendChild(calendarIcon.parse());
                const calendarText = document.createElement('p');
                calendarText.textContent = task.dueDate;
                DOMElem.appendChild(calendarText);
                return DOMElem;
            },
            getDOMModule: function(task) {
                return this.createDOMModule(task);
            }
        }
    ],
    state: {
        state: 'unfinished',
        dueDateExceeded: false
    }
}

const ProjectConfig = {
    id: '',
    title: '',
    taskList: [],
    svgIcon: {
        pathD: "M128 0c17.7 0 32 14.3 32 32l0 32 128 0 0-32c0-17.7 14.3-32 32-32s32 14.3 32 32l0 32 48 0c26.5 0 48 21.5 48 48l0 48L0 160l0-48C0 85.5 21.5 64 48 64l48 0 0-32c0-17.7 14.3-32 32-32zM0 192l448 0 0 272c0 26.5-21.5 48-48 48L48 512c-26.5 0-48-21.5-48-48L0 192zm80 64c-8.8 0-16 7.2-16 16l0 96c0 8.8 7.2 16 16 16l96 0c8.8 0 16-7.2 16-16l0-96c0-8.8-7.2-16-16-16l-96 0z",
        viewBox: "0 0 448 512"
    }
}

const AddTaskBarConfig = {
    icon: new Icon({
        defaultIcon: 'CROSS',
        iconList: ['CROSS', 'CIRCLE']
    }),
    modules: [
        new CalendarModuleParser(),
        new DropdownModuleParser({
            options: ['High', 'Medium', 'Low'],
            defaultOption: 'Medium',
            className: 'priority-wrapper'
        })
    ]
}

export { TaskConfig, AddTaskBarConfig, ProjectConfig };