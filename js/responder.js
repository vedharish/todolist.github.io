var currentID;
$(document).ready(function(){
  currentID = 8;
  sortable();
	$("#addToDo").keyup(function(event){
    if(event.keyCode == 13){
      addToDo();
    }
  });
  $('.todoElement').dblclick(function (){
    $(this).toggleClass('completed');
  });
  $('.clearButton').click(function (){
    $('.completed').remove();
  });
});

function addToDo(){
  todoAim = $('#addToDo').val();
  if(todoAim.length > 0){
    $('#addToDo').val("");
    var elementString = "<div class='space'><div class='todoElement' id='todoElement";
    elementString += currentID+"";
    elementString += "'><h3 class='text'>";
    elementString += todoAim;
    elementString += "</h3></div></div>";
    $(elementString).insertAfter($('#addToDo'));
    sortable();
    $('#todoElement'+currentID).dblclick(function (){
      $(this).toggleClass('completed');
    });
    currentID++;
  }
};

function sortable(){
	$('.space').sortable({
		connectWith: '.space',
		tolerance: 'intersect',
	});
	$('.space').disableSelection();
};
