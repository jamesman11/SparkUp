var myapp = angular.module('myapp', ["ui.router"]);
myapp.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/main");
    $stateProvider
        .state('signup', {
        url: "/signup",
        templateUrl: "partials/signup.html.erb"
    })
        .state('main',{
        url: "/main",
        templateUrl: "partials/main.html.erb"
    })
})