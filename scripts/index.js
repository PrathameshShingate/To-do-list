console.log("hello world");

var task = [];

// TaskCards will be displayed in this container
const show_card = document.querySelector(".show-cards");

// ViewTask-ModalCards will be displayed in this container
const show_modal_card = document.querySelector(".show-modal-cards");

// TaskCard, To create a task card on UI using the data received from the form
const createCard = ({ id, url, title, type, desc }) =>
  `
    <div class='col-md-6 col-lg-4 mt-3' id=${id} key=${id}>
      <div class='task_card card shadow-sm'>
        <div class='card-header card-header d-flex gap-2 justify-content-end'>
          <button type='button' onclick='editTask.apply(this, arguments)' class='btn btn-outline-dark mr-2' name=${id}>
            <i class='fa fa-pencil-alt' name=${id}></i>
          </button>
          <button type='button' onclick='deleteTask.apply(this, arguments)' class='btn btn-outline-dark mr-2' name=${id}>
            <i class='fa fa-trash-alt' name=${id}></i>
          </button>
        </div>
        <div class='card-body'>
          ${
            url
            ? `<img width='100%' height='150px' style='object-fit: cover; object-position: center' src=${url} class='card-image-top md-3 rounded-sm'>`
            : `<img width='100%' height='150px' style='object-fit: cover; object-position: center' src='./src/blank-img.webp' class='card-image-top md-3 rounded-sm'>`
          }
          <h4 class='card-title mt-2'>${title}</h4>
          <p class='card-title'>${desc}</p>
          <div class='tags d-flex flex-wrap'>
            <span class='badge bg-info m-1'>${type}</span>
          </div>
        </div>
        <div class='card-footer'>
          <button id=${id} onclick='viewTask.apply(this, arguments)' class='btn btn-outline-dark' data-bs-toggle='modal' data-bs-target='#showTask' type='button'>
              View task
          </button>
        </div>
      </div>
    </div> 
`;

// ViewTask-ModalCard, To create a card inside the modal of the view task
const createModalCard = ({ id, url, title, type, desc }) => {
  const date = new Date(parseInt(id));
  return `
      <div class="${id}">
       
        ${
          url
            ? `<img width='100%' src=${url} class='md-3 rounded-lg'>`
            : `<img width='100%' src='./src/blank-img.webp' class='md-3 rounded-lg'>`
        }
        <strong class="text-sm text-muted">Created on ${date.toDateString()}</strong>
        <h2 class="my-3">${title}</h2>
        <p class="lead">${desc}</p>
        <span class="badge bg-info m-1">${type}</span>
      </div>
    `;
};

// Store array inside localStorage
const storeInLocalStorage = () => {
  localStorage.setItem(
    // SetItem only accepts key value pairs, and both should be string
    "task",
    JSON.stringify({
      //Stringify only accepts objects, so the array is passed inside a object
      tasks: task,
    })
  );
};

// Access the array from the localStorage & display the card on UI using that object inside the array
const removeFromLocalStorage = () => {
  // Accessing the object passed as key value inside localStorage
  const localStorage_value = JSON.parse(localStorage.task);

  // Accesing the array inside the stringify object
  if (localStorage_value) task = localStorage_value.tasks;

  // Mapping through the array of objects
  task.map((data) => {
    // creating the card using the object inside the array
    show_card.insertAdjacentHTML("beforeend", createCard(data));
  });
};

// Clear the inputs inside form before user creates a new task
const formValuesNull = () => {
  document.getElementById("image-url").value = null;
  document.getElementById("text-title").value = null;
  document.getElementById("text-type").value = null;
  document.getElementById("text-desc").value = null;
};

// Main function, when user submits the task the flow starts from here
const collectFormData = () => {
  // const id = `${Date.now()}`;
  // task.push({...form_values, id});
  const form_values = {
    id: `${Date.now()}`,
    url: document.getElementById("image-url").value,
    title: document.getElementById("text-title").value,
    type: document.getElementById("text-type").value,
    desc: document.getElementById("text-desc").value,
  };

  task.push(form_values);
  console.log(task);
  console.log(task.length);

  // To store the object in localstorage
  storeInLocalStorage();
  // To remove the input values of previous task
  formValuesNull();
};

const viewTask = (event) => {
  if (!event) {
    event = window.event;
  }

  const matchingObject = task.find(({ id }) => id === event.target.id);

  show_modal_card.innerHTML = createModalCard(matchingObject);
};

const deleteTask = (e) => {
  if (!e) e = window.event;

  const targetButtonId = e.target.getAttribute("name");
  const targetIcon = e.target.tagName;

  const deleteTask = task.filter(({ id }) => {
    return id !== targetButtonId;
  });
  task = deleteTask;
  storeInLocalStorage();

  if (targetIcon === "BUTTON") {
    return e.target.parentNode.parentNode.parentNode.parentNode.removeChild(
      e.target.parentNode.parentNode.parentNode
    );
  }
  return e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(
    e.target.parentNode.parentNode.parentNode.parentNode
  );
};

const editTask = (e) => {
  if (!e) e = window.event;
  const btntype = e.target.tagName;

  if (btntype === "BUTTON") {
    var taskCard = e.target.parentNode.parentNode;
  } else {
    var taskCard = e.target.parentNode.parentNode.parentNode;
  }

  var title = taskCard.childNodes[3].childNodes[3];
  var desc = taskCard.childNodes[3].childNodes[5];
  var type = taskCard.childNodes[3].childNodes[7].childNodes[1];
  var btn = taskCard.childNodes[5].childNodes[1];
  
  console.log(title);
  title.setAttribute("contenteditable", "true");
  desc.setAttribute("contenteditable", "true");
  type.setAttribute("contenteditable", "true");

  btn.setAttribute("onclick", "saveChanges.apply(this, arguments)");
  btn.removeAttribute("data-bs-toggle");
  btn.removeAttribute("data-bs-target");
  btn.innerHTML = "Save changes";
};

const saveChanges = (e) => {
  if (!e) e = window.event;
  const targetId = e.target.id;
  const btntype = e.target.tagName;

  if (btntype === "BUTTON") {
    var taskCard = e.target.parentNode.parentNode;
  } else {
    var taskCard = e.target.parentNode.parentNode.parentNode;
  }

  var title = taskCard.childNodes[3].childNodes[3];
  var desc = taskCard.childNodes[3].childNodes[5];
  var type = taskCard.childNodes[3].childNodes[7].childNodes[1];
  var btn = taskCard.childNodes[5].childNodes[1];

  const updatedArray = task.map(({ id }) =>
    id === targetId
      ? {
          id: targetId,
          url: task.url,
          title: title.innerHTML,
          type: type.innerHTML,
          desc: desc.innerHTML,
        }
      : task
  );

  task = updatedArray;
  storeInLocalStorage();

  title.setAttribute("contenteditable", "false");
  desc.setAttribute("contenteditable", "false");
  type.setAttribute("contenteditable", "false");

  btn.setAttribute("onclick", "viewTask.apply(this, arguments)");
  btn.setAttribute("data-bs-toggle", "modal");
  btn.setAttribute("data-bs-target", "#showTask");
  btn.innerHTML = "View task";
};

const searchTask = (e) => {
  if (!e) e = window.event;

  while (show_card.firstChild) {
    show_card.removeChild(show_card.firstChild);
  }

  const searchedResult = task.filter(({ title }) =>
    title.toUpperCase().includes(e.target.value.toUpperCase())
  );

  searchedResult.map((data) => 
    show_card.insertAdjacentHTML("beforeend", createCard(data))
  );
};
