const container = document.querySelector(`.container`);

const render = (container, template, place) => {
    container.insertAdjacentHTML(place, template);
  };

  var xhr = new XMLHttpRequest();

  xhr.responseType = 'json';
  
  xhr.addEventListener('load', function () {
    console.log(xhr.response);
  });
  
  xhr.open('GET', 'http://127.0.0.1:3000/items');
  xhr.send();

const createTemplate = () => {
    return (
      `<div>
        
      </div>`
    );
  };

  render(container, createTemplate(), `beforeend`);