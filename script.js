// Definiere die API-Endpunkt-URL
const apiUrl = "http://localhost:4730/todos/";

// Lade Todos von der API
function loadTodosFromApi() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      todos = data;
      renderTodos(todos);
    })
    .catch((error) => console.error("Fehler beim Laden der Todos:", error));
}

// Speichere neue Todos in der API
function saveTodoToApi(newTodo) {
  fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newTodo),
  })
    // Anfrage gut? Ja, ansonsten fehler
    .then((response) => {
      if (!response.ok) {
        throw new Error("Fehler beim Hinzufügen des Todos auf dem Server");
      }
      return response.json();
    })
    // dann füge es der Liste hinzu
    .then((data) => {
      todos.push(data);
      renderTodos(todos);
    })
    .catch((error) => console.error("Fehler beim Speichern des Todos:", error));
}

// Aktualisiere das Todo in der API
function updateTodoOnApi(todo) {
  fetch(apiUrl + todo.id, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todo),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Fehler beim Aktualisieren des Todos auf dem Server.");
      }
      console.log("Todo erfolgreich aktualisiert.");
    })
    .catch((error) =>
      console.error("Fehler beim Aktualisieren des Todos:", error)
    );
}

// Lösche erledigte Todos von der API nach Filter
function deleteDoneTodosFromApi() {
  const doneTodos = todos.filter((todo) => todo.done);
  doneTodos.forEach((doneTodo) => {
    fetch(apiUrl + doneTodo.id, {
      method: "DELETE",
    })
      // löschen erflgreich? Ja, ansonsten fehler
      .then((response) => {
        if (!response.ok) {
          throw new Error("Fehler beim Löschen des Todos vom Server");
        }
        console.log("Todo erfolgreich vom Server gelöscht.");
      })
      .catch((error) => console.error("Fehler beim Löschen des Todos:", error));
  });
  // Alle Todos filtern nach löschung
  todos = todos.filter((todo) => !todo.done);
  renderTodos(todos);
}

// Füge ein neues Todos hinzu
document.querySelector(".btn").addEventListener("click", function () {
  const todoInput = document.querySelector("#todoInput");
  const todoText = todoInput.value.trim();

  // überprüfung ob Eingabefeld leer ist
  if (todoText !== "") {
    const newTodo = {
      description: todoText,
      done: false,
    };

    // Eingabefeld wird wieder leer
    saveTodoToApi(newTodo);
    todoInput.value = "";
  }
});

//Filter für All, open, done

document.querySelectorAll('input[name="filter"]').forEach((radio) => {
  radio.addEventListener("change", function () {
    const filteredValue = document.querySelector(
      'input[name="filter"]:checked'
    ).value;
    applyFilter(filteredValue);
  });
});

function applyFilter(filteredValue) {
  let filteredTodos = [];
  if (filteredValue === "all") {
    filteredTodos = todos;
  } else if (filteredValue === "pending") {
    filteredTodos = todos.filter((todo) => !todo.done);
  } else if (filteredValue === "done") {
    filteredTodos = todos.filter((todo) => todo.done);
  }
  renderTodos(filteredTodos);
}

// Lösche erledigte Todos
document
  .querySelector("#deleteButton")
  .addEventListener("click", deleteDoneTodosFromApi);

// Initialize
document.addEventListener("DOMContentLoaded", loadTodosFromApi); // Seite wird erst vollständig geladen

// Todos rendern
function renderTodos(list) {
  const todosList = document.querySelector("#todoList");
  todosList.innerHTML = "";

  list.forEach((todo) => {
    const listItem = document.createElement("li");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    // Change event für Checkbox
    checkbox.addEventListener("change", function () {
      todo.done = checkbox.checked;
      updateTodoOnApi(todo);
    });
    const todoText = document.createTextNode(todo.description);
    listItem.appendChild(checkbox);
    listItem.appendChild(todoText);
    // überprüfen, ob Todo erledigt
    if (todo.done) {
      listItem.classList.add("done");
    }
    // fügt todo zur Liste hinzu
    todosList.appendChild(listItem);
  });

  document.querySelector("#todoCount").textContent = list.length;
}
