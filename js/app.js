    var data = {};
    $(function() {
        var taskNameval, taskDescval, selectedDay, itemId;
        var startView = $('.startView')
        var daysList = startView.find('#daysList');
        var selectHide = daysList.find('#selectHide');
        var mainContentBox = $('#mainContentBox');
        var tasksTofinish = mainContentBox.find('#tasksTofinish');
        var counter = tasksTofinish.find('#counter');
        var printTasks = tasksTofinish.find('#printTasks');
        var allTaskcounterBox = mainContentBox.find('#allTaskcounterBox');
        var taskList = mainContentBox.find('#taskList');
        var removeAlltasksButton = mainContentBox.find('#removeAlltasksButton');
        var taskName = mainContentBox.find('#taskName');
        var taskDesc = mainContentBox.find('#taskDesc');
        var addTaskButton = mainContentBox.find('#addTaskButton');
        var saveAll = $('#saveAll');
        var alertSuccessbox = $('.alert-success');

        // Firebase - odczyt, zapis danych
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

        // usuwanie i edytowanie zadan
        function deleteEdittask() {
            taskList.on("click", ".delete", function() { // event na rodzicu i znalezienie po selektorze - bo sa elementy, ktorych nie ma w DOM

                    itemId = $(this).parent().index(); // szukam, w ktorym li znajduje sie button, w ktory kliknieto
                    data[selectedDay].splice(itemId, 1); //usuniecie taska z bazy danych za pomoca splice
                    $(this).parent().remove(); // usuniecie zadania ze strony, widocznosci elemntu
                    countTasks();

                })
                // event na edytowanie zadania
            taskList.on("click", ".editButton", function() {
                console.log($(this).parent().find('h3').text());
                itemId = $(this).parent().index();
                console.log(data[selectedDay][itemId]['name']);
                // ustawiam wartosc w bazie danych na aktualna wartosc tytulu i opisu - wartosc zmieniona po kliknieciu edytuj
                data[selectedDay][itemId]['name'] = $(this).parent().find('h3').text();
                data[selectedDay][itemId]['desc'] = $(this).parent().find('h4').text();
            });

        }

        // przeliczanie ilosci zadan do wykonania - w danym dniu i ogolnie
        function countTasks() {
            var allTasks = 0;
            for (var key in data) {
                allTasks = allTasks + data[key].length; // sumuje ilosc zadan w kazdym dniu
            };
            allTaskcounterBox.html(allTasks); // dodawanie ilosci zadan we wszystkich dniach
            counter.html(taskList.children().length); // dodawanie ilosci zadan w jednym, wybranym dniu
        }

        // Załadowanie bazy danych
        loadData();

        // WYBRANIE DNIA
        daysList.change(function() { // event change - wybieranie dni z listy
            mainContentBox.show(); // pokazanie boxa z zadaniami
            saveAll.show(); // pokazanie buttona zapisz
            selectHide.hide(); // po wybraniu jakiegos dnia ukrycie buttona Wybierz dzien...
            startView.removeClass('startView');
            selectedDay = daysList.find('option:selected').val(); // odczytanie jaki dzien zostal wybrany
            console.log(selectedDay)
            console.log(data[selectedDay])
            var singleDay = data[selectedDay];
            taskList.html("");
            if (singleDay === undefined) {
                singleDay = []; // tworzymy zeby moc dodawac zadania po usunieciu wszystkich zadan z jakiegos dnia
            }
            for (var i = 0; i < singleDay.length; i++) {
                // singleday[i] - numer zadania w danym dniu
                if (singleDay[i] !== undefined) {
                    taskList.append($('<li data-id=' + i + ' class="list-group-item clearfix"><h3 contenteditable="true">' + singleDay[i].name + '</h3><h4 contenteditable="true">' + singleDay[i].desc + '</h4><button class="editButton btn btn-default" title="Zaktualizuj opis zadania">zaktualizuj</button><button type="button" class="btn btn-default btn-sm pull-right delete" title="Usuń to zadanie"><span class="glyphicon glyphicon-minus"></span> Usuń</button></li>')).hide().slideDown(300); // li zawiera informacje!!
                }
            };
            countTasks(); // liczymy zadania
            printTasks.on("click", function() {
                window.print(); // drukowanie zadan - ustawione sa style tylko do druku
            })
        });

        // DODANIE ZADANIA
        addTaskButton.on("click", function(event) {
            event.preventDefault();
            var newTask = $('<li class="list-group-item clearfix">'); // nowy element li
            if (taskName.val().length > 4) {
                taskNameval = taskName.val();
                taskDescval = taskDesc.val();
                newTask.html('<h3 contenteditable="true">' + taskNameval + '</h3><h4 contenteditable="true">' + taskDescval + '</h4><button class="btn btn-default editButton" title="Zaktualizuj opis zadania">zaktualizuj</button><button type="button" class="btn btn-default btn-sm pull-right delete" title="Usuń to zadanie"><span class="glyphicon glyphicon-minus"></span> Usuń</button>');
                taskList.append(newTask); // dodajemy li do ul - kazde kolejne li bedzie ponizej
                taskName.val(""); // resetowanie inputa po dodaniu - wyczyszczenie jego tresci
                taskDesc.val("");
                if (data[selectedDay] === undefined) { // po usunieciu ostatniego zadania usuwa sie tez caly dzien. dodaje pusta [] zeby moglo dalej dzialac
                    data[selectedDay] = [];
                }
                data[selectedDay].push({ // dodanie nazwy i opisu do bazy danych
                    'name': taskNameval,
                    'desc': taskDescval,
                });
                countTasks(); // liczymy zadania

            } else {
                alert("Tytuł zadania ma mieć minimum 5 znakow");
            };
        });

        // USUNIECIE LUB EDYCJA ZADANIA
        deleteEdittask();
        removeAlltasksButton.on("click", function(fourth) { // klikam w usun wszystko i...
            fourth.preventDefault();
            taskList.html(" "); //.. usuwa a dokladniej dodaje pusta tresc do calego ul
            data[selectedDay] = []; // kasowanie zadan z danego dnia z bazy danych
            countTasks(); // liczymy zadania

        });

        // ZAPISANIE WSZYSTKICH ZMIAN
        saveAll.on("click", function() {
            console.log("zapisuje")
            alertSuccessbox.show(); // pokazanie informacji o sukcesie wyslania danych
            alertSuccessbox.find('.close').click(function() { // event na kliknieciu X
                alertSuccessbox.hide(); // ukrycie calego boxa
            });
            saveData(); // zapisujemy dane w Firebase
        })
    });
