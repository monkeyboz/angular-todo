function TodoCtrl($scope) {
  $scope.todos = (localStorage.getItem('todo') != null && localStorage.getItem('todo').length > 0)?angular.fromJson(localStorage.getItem('todo')):[];
  $scope.dones = (localStorage.getItem('done') != null && localStorage.getItem('done').length > 0)?angular.fromJson(localStorage.getItem('done')):[];
  $scope.markAll = false;
  currDate = '';
  
  function showCalendar(){
	  var todo_array = [];
	  angular.forEach($scope.todos, function(todo){
		  todo_array.push({'title':todo.text,'start':todo.date}); 
	  });
	  
	  $('#calendar_holder').fullCalendar({
		  defaultDate: '2014-09-12',
		  editable: true,
		  eventLimit: true, // allow "more" link when too many events
		  events: todo_array,
	  });
  }
  
  showCalendar();
  
  $scope.changeDate = function(event){
	  if(event.keyCode == 13 && $scope.todoText && $scope.todoDate != 'Current Date'){
		  showData($scope);
      } else {
    	  $('#errors').html('Do not make date empty');
      }
  }
  
  $scope.showScope = function(){
	  if($scope.todoText && $scope.todoDate != ''){
	  	showData($scope);
  	  } else {
  		  
  	  }
  }
  
  function createNewCalendar(item,text,date){
	  var newEvent = new Object();
	  newEvent.title = text;
	  newEvent.start = date;
	  newEvent.allDay = true;
	  $('#calendar_holder').fullCalendar('renderEvent',newEvent);
  }
  
  function showData(item){
	  $('#errors').html('');
	  var text = item.todoText;
	  var date = item.todoDate;
	  item.todos.push({text:item.todoText, done:false, date:jQuery.datepicker.formatDate('mm/dd/yy',item.todoDate)});
	  item.todoText = '';
	  
	  createNewCalendar(item,text,date);
	  
	  localStorage.setItem('todo',angular.toJson(item.todos));
  }
  
  $scope.isTodo = function(){
      return $scope.todos.length > 0;  
  }
  $scope.toggleEditMode = function(){
      $(event.target).closest('li').toggleClass('editing');
  };
  $scope.editOnEnter = function(todo){
      if(event.keyCode == 13 && todo.text){
          $scope.toggleEditMode();
      }
  };
    
  $scope.remaining = function() {
    var count = 0;
    angular.forEach($scope.todos, function(todo) {
      count += todo.done ? 0 : 1;
    });
    return count;
  };
  
  $scope.updateStorage = function(){
	  localStorage.setItem('todo',angular.toJson($scope.todos));
	  showCalendar();
  };

  $scope.hasDone = function() {
      return ($scope.todos.length != $scope.remaining());
  };    
    
  $scope.itemText = function() {
      return ($scope.todos.length - $scope.remaining() > 1) ? "items" : "item";     
  };
      
  $scope.toggleMarkAll = function() {
      angular.forEach($scope.todos, function(todo) {
        todo.done =$scope.markAll;
      });
  };
  
  $scope.deleteItem = function(done){
	  var doneOld = $scope.dones;
	  $scope.dones = [];
	  
	  angular.forEach(doneOld, function(done1){
		 
		 if(done1.text == done.text && done1.date == done.date){
			 
		 } else {
			 $scope.dones.push(done1);
		 }
	  });
	  showCalendar();
	  localStorage.setItem('done',angular.toJson($scope.dones));
  }
  
  $scope.clear = function() {
    var oldTodos = $scope.todos;
    $scope.todos = [];
    angular.forEach(oldTodos, function(todo) {
      if (!todo.done){ 
    	  $scope.todos.push(todo);
      } else {
    	  $scope.dones.push(todo);
    	  var events = new Object();
    	  events.title = todo.text;
    	  events.start = todo.date;
    	  events.allDay = true;
    	  $('#calendar_holder').fullCalendar('removeEvents',function(event) { 
    		  return event.title == events.title;
    	  });
      }
    });
    
	localStorage.setItem('todo',angular.toJson($scope.todos));
	localStorage.setItem('done',angular.toJson($scope.dones));
  };   
}