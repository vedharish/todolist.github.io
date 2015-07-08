$(document).ready(function(){
	$('.space').sortable({
		connectWith:'.space',
		tolerance:'intersect',
		over:function(event,ui){
		},
		receive:function(event, ui){
		},
	});
	$('.space').disableSelection();
});
