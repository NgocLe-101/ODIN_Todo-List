import '../style.css';

const input = document.querySelector('.add-task-container input');
input.addEventListener('focus',()=> {
    const addTaskIconWrapper = document.querySelector('.icon-wrapper');
    addTaskIconWrapper.querySelector('.onfocus').classList.add('show');
    addTaskIconWrapper.querySelector('.default').classList.remove('show');
});
input.addEventListener('focusout',()=> {
    const addTaskIconWrapper = document.querySelector('.icon-wrapper');
    addTaskIconWrapper.querySelector('.onfocus').classList.remove('show');
    addTaskIconWrapper.querySelector('.default').classList.add('show');
})