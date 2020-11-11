export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

export const generateDate = () => {
    const currentDate = new Date();
    
    return currentDate;
};

export const generateTime = (date) => {
    const currentDate = new Date(date);
    
    let dd = currentDate.getDate();
    if (dd < 10) dd = '0' + dd;

    let mm = currentDate.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    let yy = currentDate.getFullYear();
    
    let hours = currentDate.getHours();
    if (hours < 10) hours = '0' + hours
    if (hours == 0) hours = '00'

    let minutes = currentDate.getMinutes();
    
    if (minutes < 10) minutes = '0' + minutes
    if (minutes == 0) minutes = '00'

    return dd + '/' + mm + '/' + yy + ' ' + hours + ':' + minutes;
  };

const getWeightForNullDate = (dateA, dateB) => {
    if (dateA === null && dateB === null) {
      return 0;
    }
  
    if (dateA === null) {
      return 1;
    }
  
    if (dateB === null) {
      return -1;
    }
  
    return null;
  };
  
export const sortTaskUp = (taskA, taskB) => {
    const weight = getWeightForNullDate(taskA.creationDate, taskB.creationDate);
  
    if (weight !== null) {
      return weight;
    }
  
    return taskA.creationDate.getTime() - taskB.creationDate.getTime();
};
  
export const sortTaskDown = (taskA, taskB) => {
    const weight = getWeightForNullDate(taskA.creationDate, taskB.creationDate);
  
    if (weight !== null) {
      return weight;
    }
  
    return taskB.creationDate.getTime() - taskA.creationDate.getTime();
};
