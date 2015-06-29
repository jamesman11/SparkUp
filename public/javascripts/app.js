var myapp = angular.module('myapp', ["ui.router","ui.bootstrap"]);
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
            templateUrl: "partials/main.html.erb",
            controller: mainCtrl
        })
        .state('profile',{
            url: "/profile",
            templateUrl: "partials/profile.html.erb",
            controller: profileCtrl
        })
        .state('team', {
            url: "/team",
            templateUrl: "partials/team.html.erb",
            controller: teamCtrl
        })
        .state('org', {
            url: "/org",
            templateUrl: "partials/org.html.erb"
        })
        .state('search', {
            url: "/search/:text",
            templateUrl: "partials/search.html.erb",
            controller: searchCtrl
        })
        .state('inbox', {
            url: "/inbox",
            abstract: true,
            templateUrl: "partials/inbox.html.erb",
            controller: inboxController
        })
        .state('inbox.sent', {
            url: '/sent',
            views: {
                'request': {
                    templateUrl: 'partials/inbox_sent.html.erb',
                    controller: requestSentController
                }
            }
        })
        .state('inbox.rcv', {
            url: '/rcv',
            views: {
                'request': {
                    templateUrl: 'partials/inbox_rcv.html.erb',
                    controller: requestReceivedController
                }
            }
        });

});
myapp.controller('lhnController', lhnController)
     .controller('signUpCtrl', signUpCtrl)
     .controller('signInCtrl',signInCtrl)
     .controller('headerCtrl',headerCtrl)
     .controller('mainCtrl', mainCtrl)
     .controller('userCtrl', userCtrl)
     .controller('profileCtrl', profileCtrl)
     .controller('InboxController', inboxController)
     .controller('RequestSentController', requestSentController)
     .controller('RequestReceivedController', requestReceivedController)
     .controller('teamCtrl',teamCtrl)
     .controller('searchCtrl', searchCtrl)
     .controller('PInvModalController', pInvModalController);

myapp.filter('reverse', function() {
    return function(items) {
        return items.slice().reverse();
    };
});

function lhnController($scope) {
    $scope.lnv = {
        arr: ['active', '', '', '']
    };

    $scope.lnv.goActive = function(idx) {
        for(var i=0; i<4; i++) {
            var elem = (i == idx) ? 'active' : '';
            $scope.lnv.arr[i] = elem;
        }
    }
};

function pInvModalController($scope, $modalInstance, invInfo, avlLoc, $moduleScope) {
    $scope.pInv = {
        info: {},
        avlLoc: avlLoc
    };
    $scope.moduleScope = $moduleScope;
    $scope.pInv.info = invInfo;

    $scope.pInv.submitInvite = function(){
        var data = $scope.pInv.info;

        $.ajax({
            url: "/request",
            type: "POST",
            dataType: "json",
            data: {
                data: {
                    who: data.name,
                    when: data.time,
                    where: data.loc,
                    recipient_id: data.pid,
                    recipient_type: data.teamInvite? '0' : '1',
                    message : data.message,
                    owner_id: gon.current_user.id
                }
            },
            success: function(data){
                if($scope.moduleScope.public_invite){
                    $scope.moduleScope.public_invite.push(data);
                }
                $scope.pInv.info = {};
                $scope.pInv.closeModal();
            }
        })
    };

    $scope.pInv.closeModal = function(){
        $modalInstance.dismiss('cancel');
    }
}

function searchCtrl($scope, $location, $stateParams,$http, $modal){
    var text = $stateParams.text;
    $http.post('/user/search', {text:text}).
        success(function(data, status, headers, config) {
            $scope.init(data);
        });
    $scope.init = function(data){
        $scope.teams = data.teams;
        $scope.profiles = data.profiles;
    };
    $scope.accept = function(invitee, teamInvite) {
        var avl_loc = [
            '950 Elm San Bruno',
            '850 Cherry San Bruno',
            '640 California Sunnyvale',
            '860 California Sunnyvale'
        ];

        var info = {};

        info.teamInvite = teamInvite;
        info.img = invitee.avatar;
        info.pid = invitee.id;
        info.name = invitee.name;
        info.role = invitee.title;

        $modal.open({
            animation: 'none',
            templateUrl: '/partials/pinvite-modal.html.erb',
            controller: pInvModalController,
            size: 'pInv',
            resolve: {
                invInfo: function () {
                    return info;
                },

                avlLoc: function(){
                    return avl_loc;
                },

                $moduleScope: function(){
                    return $scope;
                }
            }
        });
    }

}
function teamCtrl($scope, $location){
    $scope.teams = gon.teams;
    $scope.getNumbers = function(team){
        var array = new Array(team.members_count);
        for(var i = 0;i>array.length;i++) array[i]= 1;
        return array;
    };
    $scope.org = function(){
        $location.path('/org');
    }
}
function inboxController($scope, $location) {
    var isReq = $location.path() === "/inbox/sent" ? false : true;
    $scope.nav = {
        sentClass: isReq ? '' : 'active',
        reqClass: isReq ? 'active' : ''
    }

    $scope.nav.clicked = function(sentPage) {
        $scope.nav.sentClass = sentPage ? 'active' : '';
        $scope.nav.reqClass = sentPage ? '' : 'active';
    }
};

