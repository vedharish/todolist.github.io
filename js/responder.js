var currentID;
$(document).ready(function(){
  $('.alert').hide();
  initializeTable();
  sortable();
	$("#addToDo").keyup(function(event){
    if(event.keyCode == 13){
      addToDo();
    }
  });
  $('.clearButton').click(function (){
    $('.completed').remove();
    for(var iter=1; iter<=getCurrentID(); iter++){
      if(getToDo(iter)[1]){
        storeToDo(iter, true, "");
        collect();
      }
    };
  });
  $('#closeButton').click(function(){
    $('.alert').hide();
  });
  $(window).focus(function(){
    $('.space').remove();
    for(var iter=1; iter<=getCurrentID(); iter++){
      var tempArray = getToDo(iter);
      appendToDo(iter, tempArray[0], tempArray[1]);
    };
  });
});

function collect(){
  var currentID = getCurrentID();
  var finalToDoArray = [];
  for(var iter=1; iter<=currentID; iter++){
    var tempArray = getToDo(iter);
    var tempDict = { 'todoID': iter, 'todoText': tempArray[0], 'todoIsCompleted': tempArray[1]};
    if(tempArray[0] && tempArray[0].length > 0 && !tempArray[1]) finalToDoArray.push(tempDict);
  };
  resetLocalStorage();
  for(var iter=0; iter<finalToDoArray.length; iter++){
    incrementID();
    appendToDo(getCurrentID(), finalToDoArray[iter]['todoText'], finalToDoArray[iter]['todoIsCompleted']);
    storeToDo(getCurrentID(), finalToDoArray[iter]['todoIsCompleted'], finalToDoArray[iter]['todoText']);
  };
};

function appendToDo(currentID, todoAim, isCompleted){
  if(todoAim.length > 0){
    $('#addToDo').val("");
    var spaceDiv = $('<div>').addClass('space');
    var todoDiv = $('<div>').addClass('todoElement panel').attr('id', 'todoElement'+currentID.toString());
    if(isCompleted) todoDiv.addClass('completed');
    var h3Element = $('<h3>').addClass('text panel-body').append(todoAim);
    spaceDiv.append(todoDiv.append(h3Element));
    spaceDiv.insertAfter($('#addToDo'));
    sortable();
    $('#todoElement'+currentID).dblclick(function (){
      $(this).toggleClass('completed');
      storeToDo(currentID, $(this).is('.completed'), getToDo(currentID)[0]);
    });
  }
};

function addToDo(){
  todoAim = $('#addToDo').val().trim();
  var isValid = /^([\-\,\.\w\ ]+)?$/.test(todoAim);
  if(isValid){
    incrementID();
    appendToDo(getCurrentID(), todoAim, false);
    storeToDo(getCurrentID(), false, todoAim);
  }else{
    $('.alert').show();
    $('#addToDo').val("");
  }
};

function sortable(){
	$('.space').sortable({
		connectWith: '.space',
		tolerance: 'intersect',
	});
	$('.space').disableSelection();
};

function storeToDo(todoID, isCompleted, text){
  localStorage["todoList.todo."+todoID+".text"] = text;
  localStorage["todoList.todo."+todoID+".isCompleted"] = isCompleted;
};

function getToDo(todoID){
  text = localStorage["todoList.todo."+todoID+".text"];
  isCompleted = localStorage["todoList.todo."+todoID+".isCompleted"];
  isCompleted = (isCompleted == 'true');
  return [text, isCompleted];
};

function getCurrentID(){
  return parseInt(localStorage["todoList.currentID"]);
};

function incrementID(){
  localStorage["todoList.currentID"] = getCurrentID() + 1;
};

function resetLocalStorage(){
  localStorage.clear();
  localStorage["todoList.currentID"] = 0;
  $('.space').remove();
};

function initializeTable(){
  var currentID = getCurrentID();
  if(currentID){
    for(var iter=1; iter<=currentID; iter++){
      var tempArray = getToDo(iter);
      if(tempArray[0] != ""){
        appendToDo(iter, tempArray[0], tempArray[1]);
      }
    }
  }else{
    resetLocalStorage();
    incrementID();
    appendToDo(getCurrentID(), "Sample Completed ToDo", true);
    storeToDo(getCurrentID(), true, "Sample Completed ToDo");
  }
};
