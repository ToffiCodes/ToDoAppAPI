/*  Nicos State Ansatz
const state = {
  todos [
    {description:"Learn HTML", done: true},
    {description:"Learn CSS", done: true},
    {description:"Learn Javascript", done: false}
  ],
};

function renderTodos(){
  const list = document.querySelector("list");
  list.innerHTML = "";

  state.todos.forEach(todo =>{

    const todoLi = document.createElement("li");

    todoLi.todoObj = todo;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;

    todoLi.appendChild(checkbox);

    const todoText = document.createTextNode(todo.description);

    newLi.append(todoText);

    list.appendChild(newLi);
  })
}

renderTodos();


const list = document.querySelector("#list");
list.addEventListener("change", (e) =>{
  const checkbox = e.target;
  const liElement = checkbox.parentElement;
  const todo = liElement.todoObj;

  todo.done = checkbox.checked;
})  */

// Leere Variable todos anlegen
let todos;

// Frage: Gibt der Local Storage beim Key "todos" null zurück?
// If: Wenn Local Storage nicht null ist:
if (localStorage.getItem("todos") !== null) {
  todos = JSON.parse(localStorage.getItem("todos"));
}
// Ansonsten (also wenn Local Storage null ist):
else {
  todos = [
    { description: "Learn JS", done: false, id: 1 },
    { description: "Learn HTML", done: true, id: 2 },
    { description: "Learn CSS", done: true, id: 3 },
  ];
}

renderTodos(todos); // welche liste gerendert wird

// Funktion, um alle Todos aus dem Array todos als DOM-Elemente auszugeben
function renderTodos(list) {
  // <ul id='todoList'>
  const todosList = document.querySelector("#todoList");

  // Leeren vorherigen Inhalt der Liste
  todosList.innerHTML = "";

  // Per forEach-Methode auf dem Array todos über jedes einzelne todo loopen und dafür eine Function ausführen:
  list.forEach(function (element) {
    // <li> erstellen und in Variable listEl speichern
    const listEl = document.createElement("li");
    const todoCheckbox = document.createElement("input");
    todoCheckbox.type = "checkbox";
    todoCheckbox.checked = element.done;
    todoCheckbox.addEventListener("change", function () {
      element.done = todoCheckbox.checked;
      saveTodos();
    });

    const todoText = document.createTextNode(element.description);
    listEl.appendChild(todoCheckbox);
    listEl.appendChild(todoText);

    // Füge eine Klasse basierend auf dem Status hinzu
    if (element.done) {
      listEl.classList.add("done");
    }

    listEl.appendChild(todoText);
    todosList.appendChild(listEl);
  });

  // Update Anzahl der Todos
  document.querySelector("#todoCount").textContent = todos.length;
}

// Funktion zum filtern todos basierend auf dem ausgewähltem Filter

document.querySelector("#AA").addEventListener("change", function (e) {
  let currentFilter = e.target.value; // open all oder done
  if (currentFilter === "all") {
    renderTodos(todos);
  } else if (currentFilter === "open") {
    const filteredTodos = todos.filter(function (todo) {
      return todo.done === false;
    });
    renderTodos(filteredTodos);
  } else if (currentFilter === "done") {
    const filteredTodos = todos.filter(function (todo) {
      return todo.done === true;
    });
    renderTodos(filteredTodos);
  }
});

// Funktion zum Speichern der Todos im Local Storage
function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

document.querySelector(".btn").addEventListener("click", function () {
  const todoInput = document.querySelector("#todoInput");
  const todoText = todoInput.value.trim(); // .trim = Alle End Leerzeichen entfernen

  if (todoText !== "") {
    // für diplikate prüfen
    const isDuplicate = todos.some(
      (todo) => todo.description.toLowerCase() === todoText.toLowerCase()
    );
    if (isDuplicate) {
      alert("Dieses Todo existiert bereits!"); //wenn duplikat dann alert
    } else {
      const newTodo = {
        description: todoText,
        done: false,
        id: Date.now(), // Eindeutige ID erzeugen
      };

      todos.push(newTodo);
      renderTodos(todos);
      saveTodos();

      todoInput.value = ""; // Eingabefeld leeren
    }
  }
});

// lösche Alles Button Eventlistener
function deleteButton() {
  todos = todos.filter((todo) => !todo.done);
  renderTodos(todos);
  saveTodos();
}

// Event listener für den "Delete Done Todos" Button
document.querySelector("#deleteButton").addEventListener("click", deleteButton);