function requestSentController($scope) {
    var NO_RESPONSE_MESSAGE = "No Response Yet";
    var DECLINE_MESSAGE = "Declined";
    var ACCEPT_MESSAGE = "Accepted";
    $scope.requests = gon.sent_requests;
    $scope.msgClass = function($index){
        var request = $scope.requests[$index];
        if(request.status == NO_RESPONSE_MESSAGE) return "";
        return request.status == ACCEPT_MESSAGE ? {"color": "rgb(128, 212, 161)" } : {"color": "#fc7b89" };
    }
};

function requestReceivedController($scope) {
    var NO_RESPONSE_MESSAGE = "No Response Yet";
    var DECLINE_MESSAGE = "Declined";
    var ACCEPT_MESSAGE = "Accepted";
    $scope.requests = gon.received_requests;
    $scope.is_no_response = function($index){
        var request = $scope.requests[$index];
        return request.status == NO_RESPONSE_MESSAGE;
    };
    $scope.msgClass = function($index){
        var request = $scope.requests[$index];
        return request.status == ACCEPT_MESSAGE ? {"color": "rgb(128, 212, 161)" } : {"color": "#fc7b89" };
    }
    $scope.removeRequest = function($index){
        var request = $scope.requests[$index];
        $.ajax({
            url: "request/decline/" + request.id,
            type: "POST",
            success: function(){
                request.status = DECLINE_MESSAGE;
                $scope.$apply();
            }
        })
    };
    $scope.accept = function($index){
        var request = $scope.requests[$index];
        $.ajax({
            url: "request/accept/" + request.id,
            type: "POST",
            success: function(){
                request.status = ACCEPT_MESSAGE;
                $scope.$apply();
            }
        })
    };
}

