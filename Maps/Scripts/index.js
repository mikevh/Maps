var app = angular.module('maps', ['ngCookies']);

app.controller('Index', function($scope, $http, $cookies, $q) {
    var map;
    var openInfoWindow;

    $scope.markers = [];

    $scope.toggleGroup = function (obj) {
        obj.Show = !obj.Show;

        $cookies['showCategory' + obj.Id] = obj.Show ? '1' : '0';

        $scope.markers.forEach(function(m) {
            if (m.CategoryId == obj.Id) {
                m.setMap(obj.Show ? map : null);
            }
        });
    };

    $scope.addMarker = function (loc, show) {
        var marker = new google.maps.Marker({
            position: new google.maps.LatLng(loc.Latitude, loc.Longitude),
            map: show ? map : null,
            title: loc.Name,
            animation: google.maps.Animation.DROP,
            CategoryId: loc.CategoryId
        });
        $scope.markers.push(marker);

        var infowindow = new google.maps.InfoWindow({
            content: '<a href="/Location/Details/' + loc.Id + '">' + loc.Name + '</a><p>Category: ' + loc.Category.Name + '</p>'
        });

        google.maps.event.addListener(marker, 'click', function() {
            if (openInfoWindow != null) {
                openInfoWindow.close();
            }
            openInfoWindow = infowindow;
            infowindow.open(map, marker);
        });
    };

    $scope.initializeMap = function (center) {
        var mapOptions = {
            zoom: 7,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map($('#map-canvas')[0], mapOptions);

        google.maps.event.addListener(map, 'center_changed', function () {
            var c = map.getCenter(); // c.lb, c.mb
            $cookies.lat = c.lb.toString();
            $cookies.lng = c.mb.toString();
            $scope.$apply(); // this handler is executed outside of scope
        });
    };
    
    var locationsP = $http.get('/api/location');
    var categoriesP = $http.get('/api/category').success(function (data) {
        data.forEach(function (cat) {
            var key = 'showCategory' + cat.Id;
            if ($cookies[key] == undefined) {
                $cookies[key] = '1';
            }
            cat.Show = $cookies[key] == '1';
        });
        $scope.categories = data;
    });

    $q.all([categoriesP, locationsP]).then(function (results) {
        results[1].data.forEach(function (loc) {
            var show = $cookies['showCategory' + loc.CategoryId] == '1';
            $scope.addMarker(loc, show);
        });
    });
    
    var mapCenter = new google.maps.LatLng($cookies.lat || 47.22, $cookies.lng || -120.72);
    
    $scope.initializeMap(mapCenter);
});
