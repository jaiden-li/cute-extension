document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task-input');
  const addBtn = document.getElementById('add-btn');
  const checklist = document.getElementById('checklist');

  chrome.storage.local.get({ tasks: [] }, (result) => {
    result.tasks.forEach(task => renderTask(task.text, task.checked));
  });


  addBtn.addEventListener('click', handleAddTask);


  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleAddTask();
  });

  function handleAddTask() {
    const text = taskInput.value.trim();
    if (text === '') return;

    renderTask(text, false);
    saveTasks();
    taskInput.value = '';
  }

  function renderTask(text, isChecked) {
    const li = document.createElement('li');
    const id = 'task-' + Date.now() + Math.random().toString(36).substr(2, 4);

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = id;
    checkbox.checked = isChecked;

    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = text;

    checkbox.addEventListener('change', saveTasks);

    li.appendChild(checkbox);
    li.appendChild(label);
    checklist.appendChild(li);
  }

  function saveTasks() {
    const tasks = [];
    checklist.querySelectorAll('li').forEach(li => {
      const checkbox = li.querySelector('input[type="checkbox"]');
      const label = li.querySelector('label');
      tasks.push({
        text: label.textContent,
        checked: checkbox.checked
      });
    });
    chrome.storage.local.set({ tasks });
  }
});