function profileCtrl($scope, $location){
    $scope.data = gon.profile;
    $scope.tags = ["User Experience","Marketing", "Engineering", "Human Resource", "Operation", "Merchandising"];
    $scope.selected_tags = $scope.data.interest ? $scope.data.interest.split(',') : [];
    $scope.addInterest = function(context){
        $scope.selected_tags.push(context.tag);
    };
    $scope.removeInterest = function($index){
        $scope.selected_tags.splice($index, 1);
    };
    $scope.cancel = function(){
        $location.path('/main');
    };
    $scope.save = function(){
        if($scope.selected_tags !== 0){
            $scope.data.interest = $scope.selected_tags.join(',');
        }
        $.ajax({
            url: "/profile/" + $scope.data.id,
            type: "PUT",
            dataType: "json",
            data: {
                data: $scope.data
            },
            success: function(data){
                alert('profile saved!');
            }
        })
    };
}
function userCtrl($scope, $location, $state){
    $scope.is_user_sign_in = gon.current_user ? true : false;
    $scope.profile_image_url = gon.profile.avatar;
    $scope.profile = function(){
      $location.path('profile');
    };
    $scope.welcome_message = function(){
        var name = gon.profile.name.split(" ")[0];
        var str = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
        return "Hello, " + str;
    };
    $scope.signout = function(){
        $.ajax({
            url: "/user/sign_out",
            type: "POST",
            success: function(data){
                $scope.is_user_sign_in = false;
                $scope.$apply();
                alert('Sign out success');
            }
        })
    };
    $scope.keyupHandler = function($event){
        if($event.keyCode == 13){
            var text = $($event.currentTarget).val();
            $location.path('/search/' + text);
        }
    };
}
function mainCtrl($scope, $location, $modal){
    $scope.public_invite = gon.all_request;
    $scope.exploreContainerStyle = function(){
      var width = $scope.public_invite.length * 391;
        return {"width": width + "px" }
    };
    $scope.just_joined_profile_list = [
        {
            name: 'James Man',
            role: 'Sr Software Engineer',
            image_url: '/images/jamesman.jpg'
        },
        {
            name: 'Xinxin Dai',
            role: 'Sr Software Engineer',
            image_url: '/images/xinxin.png'
        },
        {
            name: 'Cici Liu',
            role: 'ItemSetup Manager',
            image_url: '/images/cici.png'
        },
        {
            name: 'Zhaochang He',
            role: 'UX Designer',
            image_url: '/images/xiaozhao.jpg'
        }
    ];
    $scope.checkSelf = function($index){
        var invite = $scope.public_invite[$scope.public_invite.length - $index - 1];
        var profile = invite.profile;
        return gon.current_user.id === profile.user_id;
    };
    $scope.interestTag = function(object){
        switch (object.who){
            case 'Human Resource': return 'HR';
            case 'User Experience': return 'UX';
            case 'Global Product User Experience': return 'UX';
            case 'Global Product Apparel Item Setup': return'IST';
            case 'Engineering Team': return 'DEV';
            default: return 'HR';
        }
      console.log(object);
    };
    $scope.popular_team_list = [
        {
            name: 'User Experience',
            num_of_invite: 500
        },
        {
            name: 'Merchandise',
            num_of_invite: 400
        },
        {
            name: 'Personalization',
            num_of_invite: 400
        }
    ];

    $scope.invite = {
        avl_teams: gon.teams,
        avl_loc: [
            '950 Elm San Bruno',
            '850 Cherry San Bruno',
            '640 California Sunnyvale',
            '860 California Sunnyvale'
        ],

        selected: {
            team: '',
            time: '',
            loc: '',
            message: ''
        }
    };
    $scope.mthBonus = {
        img: '/images/fernando.png',
        name: 'Fernando Madeira',
        role: 'President & CEO of walmart.com',
        intro: 'I am one of the judge of Walmart Hack day',
        pid: 4
    };
    $scope.submitInvite = function(){
        var data = $scope.invite.selected;
        var team = _.find($scope.invite.avl_teams, function(team){ return team.name === $scope.invite.selected.team});
        $.ajax({
            url: "/request",
            type: "POST",
            dataType: "json",
            data: {
                data: {
                    who: team.name,
                    when: data.time,
                    where: data.loc,
                    message : data.message,
                    recipient_id: team.id,
                    recipient_type: 0,
                    owner_id: gon.current_user.id
                }
            },
            success: function(data){
                $scope.public_invite.push(data);
                $scope.invite.selected = {
                    team: '',
                    time: '',
                    loc: '',
                    message: ''
                };
                $scope.$apply();
                alert('public invite sent!');
            }
        })
    };

    $scope.pInv = {};
    $scope.sendInvite = function($index){
        var invite = $scope.public_invite[$scope.public_invite.length - $index - 1];
        var profile = invite.profile;
        var person = {
            img: profile.avatar,
            pid: profile.user_id,
            name: profile.name,
            role: profile.title,
            teamInvite: false
        }
        $scope.pInv.initInvite(person);
    };
    $scope.pInv.initInvite = function (pInfo) {
        var info = {};

        info.img = pInfo.img;
        info.pid = pInfo.pid;
        info.name = pInfo.name;
        info.role = pInfo.role;
        info.teamInvite = pInfo.teamInvite;

        $modal.open({
            animation: $scope.animationsEnabled,
            templateUrl: '/partials/pinvite-modal.html.erb',
            controller: pInvModalController,
            size: 'pInv',
            resolve: {
                invInfo: function () {
                    return info;
                },

                avlLoc: function(){
                    return $scope.invite.avl_loc;
                },

                $moduleScope : function(){
                    return $scope;
                }
            }
        });
    };


};
function signInCtrl($scope, $location){
    $scope.initialize = function () {
        $scope.user_data = {
            username : "",
            password : ""
        }
    };
    $scope.login = function(){
        var location = $location;
        $.ajax({
            url: "/user/login",
            type: "POST",
            dataType: "json",
            data: {
                user_data: $scope.user_data
            },
            success: function(data){
                location.path('/main');
                $scope.$apply();
            },
            error: function(){
                alert('login failures');
            }
        })
    };
    $scope.cancel = function(){
        $location.path('/main');
    }
}
function signUpCtrl($scope, $location){
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
    },
    $scope.tags = ["User Experience","Marketing", "Engineering", "Human Resource", "Operation", "Merchandising"];
    $scope.selected_tags = $scope.data.interest ? $scope.data.interest.split(',') : [];
    $scope.addInterest = function(context){
        $scope.selected_tags.push(context.tag);
    };
    $scope.removeInterest = function($index){
        $scope.selected_tags.splice($index, 1);
    };
    $scope.cancel = function(){
        $location.path('/main');
    };
    $scope.save = function(){
        if($scope.selected_tags !== 0){
            $scope.data.interest = $scope.selected_tags.join(',');
        }
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
    };
};

function headerCtrl($scope,$location){
    $scope.home = function(){
        $location.path('main');
    }
}