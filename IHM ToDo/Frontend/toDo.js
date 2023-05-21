//Variables que controlan el acceso a las APIs

let updateMode = false;
let switchMode = false;

//Funcion que cancela la eliminacion de una tarea

const cancelDeleteButton = document.getElementById('cancelDeleteButton')
cancelDeleteButton.addEventListener('click', function () {
    const confirmDeleteDialog = document.getElementById('confirmDeleteDialog')
    confirmDeleteDialog.close();
});

//Funcion que confirma la eliminacion de una tarea

const confirmDeleteButton = document.getElementById('confirmDeleteButton')
confirmDeleteButton.addEventListener('click', () => {
    const id = document.getElementById('idToDelete');

    fetch('http://localhost:9000/delete.php?id=' + id.value)
        .then(() => {
            alert('Registro eliminado');
            showTasks();
        })
});

//Funcion que cancela la actualizacion de una tarea

const cancelUpdateButton = document.getElementById('cancelUpdateButton')
cancelUpdateButton.addEventListener('click', function () {
    const cancelUpdateDialog = document.getElementById('confirmUpdateDialog')
    cancelUpdateDialog.close();
});

//Funcion que confirma la actualización de la tarea y llama a la función
//Insert para actualizar los datos

const confirmUpdateButton = document.getElementById('confirmUpdateButton')
confirmUpdateButton.addEventListener('click', function () {
    updateMode = true;
    insert();
});

function insert() {

    //Constantes que recogen el valor de las variables de las tareas

    let id = document.getElementById('id').value;
    let name = document.getElementById('task_name').value;
    let description = document.getElementById('task_description').value;
    let date = document.getElementById('task_date').value;
    let status = document.getElementById('status').value;

    //Se cargan los datos de las fechas de la tarea y de hoy

    const dateToday = new Date();
    let dateTaks = new Date(date);

    //Se verifica que los datos colocados

    if (!updateMode && !switchMode) {

        //Se verifica que se haya colocado nombre y fecha

        if (name == '' || date == '') {
            alert('Debes colocar un nombre y fecha')
            return
        }

        //Se verifica que la fecha actual sea menor a la fecha de la tarea

        if (dateToday > dateTaks) {
            alert('La fecha de la tarea no puede ser una fecha pasada')
            return
        }
    }

    //Condicional que sobreescribe las variables en caso de haber una actualización

    if (updateMode) {

        id = document.getElementById('idToUpdate').value;
        name = document.getElementById('update_name').value;
        description = document.getElementById('update_description').value;
        date = document.getElementById('update_date').value;
        status = document.getElementById('status').value;

        //Se verifica que la fecha anterior sea menor a la fecha de la tarea

        dateTaks = date;

        //Se verifica que se haya colocado nombre y fecha

        if (name == '' || date == '') {
            alert('Debes colocar un nombre y fecha')
            return
        }

        if (dateToday > dateTaks) {
            alert('La fecha de la tarea no puede ser una fecha pasada')
            return
        }

    }


    //Constructor

    const task_register = {
        id: id,
        task_name: name,
        task_description: description,
        task_date: date,
        status: status
    };

    //Condicional que accede al API correspondiente, por defecto insert

    let apiFile = 'insert.php';
    if (switchMode == true) apiFile = 'switchStatus.php';
    else {
        if (updateMode == true) apiFile = 'update.php';
    }
    fetch(`http://localhost:9000/${apiFile}`, { method: "post", body: JSON.stringify(task_register) })
        .then(() => {
            showTasks()
            updateMode = false;
            switchMode = false;
        })
        .catch((error) => {
            console.log(error);
            alert("No se pudo registrar la tarea");
        });
}

//Funcion que pide la lista de tareas

function showTasks() {
    fetch("http://localhost:9000/lists.php")
        .then(response => data = response.json())
        .then(data => {
            const tasks = data
            renderTasks(tasks)
        })
        .catch(error => {
            console.log(error)
            alert("Error al listar las tareas")
        })
}

//Funcion que muestra la lista de tareas

