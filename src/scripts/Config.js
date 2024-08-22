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
        pathD: "M0 96C0 78.3 14.3 64 32 64l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 128C14.3 128 0 113.7 0 96zM0 256c0-17.7 14.3-32 32-32l384 0c17.7 0 32 14.3 32 32s-14.3 32-32 32L32 288c-17.7 0-32-14.3-32-32zM448 416c0 17.7-14.3 32-32 32L32 448c-17.7 0-32-14.3-32-32s14.3-32 32-32l384 0c17.7 0 32 14.3 32 32z",
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