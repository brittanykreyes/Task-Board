$(document).ready(function() {
    const taskModal = $('#taskModal');
    
    // Load tasks from localStorage
    loadTasks();

    // Open modal to add a new task
    $('#newTaskBtn').on('click', function() {
        taskModal.show();
    });

    // Close modal
    $('.close').on('click', function() {
        taskModal.hide();
    });

    // Save new task
    $('#saveTask').on('click', function() {
        const title = $('#taskTitle').val();
        const description = $('#taskDescription').val();
        const deadline = $('#taskDeadline').val();

        if (title && deadline) {
            const task = {
                title,
                description,
                deadline,
                status: 'to-do'
            };

            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            tasks.push(task);
            localStorage.setItem('tasks', JSON.stringify(tasks));
            taskModal.hide();
            loadTasks();
        }
    });

    // Load tasks into the columns
    function loadTasks() {
        $('.task-list').empty();
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

        tasks.forEach(task => {
            const taskElement = $(`<div class="task">${task.title}<button class="deleteBtn">Delete</button></div>`);

            // Color coding based on deadline
            const deadlineDate = dayjs(task.deadline);
            const today = dayjs();
            if (deadlineDate.isBefore(today)) {
                taskElement.addClass('overdue');
            } else if (deadlineDate.diff(today, 'day') <= 3) {
                taskElement.addClass('nearing');
            }

            // Append to appropriate column
            $(`.task-list[data-status="${task.status}"]`).append(taskElement);

            // Add delete functionality
            taskElement.find('.deleteBtn').on('click', function() {
                tasks = tasks.filter(t => t.title !== task.title);
                localStorage.setItem('tasks', JSON.stringify(tasks));
                loadTasks();
            });

            // Drag and drop functionality
            // taskElement.attr('draggable', true);
            // taskElement.on('dragstart', function(event) {
            //     $(this).addClass('dragging');
            // });

            // $('.task-list').on('dragover', function(event) {
            //     event.preventDefault();
            // });
            $(".task").draggable({
                opacity: 0.7,
                zIndex: 100
            })


            
        
        });
    }

    $('.task-list').droppable({
        // accept: '.dragging',
        drop: function(event,ui) {
            const droppedTitle = ui.draggable[0].textContent.replace("Delete", "")
            console.log(droppedTitle)

            let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            const droppedTask = tasks.find(t => t.title === droppedTitle);
            droppedTask.status = $(event.target).data('status');
            console.log(droppedTask.status)

            localStorage.setItem('tasks', JSON.stringify(tasks));
            loadTasks();
        }
      });
});
