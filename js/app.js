let googleMap = undefined;

let markerObjects = [];

let markers = [{
    title: 'Hot dogs',
    position: {
      lat: -25.363,
      lng: 131.044
    }
  },
  {
    title: 'WC',
    position: {
      lat: -25.353,
      lng: 131.034
    }
  },
  {
    title: 'Info',
    position: {
      lat: -25.353,
      lng: 131.014
    }
  },
  {
    title: 'First aid',
    position: {
      lat: -25.313,
      lng: 131.034
    }
  },
  {
    title: 'Bar',
    position: {
      lat: -25.313,
      lng: 131.014
    }
  },
  {
    title: 'Terrace',
    position: {
      lat: -25.303,
      lng: 131.004
    }
  }
];

let Marker = function(data) {
  this.title = ko.observable(data.title);
  this.position = data.position;
  this.visible = ko.observable(true);
};


var ViewModel = function() {
  self = this;
  this.markerList = ko.observableArray([]);
  for (marker of markers) {
    let markerObject = new Marker(marker);
    markerObjects.push(markerObject);

  }
  this.markerList.push(...markerObjects);


  this.selectMarker = function(item, event) {
    google.maps.event.trigger(item.googleMapsMarker, 'click');
    //TODO:could centering be done by binding selected marker and creating bustom binder that would center map if selected marker is changed?
    googleMap.setCenter(item.googleMapsMarker.getPosition());
  }

  this.searchUpdate = function(item, event) {
    let searchText = event.target.value;

    //if no search text given, set all results visible
    if (searchText.length === 0) {
      for (marker of this.markerList()) {
        marker.visible(true);
        marker.googleMapsMarker.setVisible(true);
      }
    } else {
      for (marker of this.markerList()) {
        if (marker.title().indexOf(searchText) >= 0) {
          if (!marker.visible()) {
            marker.googleMapsMarker.setVisible(true);
          }
          marker.visible(true);

        } else {
          marker.visible(false);
          marker.googleMapsMarker.setVisible(false);
        }
      }
    }
  }
}

ko.applyBindings(new ViewModel());

function buildWikiSearchUrl(pattern) {
    let base_url = "https://en.wikipedia.org/w/api.php";
    let format = "&format=json";
    let request_url = "?action=query&format=json&list=search&srsearch=";
    let url = base_url + request_url + pattern;
    return url;
}

//I guess we can't initialize map objects in ViewModel as:
//1. google map API would not have yet loaded due to async call while ViewModel is created.
//2. would that be even beneficial?: update to model could not be populated to googlemaps view as we can't add UI binding inside google maps.
function initMap() {
  googleMap = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: markers[0].position
  });

  for (marker of markerObjects) {
    if (marker.visible()) {

      let infowindow = new google.maps.InfoWindow({
        content: marker.title()
      });

      let googleMapsMarker = new google.maps.Marker({
        title: marker.title(),
        position: marker.position,
        searched: false,
        map: googleMap
      });

      googleMapsMarker.addListener('click', function() {

        let url = buildWikiSearchUrl(this.title);
        $.ajax( {
            type: "GET",
            url: url,
            dataType: 'jsonp',
            success: function(data) {
                //TODO: why this.title here will be undefined?
                infowindow.setContent(data.query.search[0].title + '<br/>' + data.query.search[0].snippet);
                infowindow.open(googleMap, googleMapsMarker);
            },
            error: function(errorMessage) {
                 console.log("damnn");
                 infowindow.open(googleMap, googleMapsMarker);
              }
        });
      });
      //let's add googleMapMarker to our marker data model.
      //this way we can connect knockout event binding of our local data to googleMaps data.
      marker.googleMapsMarker = googleMapsMarker;
    }
  }
}
