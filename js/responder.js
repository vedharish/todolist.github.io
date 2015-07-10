$(document).ready(function(){
  $('.alert').hide();
  initializeTable();
  sortable();

  // Enter to Submit ToDo
	$("#addToDo").keyup(function(event){
    if(event.keyCode == 13){
      addToDo();
      setCompletionBar();
    }
  });

  // Call clearToDo for cleanup
  $('.clearButton').click(function (){
    clearToDo();
    setCompletionBar();
  });

  // Hide alert
  $('#closeButton').click(function(){
    $('.alert').hide();
  });

  // Refill ToDos on refocusing tab
  $(window).focus(function(){
    $('.space').remove();
    showStoredToDos();
    setCompletionBar();
  });

  setCompletionBar();
});

function setCompletionBar(){
    var totElements = $('.space');
    var completeElements = $('.completed');
    var percent = 0;
    if(totElements.length > 0) percent = completeElements.length/totElements.length*100;
    $('.progress-bar').css('width', percent+'%');
};

function initializeTable(){
  // Show stored ToDos or add sample if first-time
  if(getCurrentID() || getCurrentID() == 0){
    showStoredToDos();
  }else{
    resetLocalStorage();
    incrementID();
    appendToDo(getCurrentID(), "Sample Completed ToDo", true);
    storeToDo(getCurrentID(), true, "Sample Completed ToDo");
  }
};

function clearToDo(){
  // get valid ToDos in a list, reset storage and then populate
  // so as to get serial ids
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
      setCompletionBar();
    });
  }
};

function showStoredToDos(){
  for(var iter=1; iter<=getCurrentID(); iter++){
    var tempArray = getToDo(iter);
    if(tempArray[0] != ""){
      appendToDo(iter, tempArray[0], tempArray[1]);
    }
  }
};

function sortable(){
	$('.space').sortable({
		connectWith: '.space',
		tolerance: 'intersect',
	});
	$('.space').disableSelection();
};

function getToDo(todoID){
  text = localStorage["todoList.todo."+todoID+".text"];
  isCompleted = localStorage["todoList.todo."+todoID+".isCompleted"];
  isCompleted = (isCompleted == 'true');
  return [text, isCompleted];
};

function storeToDo(todoID, isCompleted, text){
  localStorage["todoList.todo."+todoID+".text"] = text;
  localStorage["todoList.todo."+todoID+".isCompleted"] = isCompleted;
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
