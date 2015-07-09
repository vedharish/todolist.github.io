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
      }
    };
  });
  $('#closeButton').click(function(){
    $('.alert').hide();
  });
});

function appendToDo(currentID, todoAim, isCompleted){
  if(todoAim.length > 0){
    $('#addToDo').val("");
    var elementString = "";
    if(isCompleted){
      elementString += "<div class='space'><div class='todoElement panel completed' id='todoElement";
    }else{
      elementString += "<div class='space'><div class='todoElement panel' id='todoElement";
    }
    elementString += currentID.toString();
    elementString += "'><h3 class='text panel-body'>";
    elementString += todoAim;
    elementString += "</h3></div></div>";
    $(elementString).insertAfter($('#addToDo'));
    sortable();
    $('#todoElement'+currentID).dblclick(function (){
      $(this).toggleClass('completed');
      storeToDo(currentID, $(this).is('.completed'), getToDo(currentID)[0]);
    });
  }
};

function addToDo(){
  todoAim = $('#addToDo').val().trim();
  var isValid = /^([\w\ ]+)?$/.test(todoAim);
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
  if(isCompleted == 'true'){
    isCompleted = true;
  }else{
    isCompleted = false;
  }
  return [text, isCompleted];
};

function getCurrentID(){
  return parseInt(localStorage["todoList.currentID"]);
};

function incrementID(){
  localStorage["todoList.currentID"] = getCurrentID() + 1;
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
    localStorage["todoList.currentID"] = 0;
    incrementID();
    appendToDo(getCurrentID(), "Sample Completed ToDo", true);
    storeToDo(getCurrentID(), true, "Sample Completed ToDo");
  }
};
