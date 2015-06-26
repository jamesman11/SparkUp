var myapp = angular.module('myapp', ["ui.router"]);
myapp.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/main");
    $stateProvider
        .state('signup', {
            url: "/signup",
            templateUrl: "partials/signup.html.erb",
            controller: signUpCtrl
        })
        .state('signin', {
            url: "/signin",
            templateUrl: "partials/signin.html.erb",
            controller: signInCtrl
        })
        .state('main',{
            url: "/main",
            templateUrl: "partials/main.html.erb"
        })
});
myapp.controller('signUpCtrl', signUpCtrl).controller('signInCtrl',signInCtrl);
function signInCtrl($scope, $location){
    $scope.initialize = function () {
        $scope.user_data = {
            username : "",
            password : ""
        }
    };
}
function signUpCtrl($scope, $location){
    $scope.initialize = function () {
        $scope.data ={
            location : "",
            name : "",
            title : "",
            description : "",
            interest : ""
        },
        $scope.user_data = {
            username : "",
            password : ""
        }
    };

    $scope.save = function(){
        $.ajax({
            url: "/user",
            type: "POST",
            dataType: "json",
            data: {
                profile: $scope.data,
                user_data : $scope.user_data
            },
            success: function(data){
                alert('sign up success');
            }
        })
    };
    $scope.cancel = function(){
        $location.path('/main');
    }
};