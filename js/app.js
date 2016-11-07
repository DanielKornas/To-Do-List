var data = {};
$(function() {
    var taskName = $('#taskName');
    var taskNameval, taskDescval, selectedDay, taskListallLi, itemId;
    var taskDesc = $('#taskDesc');
    var infoBox = $('#infoBox')
    var addTaskButton = $('#addTaskButton');
    var taskList = $('#taskList');
    var daysList = $('#daysList');
    var selectHide = daysList.find('#selectHide');
    var removeAlltasksButton = $('#removeAlltasksButton');
    var tasksTofinish = $('#tasksTofinish');
    var counter = tasksTofinish.find('#counter');
    var saveAll = $('#saveAll');

    function loadData() {
        firebase
            .database()
            .ref('tasks')
            .on('value', function(getFromfirebase) {
                data = getFromfirebase.val();
            });
    }


    function saveData(day) {
        firebase
            .database()
            .ref('tasks')
            .set(data);
    }

    function deleteTask() {

        taskListallLi = taskList.find('.delete');
        console.log(taskListallLi)
        taskList.on("click", ".delete", function() { // event na rodzicu i znalezienie po selektorze - bo sa elementy, ktorych nie ma w DOM

            itemId = $(this).parent().index(); // szukam, w ktorym li znajduje sie button, w ktory kliknieto
            data[selectedDay].splice(itemId, 1); //usuniecie taska z bazy danych za pomoca splice
            $(this).parent().remove(); // usuniecie zadania ze strony, widocznosci elemntu
            counter.html(taskList.children().length); // odpowiednie ustawienie licznika

        })


    }


    loadData();
    infoBox.hide();
    // counter.html("0");

    daysList.change(function() { // event change - wybieranie dni z listy
        infoBox.show();
        selectHide.hide(); // po wybraniu jakiegos dnia ukrycie buttona Wybierz dzien...
        selectedDay = daysList.find('option:selected').val(); // odczytanie jaki dzien zostal wybrany
        console.log(selectedDay)
        console.log(data[selectedDay])
        var singleDay = data[selectedDay];
        taskList.html("");
        if (singleDay === undefined) {
            singleDay = [];
        }
        for (var i = 0; i < singleDay.length; i++) {
            // singleday[i] - numer zadania w danym dniu
            console.log(singleDay.length)
            if (singleDay[i] !== undefined) {

                taskList.append($('<li data-id=' + i + '><h1>' + singleDay[i].name + '</h1><h2>' + singleDay[i].desc + '</h2><button class="delete">Delete</button></li>')).hide().slideDown(300); // li zawiera informacje!!

            }
        }
        counter.html(taskList.children().length);



    });


    addTaskButton.on("click", function(event) {

        event.preventDefault();
        var newTask = $("<li>"); // nowy element li
        // przykladowy warunek
        if (taskName.val().length > 5 && taskName.val().length < 100) {
            taskNameval = taskName.val();
            taskDescval = taskDesc.val();

            newTask.html('<h1>' + taskNameval + '</h1><h2>' + taskDescval + '</h2><button class="delete">Delete</button>');
            taskList.append(newTask); // dodajemy li do ul - kazde kolejne li bedzie ponizej

            taskName.val(""); // resetowanie inputa po dodaniu - wyczyszczenie jego tresci
            taskDesc.val("");

            counter.html(taskList.children().length);


            if (data[selectedDay] === undefined) { // po usunieciu ostatniego zadania usuwa sie tez caly dzien. dodaje pusta [] zeby moglo dalej dzialac
                data[selectedDay] = [];
            }
            data[selectedDay].push({ // dodanie nazwy i opisu do bazy danych
                'name': taskNameval,
                'desc': taskDescval,
            });

        } else {
            alert("Zadanie może być dodane tylko gdy jego treść ma więcej niż pięć, a mniej niż sto znaków.");
        }
        // saveAll.on("click", function() {
        //     console.log("zapisuje")
        //     saveData();
        // })
    });

    saveAll.on("click", function() {
        console.log("zapisuje")
        saveData();
    })

    deleteTask();

    removeAlltasksButton.on("click", function(fourth) { // klikam w usun wszystko i...
        console.log("dziala")
        fourth.preventDefault();
        taskList.html(" "); //.. usuwa a dokladniej dodaje pusta tresc do calego ul
        counter.html("0"); // usuwam wszystko wiec licznik = 0
        data[selectedDay] = []; // kasowanie zadan z danego dnia z bazy danych

    });
});
