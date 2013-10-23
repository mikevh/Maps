var app = angular.module('maps', ['ngCookies']);

app.controller('Index', function($scope, $http, $cookies) {
    console.log('Index controller()');

    var map;
    var openInfoWindow;

    $scope.markers = [];

    $scope.toggleGroup = function (obj) {
        obj.Show = !obj.Show;

        $scope.markers.forEach(function(m) {
            if (m.CategoryId == obj.Id) {
                m.setMap(obj.Show ? map : null);
            }
        });
    };

    $scope.showMarkers = function(locations) {
        locations.forEach(function (loc) {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(loc.Latitude, loc.Longitude),
                map: map,
                title: loc.Name,
                animation: google.maps.Animation.DROP,
                CategoryId: loc.CategoryId
            });
            $scope.markers.push(marker);

            var contentString = '<a href="/Location/Details/' + loc.Id + '">' + loc.Name + '</a>' +
                '<p>Category: ' + loc.Category.Name + '</p>';
            var infowindow = new google.maps.InfoWindow({
                content: contentString,
            });

            google.maps.event.addListener(marker, 'click', function() {
                if (openInfoWindow != null) {
                    openInfoWindow.close();
                }
                openInfoWindow = infowindow;
                infowindow.open(map, marker);
            });
        });
    };

    var cook;

    $scope.initializeMap = function (center) {
        cook = $cookies;
        console.log('initializeMap()');

        console.log($cookies.lat);
        console.log($cookies.lng);

        var mapOptions = {
            zoom: 7,
            center: center,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map($('#map-canvas')[0], mapOptions);

        google.maps.event.addListener(map, 'center_changed', function () {
            
            var c = map.getCenter();
            
            var lt = c.lb.toString();
            var lg = c.mb.toString();

            cook.lat = lt;
            cook.lng = lg;
        });
    };
    
    var mapCenter = new google.maps.LatLng($cookies.lat || 47.22,$cookies.lng || -120.72);

    $scope.initializeMap(mapCenter);

    $http.get('/api/location').success(function (data) {
        console.log('get /api/location success');
        $scope.showMarkers(data);
    }).error(function (data) { alert(data); });

    $http.get('/api/category').success(function (data) {
        console.log('get /api/category success');
        data.forEach(function (cat) {
            cat.Show = true;
        });
        $scope.categories = data;
    });
});
