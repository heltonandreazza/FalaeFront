var app = angular.module("myApp", []);

app.controller("MyAppCtrl", function($scope, $compile, $http, $filter) {
	var vm = this;
	var prefix = "http://helton-pc:8080/MyChat/myChat/mychatsvc/";

	activate();

	//public methods
	vm.login = login;
	vm.getUsers = getUsers;
	vm.sendMessage = sendMessage;


	function activate() {
		//init my user
		vm.myUser = {};
		//init other users
		vm.users = [];

		watchSelectAll();
	}

	function login() {
		getUsers().then(function success(){
			vm.showChat = true;
			keepAlive();
			keepGetingMessages(vm.myUser);
		});
	}

	function sendMessage(myUser, sendMessage) {
		var userIds = getUsersIdSelected();

		userIds = userIds.length === vm.users.length ? [0] : userIds;

		//send messages to users
		userIds.forEach(function (id){
			$http({
				method: 'POST',
				url: prefix + 'sendMessage',
				data: {
					id: myUser.id,
					password: myUser.password,
					sendId: id,
					message: sendMessage	
				}
			}).then(function success(response) {
				console.log(response.data);
			});
		});
		
		printSendMessage(myUser.name, sendMessage);

		myUser.sendMessage = "";
	}

	function keepGetingMessages(myUser) {
		setInterval(function (){
			$http({
				method: 'POST',
				url: prefix + 'getMessages',
				data: {
					id: myUser.id,
					password: myUser.password
				}
			}).then(function success(response) {
				if( Array.isArray(response.data) ) {
					//exibir mensagens recebidas
					response.data.forEach(function (userMessage){
						printGetMessage(getUserName(userMessage.user), userMessage.message);
					});
				} else {
					//printGetMessage("computer", "Nenhuma mensagem encontrada");
				}
			}, function error(err) {
				console.log(err);
			});
		}, 1000);
	}

	function getUsers() {
		return $http({
			method: 'POST',
			url: prefix + 'getUsers',
			data: {
				id: vm.myUser.id,
				password: vm.myUser.password
			}
		}).then(function success(response) {
			vm.users = response.data; 
			getMyUserName();
		}, function error(err) {
			console.log(err);
		});
	}

	function keepAlive() {
		setInterval(function (){
			var users = getUsersIdSelected();

			getUsers().then(function success() {
				setUsersIdSelected(users);
			});
		},5000);
	}

	function getMyUserName() {
		vm.myUser.name = getUserName(vm.myUser.id);
	}

	function getUserName(id) {
		var userName = "no user name";

		vm.users.forEach(function(user) {
			if(user.id == id ) 
				return userName = user.name;
		});

		return userName;
	}

	function watchSelectAll() {
		$scope.$watch(function() {
			return vm.selectAll;
		}, function() {
			selectAll(vm.selectAll);
		}, true);
	}

	function selectAll(selectAll) {
		vm.users.forEach(function (obj){
			return obj.select = selectAll;
		});
	}

	function getUsersIdSelected() {
		var userIds = [];

		vm.users.forEach(function (user) {
			if(user.select) {
				userIds.push(user.id);
			}
		});

		return userIds;
	}

	function setUsersIdSelected(userIds) {
		vm.users.forEach(function (user){
			userIds.forEach(function (id) {
				if( user.id === id) {
					user.select = true;
				}
			});
		});
	}

	function printSendMessage(userName, message) {
		if(message) {
			var date = $filter('date')(new Date(), "dd/MM/yyyy hh:mm:ss");

			angular.element(document.getElementById('space-for-messages'))
			.append($compile('<message user=\'{ right: "true", name: "' + userName + '", message: "' + message + '", date: "' + date + '"}\'></message>')($scope));
		}

		vm.myUser.message = "";
	}

	function printGetMessage(userName, message) {
		if(message) {
			var date = $filter('date')(new Date(), "dd/MM/yyyy hh:mm:ss");

			angular.element(document.getElementById('space-for-messages'))
			.append($compile('<message user=\'{ name: "' + userName + '", message: "' + message + '", date: "' + date + '"}\'></message>')($scope));
		}
	}

})

/*
*	Directive for add messages
*/
/*app.directive("addMessages", function($compile){
	return function(scope, element, attrs){
		debugger;
		var myUser = scope.app.myUser;

		element.bind("click", function(){
			angular.element(document.getElementById('space-for-messages'))
			.append($compile('<message user=\'{ right: ' + myUser.right 
				+ ', name: ' + myUser.name 
				+ ', message: ' + myUser.message + '}\'></message>')(scope));
		});
	};
});*/

app.directive("message", function() {
	return {
		restrict: 'E',
		scope: {
			user: '=user'
		},
		templateUrl: "../views/_message.html"
	};
});