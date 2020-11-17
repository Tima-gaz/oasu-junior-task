const URL  = "http://127.0.0.1:3000/items";

export const getData = (successHandler) => {
    let xhr  = new XMLHttpRequest()
    xhr.open('GET', URL, true)
    xhr.onload = function () {
        let task = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            successHandler(task);
        } else {
            console.error(task);
        }
    }
    xhr.send(null);
}

export const postData = (data, successHandler) => {
    let json = JSON.stringify(data);

    let xhr = new XMLHttpRequest();
    xhr.open("POST", URL, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onload = function () {
        let task = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4) {
            console.table(task);
        } else {
            console.error('failed to load:',task);
        }
    }
    xhr.send(json);
}

export const putData = (data, id) => {
    let json = JSON.stringify(data);

    let xhr = new XMLHttpRequest();
    xhr.open("PUT", URL+ `/${id}`, true);
    xhr.setRequestHeader('Content-type','application/json; charset=utf-8');
    xhr.onload = function () {
        let task = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4) {
            console.table(task);
        } else {
            console.error(task);
        }
    }
    xhr.send(json);
}

export const deleteData = (id) => {
    let xhr = new XMLHttpRequest();
    xhr.open("DELETE", URL+ `/${id}`, true);
    xhr.onload = function () {
        let task = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4) {
            console.table(task);
        } else {
            console.error(task);
        }
    }
    xhr.send(null);
}
