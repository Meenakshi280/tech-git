/*
  ┌─────────────────────────────────────────────────────────────┐
  │  LAYER 3: BEHAVIOR + DATA  (JavaScript = the "brain")        │
  │  This makes the app DO things: add a task, tick it off,      │
  │  delete it — and REMEMBER them even after you close the tab. │
  │                                                              │
  │  Read it top-to-bottom like a recipe. Every step is labelled.│
  └─────────────────────────────────────────────────────────────┘
*/

// STEP 1 — Grab the pieces of the page we need to talk to.
// (Think of these like naming the "input box" and "list" so we can use them.)
const form      = document.getElementById("task-form");
const input     = document.getElementById("task-input");
const list      = document.getElementById("task-list");
const emptyNote = document.getElementById("empty-note");
// FEATURE: Task Progress — the counter text + the "clear completed" button
const footer    = document.getElementById("footer");
const counter   = document.getElementById("counter");
const clearBtn  = document.getElementById("clear-btn");

// STEP 2 — This is the app's MEMORY (its "data").
// We load any tasks saved from last time; if none, we start empty.
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// STEP 3 — Save the current tasks to the browser so they survive a refresh.
// (This is a tiny version of what a real "database" does in big apps.)
function save() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// STEP 4 — Draw the tasks onto the screen.
// Whenever the data changes, we re-draw so the screen always matches reality.
function render() {
  list.innerHTML = ""; // clear the screen first

  // Show or hide the "no tasks yet" note.
  emptyNote.style.display = tasks.length === 0 ? "block" : "none";

  // FEATURE: Task Progress — update the counter and the clear button.
  const doneCount = tasks.filter(function (t) { return t.done; }).length;
  counter.textContent = tasks.length + " tasks · " + doneCount + " done";
  footer.style.display = tasks.length === 0 ? "none" : "flex";      // hide footer when list is empty
  clearBtn.style.display = doneCount === 0 ? "none" : "inline-block"; // only show button if there's something to clear

  // For each task in memory, build one row on the page.
  tasks.forEach(function (task, index) {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    // The task text — clicking it toggles "done".
    const text = document.createElement("span");
    text.textContent = task.text;
    text.onclick = function () {
      tasks[index].done = !tasks[index].done; // flip done/not-done
      save();
      render();
    };

    // The delete button.
    const del = document.createElement("button");
    del.textContent = "✕";
    del.className = "delete-btn";
    del.onclick = function () {
      tasks.splice(index, 1); // remove this task from memory
      save();
      render();
    };

    li.appendChild(text);
    li.appendChild(del);
    list.appendChild(li);
  });
}

// STEP 5 — When the user submits the form (clicks "Add" or presses Enter):
form.addEventListener("submit", function (event) {
  event.preventDefault();          // stop the page from reloading
  const value = input.value.trim(); // read what they typed
  if (value === "") return;         // ignore empty input

  tasks.push({ text: value, done: false }); // add to memory
  input.value = "";                          // clear the box
  save();                                    // remember it
  render();                                  // show it
});

// FEATURE: Task Progress — when "Clear completed" is clicked,
// keep only the tasks that are NOT done, then save + redraw.
clearBtn.addEventListener("click", function () {
  tasks = tasks.filter(function (t) { return !t.done; });
  save();
  render();
});

// STEP 6 — Draw everything once when the app first opens.
render();
