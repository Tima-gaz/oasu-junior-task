import {textareaStyles} from "./textarea-styles.js"
import {generateId, generateTime, generateDate, sortTaskDown, sortTaskUp} from "./const.js";
import {getData, postData, putData, deleteData} from "./api.js";

const input = document.querySelector('.tasks__text');
const addButton = document.querySelector('.tasks__add-button');
const prioritySelect = document.querySelector('.tasks__priority select');
const taskContainer = document.querySelector('.tasks__container');
const sortFlag = document.querySelector('.sort__button');
const filter = document.querySelector('.filter');
const completedToggle = document.getElementById('checkbox__completed');
const highToggle = document.getElementById('checkbox__high');
const mediumToggle = document.getElementById('checkbox__medium');
const lowToggle = document.getElementById('checkbox__low');

let taskList = [];
let messages =[];

let isTasksSortedUp = true;

let getTasks = (tasks) => {
   for (let task of tasks) {
    taskList.push(task);
    messages.push(createTask(task))
    displayMessages(messages);
   }
}

getData(getTasks);

let displayMessages = (messages) => {
    let displayMessage =  ``;

    if(taskList.length === 0) taskContainer.innerHTML = ``;

    messages.forEach(function(item) {
      displayMessage += item
      textareaStyles();
      taskContainer.innerHTML = displayMessage;
    });
}

let createTask = (item, finishDate = null) => {
    const {task, creationDate, priority, id, isDone, isCancelled, isActive} = item;
    const creationTime = generateTime(creationDate);
    const finishTime = generateTime(finishDate);
    const isTextareaDisabled = true;

    const textareaDisabled = isTextareaDisabled
    ? `disabled`
    : ``;

    const createTaskResultTemplate = (isDone, isCancelled) => {
        if(isDone) {
          return `<p class="task__result">Done at ${finishTime}</p>`
        }
        if(isCancelled) {
            return `<p class="task__result">Cancelled at ${finishTime}</p>`
        }
        return ``
      }
    
      const createButtonsTemplate = (isActive) => {
        if(isActive) {
          return `<div class="task__buttons">
          <button class="task__done-button"></button>
          <button class="task__cancelled-button"></button>
         </div>`
        }
        return ``
      }
    
    const taskResult = createTaskResultTemplate(isDone, isCancelled, finishDate);
    const Buttons = createButtonsTemplate(isActive);

    let message = `
    <div class="task" id="${id}">
  <div class="task__priority--wrap"><p class="task__priority">${priority}</p></div>
  <div class="task__container">
   <div class="task__description">
     <div class="task__wrapper">
     <p class="task__text"><textarea class="txta" ${textareaDisabled}>${task}</textarea></p>
       ${Buttons}
     </div>
     <div class="task__dates">
       <span class="task__date">${creationTime}</span>
       ${taskResult}
     </div>
    </div>
  </div>
  <button class="task__delete-button" id="${id}"></button>
</div>
    `

  return message
}

let onClickRenderTask = () => {
  if (!input.value) return;

  let newTask = {
    id: taskList.length + 1,
    task: input.value,
    creationDate: generateDate(),
    finishDate: generateDate(),
    isActive: true,
    isDone: false,
    isCancelled: false,
    priority: prioritySelect.value
  }
  

  taskList.push(newTask);
  messages.push(createTask(newTask))
  displayMessages(messages);
  postData(newTask, newTask.id)
  input.value = ``;
}

addButton.addEventListener('click' , onClickRenderTask);

