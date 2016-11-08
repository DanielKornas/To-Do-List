var data = {};
$(function() {
    var taskName = $('#taskName');
    var taskNameval, taskDescval, selectedDay, itemId;
    var taskDesc = $('#taskDesc');
    var mainContentBox = $('#mainContentBox')
    var printTasks = mainContentBox.find('#printTasks');
    var addTaskButton = $('#addTaskButton');
    var taskList = $('#taskList');
    var editButton = $('.editButton');
    var daysList = $('#daysList');
    var selectHide = daysList.find('#selectHide');
    var removeAlltasksButton = $('#removeAlltasksButton');
    var tasksTofinish = $('#tasksTofinish');
    var counter = tasksTofinish.find('#counter');
    var saveAll = $('#saveAll');
    var alertSuccessbox = $('.alert-success');
    var startView = $('.startView')

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

    function deleteEdittask() {
        taskList.on("click", ".delete", function() { // event na rodzicu i znalezienie po selektorze - bo sa elementy, ktorych nie ma w DOM

            itemId = $(this).parent().index(); // szukam, w ktorym li znajduje sie button, w ktory kliknieto
            data[selectedDay].splice(itemId, 1); //usuniecie taska z bazy danych za pomoca splice
            $(this).parent().remove(); // usuniecie zadania ze strony, widocznosci elemntu
            counter.html(taskList.children().length); // odpowiednie ustawienie licznika

        })
        // event na edytowanie zadania
        taskList.on("click", ".editButton", function(){
                console.log($(this).parent().find('h3').text());
            itemId = $(this).parent().index();
            console.log(data[selectedDay][itemId]['name']);
            // ustawiam wartosc w bazie danych na aktualna wartosc tytulu i opisu - wartosc zmieniona po kliknieciu edytuj
            data[selectedDay][itemId]['name'] = $(this).parent().find('h3').text();
            data[selectedDay][itemId]['desc'] = $(this).parent().find('h4').text();
        });

    }

    loadData();

    daysList.change(function() { // event change - wybieranie dni z listy
        mainContentBox.show();
        saveAll.show();
        selectHide.hide(); // po wybraniu jakiegos dnia ukrycie buttona Wybierz dzien...
        startView.removeClass('startView');
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
            if (singleDay[i] !== undefined) {

                taskList.append($('<li data-id=' + i + ' class="list-group-item clearfix"><h3 contenteditable="true">' + singleDay[i].name + '</h3><h4 contenteditable="true">' + singleDay[i].desc + '</h4><button class="editButton btn btn-default" title="Zaktualizuj opis zadania">zaktualizuj</button><button type="button" class="btn btn-default btn-sm pull-right delete" title="Usuń to zadanie"><span class="glyphicon glyphicon-minus"></span> Usuń</button></li>')).hide().slideDown(300); // li zawiera informacje!!
            }
        }

        counter.html(taskList.children().length); // pokazanie odpowiedniej wartosci licznika
        printTasks.on("click", function(){
            window.print();
        })

    });


    addTaskButton.on("click", function(event) {

        event.preventDefault();
        var newTask = $('<li class="list-group-item clearfix">'); // nowy element li
        if (taskName.val().length > 5 && taskName.val().length < 100) {
            taskNameval = taskName.val();
            taskDescval = taskDesc.val();

            newTask.html('<h3 contenteditable="true">' + taskNameval + '</h3><h4 contenteditable="true">' + taskDescval + '</h4><button class="btn btn-default editButton" title="Zaktualizuj opis zadania">zaktualizuj</button><button type="button" class="btn btn-default btn-sm pull-right delete" title="Usuń to zadanie"><span class="glyphicon glyphicon-minus"></span> Usuń</button>');
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
            alert("Tytuł zadania ma mieć minimum 6 znakow");
        }
        // saveAll.on("click", function() {
        //     console.log("zapisuje")
        //     saveData();
        // })
    });

    saveAll.on("click", function() {
        console.log("zapisuje")
        alertSuccessbox.show(); // pokazanie informacji o sukcesie wyslania danych
        alertSuccessbox.find('.close').click(function() { // event na kliknieciu X
            alertSuccessbox.hide(); // ukrycie calego boxa
        });
        saveData();
    })

    deleteEdittask();
    removeAlltasksButton.on("click", function(fourth) { // klikam w usun wszystko i...
        console.log("dziala")
        fourth.preventDefault();
        taskList.html(" "); //.. usuwa a dokladniej dodaje pusta tresc do calego ul
        counter.html("0"); // usuwam wszystko wiec licznik = 0
        data[selectedDay] = []; // kasowanie zadan z danego dnia z bazy danych

    });
});