function renderTasks(tasks) {

    //Se llama primero a la funcion que limpia la tabla antes de mostrarla de nuevo para evitar duplicarla

    clearTasks();

    //Ordena los elementos para poner los completados al último

    tasks.sort(function (a, b) {
        // Comparar por el atributo 'nombre'
        return a.task_status.localeCompare(b.task_status);
    });



    //Bucle que va mostrando uno a uno las tareas guardadas en la base de datos



    for (let i = 0; i < tasks.length; i++) {

        //Se crean las columnas para cada variable 

        const colName = document.createElement('td');
        const colDescription = document.createElement('td');
        const colDate = document.createElement('td');
        const colStatus = document.createElement('td');
        const updateTd = document.createElement('td');
        const deleteTd = document.createElement('td');
        const changeStatus = document.createElement('td');

        //Se coloca el texto en de las variables a las columnas

        colName.innerHTML = tasks[i].task_name;
        colDescription.innerHTML = tasks[i].task_description;
        colDate.innerHTML = tasks[i].task_date;
        colStatus.innerHTML = tasks[i].task_status;


        //Se verifica si la tarea se ha atrasado para cambiar su estado a "Atrasada"

        const dateToday = new Date();
        const dateTaks = new Date(colDate.innerHTML);

        if (dateToday > dateTaks && colStatus.innerHTML == 'Pendiente') {
            colStatus.innerHTML = 'Atrasada';
            colStatus.style.color = 'red';
        } else if (colStatus.innerHTML == 'Pendiente') {
            colStatus.style.color = '#805003';
        } else {
            colStatus.style.color = 'green';
        }

        //Se crea un boton para actualizar los datos    

        const buttonUpdate = document.createElement('button');
        buttonUpdate.setAttribute('class', 'btn btn-info');
        buttonUpdate.innerHTML = 'Editar';
        buttonUpdate.style.marginLeft = '1rem';

        //Se crea un boton para eliminar los datos    

        const buttonDelete = document.createElement('button');
        buttonDelete.setAttribute('class', 'btn btn-danger')
        buttonDelete.innerHTML = 'Eliminar';
        buttonDelete.style.marginLeft = '1rem';

        //Se crea un checkbox para cambiar el estado de la tarea

        const buttonSwitchStatus = document.createElement('input');
        buttonSwitchStatus.setAttribute('type', 'checkbox');
        buttonSwitchStatus.setAttribute('class', 'buttonTask');

        //Funcion que verifica si el estado de la tarea es "Completada", de ser así, hacer que el atributo checked
        //del checkbox sea true, en caso contrario, hace que un atributo que no es necesario sea true

        buttonSwitchStatus.setAttribute(tasks[i].task_status == 'Realizada' ? 'checked' : 'required', true)
        buttonSwitchStatus.innerHTML = 'Completada';

        //En funcion a la comprobación anterior, el condicional comprueba si el atributo checked del checkbox es true
        //Para llamar a la función switchStatus y cambiar el Estado de la tarea

        if (buttonSwitchStatus.getAttribute('checked'))
            buttonSwitchStatus.setAttribute('onclick', `switchStatus('${tasks[i].id}', 'Pendiente')`)
        else
            buttonSwitchStatus.setAttribute('onclick', `switchStatus('${tasks[i].id}', 'Realizada')`)

        //Al darle click al boton buttonUpdate, se llama a una funcion que rellena el formulario 

        buttonUpdate.setAttribute('onclick', `fillForm('${tasks[i].id}', '${tasks[i].task_name}', 
        '${tasks[i].task_description}','${tasks[i].task_date}', 
        )`);

        //Al darle click al boton buttonDelete, se llama a una funcion que elimina la tarea 

        buttonDelete.setAttribute('onclick', `confirmDelete('${tasks[i].id}', '${tasks[i].task_name}', 
        '${tasks[i].task_description}','${tasks[i].task_date}',
        )`);

        //Se colocan a los botones como hijos de las columnas antes de añadir las columnas a la fila

        updateTd.appendChild(buttonUpdate)
        deleteTd.appendChild(buttonDelete)
        changeStatus.appendChild(buttonSwitchStatus)
        changeStatus.style.paddingLeft = '2rem'

        //Se crea una fila y se añaden las columnas

        row = document.createElement('tr');
        row.setAttribute('class', 'tasks_data');

        row.appendChild(changeStatus);
        row.appendChild(colName);
        row.appendChild(colDescription);
        row.appendChild(colDate);
        row.appendChild(colStatus);
        row.appendChild(buttonUpdate);
        row.appendChild(buttonDelete);
        row.appendChild(updateTd);
        row.appendChild(deleteTd);

        //Se captura la tabla y se añade la fila a la tabla

        const table = document.getElementById('task_table');
        table.appendChild(row);

        //Se aplica el estilo a todas las filas pares para mejor diferenciar su separacion
        //Esto se hace en JS porque la tabla task_table no comparte el estilo

        let rows = table.getElementsByTagName("tr");
        for (i = 0; i < rows.length; i++) {

            if (i % 2 == 0) {
                rows[i].style.backgroundColor = "#97979738";
            }
        }

    }
}

//Funcion que cambia el estado de Pendiente a Completada o viceversa y recibe de valores el id y es estado de la tarea

function switchStatus(id, status) {

    //Se capturan los valores del id y el estado en constantes

    const txtId = document.getElementById('id');
    txtId.value = id;
    const txtStatus = document.getElementById('status');
    txtStatus.value = status;

    //Se cambia la variable switchMode a true para que se llame a switchStatus.php

    switchMode = true;

    //Se llama a la funcion insert para actualizar los datos

    insert();
}

//Funcion que muestra el cuadro de dialogo update para la edición de una tarea

function fillForm(id, name, description, date) {

    //Se captura el cuadro de dialogo update y se muestra
    const confirmUpdateDialog = document.getElementById('confirmUpdateDialog');
    confirmUpdateDialog.showModal();


    //Se capturan los valores del id, nombre, descripcion y fecha en constantes 
    //Para mostrarse en el cuadro de dialogo update

    const updateName = document.getElementById('update_name')
    updateName.value = name;
    const updateDescription = document.getElementById('update_description')
    updateDescription.value = description;
    const updateDate = document.getElementById('update_date');
    updateDate.value = date;
    const idUpdate = document.getElementById('idToUpdate');
    idUpdate.value = id;

}

//Funcion que muestra el cuadro de dialogo delete para confirmar la eliminación de una tarea

function confirmDelete(id, name, description, date) {

    //Se captura el cuadro de dialogo delete y se muestra

    const confirmDeleteDialog = document.getElementById('confirmDeleteDialog');
    confirmDeleteDialog.showModal();

    //Se capturan los valores del id, nombre, descripcion y fecha en constantes
    //Para mostrarse en el cuadro de dialogo delete

    const spanName = document.getElementById('span_name')
    spanName.innerHTML = name;
    const spanDescription = document.getElementById('span_description')
    spanDescription.innerHTML = description;
    const spanDate = document.getElementById('span_date');
    spanDate.innerHTML = date;
    const idDelete = document.getElementById('idToDelete');
    idDelete.value = id;
}

//Funcion que elimina las tareas antes de actualizarlas para evitar que se duplica

function clearTasks() {
    const tasks = document.getElementsByClassName('tasks_data');
    const arrayTasks = [...tasks];
    arrayTasks.map(task => task.remove());
}