taskContainer.addEventListener('click', function(evt) {
    if(evt.target.tagName === 'TEXTAREA') {
      let textarea = evt.target;
      taskList.forEach(function(item, i) {
        if(item.task === textarea.innerHTML) {
          textarea.removeAttribute('disabled');
          textarea.focus();
          textarea.addEventListener('change', function(evt) {
            item.task = textarea.value;
            messages[i] = createTask(taskList[i]);
            displayMessages(messages);
            putData(item, item.id);
          })
        }
      })
    }

    if(evt.target.className === 'task__cancelled-button' || evt.target.className === 'task__done-button') {
        let button = evt.target;
        taskList.forEach(function(item, i) {
          let container = button.parentNode.parentNode.parentNode.parentNode.parentNode
          if(item.id == container.id) {
            item.isActive = false;
            if(button.className === 'task__cancelled-button') {item.isCancelled = true}
            if(button.className === 'task__done-button') {item.isDone = true}
            messages[i] = createTask(taskList[i], generateDate());
            displayMessages(messages);
            putData(item, item.id);
          }
        })
    }

    if(evt.target.className === 'task__delete-button') {
        let deleteButton = evt.target;
        taskList.forEach(function(item, i) {
          let container = deleteButton.parentNode
          if(item.id == container.id) {
            taskList.splice(i, 1);
            messages.splice(i, 1);
            deleteData(item.id);
          }
          displayMessages(messages);
        })
      }
});

sortFlag.addEventListener('click', function() {
  let orderedMessages = [];

  if (isTasksSortedUp) {
    taskList.sort(sortTaskDown);
  } else {
    taskList.sort(sortTaskUp)
  }
  
  for(let task of taskList) {
    orderedMessages.push(createTask(task))
  }
  messages = orderedMessages;
  displayMessages(messages);
  isTasksSortedUp = !isTasksSortedUp;
});

filter.addEventListener('change', function(evt) {
  let total = [];
  let sortedMessages = [];
//   let toggle = evt.target;

  function unique(arr) {
    let result = [];
  
    for (let str of arr) {
      if (!result.includes(str)) {
        result.push(str);
      }
    }
  
    return result;
  }

//   if(toggle.hasAttribute('checked')) {evt.target.checked = false}

  if(completedToggle.checked) {
    if(highToggle.checked) {
        taskList.forEach(function(item) {
            if(!item.isActive && item.priority === 'High') {total.push(item);}
        })
    } else if (mediumToggle.checked) {
        taskList.forEach(function(item) {
            if(!item.isActive && item.priority === 'Medium') {total.push(item);}
        })
    } else if (lowToggle.checked) {
        taskList.forEach(function(item) {
            if(!item.isActive && item.priority === 'Low') {total.push(item);}
        })
    } else {
        taskList.forEach(function(item) {
            if(!item.isActive) {total.push(item);}
        })
    }
  }
  
  if(highToggle.checked) {
    if(completedToggle.checked) {
        taskList.forEach(function(item) {
            if(!item.isActive && item.priority === 'High') {total.push(item);}
        })
    } else {
        taskList.forEach(function(item) {
            if(item.priority === 'High') {total.push(item);}
        })
    }
  }

  if(mediumToggle.checked) {
    if(completedToggle.checked) {
        taskList.forEach(function(item) {
            if(!item.isActive && item.priority === 'Medium') {total.push(item);}
        })
    } else {
        taskList.forEach(function(item) {
            if(item.priority === 'Medium') {total.push(item);}
        })
    }
  }

  if(lowToggle.checked) {
    if(completedToggle.checked) {
        taskList.forEach(function(item) {
            if(!item.isActive && item.priority === 'Low') {total.push(item);}
        })
    } else {
        taskList.forEach(function(item) {
            if(item.priority === 'Low') {total.push(item);}
        })
    }
  }

  let isChecked = lowToggle.checked || highToggle.checked || mediumToggle.checked || completedToggle.checked;

  if(total.length === 0) {
    if (!isChecked) {
      displayMessages(messages);
    } else {taskContainer.innerHTML = ``;}
  } else {
    total = unique(total);
    for (let one of total) {
        sortedMessages.push(createTask(one, one.finishDate))
    }
    displayMessages(sortedMessages);
  }

});

// highToggle.addEventListener('click', function() {
//   if(highToggle.hasAttribute('checked')) {
//       highToggle.removeAttribute('checked');
//       highToggle.isChecked = false
//     }
// })
