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
  //TODO:throws this.clickcount not a method error if no ko.observable defined.
  this.title = ko.observable(data.title);
  this.position = data.position;
  /*
  this.infoWindow = new google.maps.InfoWindow({
    content: this.title
  });
  */
  //this.visible = true;
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
      }
    } else {
      for (marker of this.markerList()) {
        if (marker.title().indexOf(searchText) >= 0) {
          marker.visible(true);
          console.log('search match');
        } else {
          marker.visible(false);
          console.log('no match');
        }
      }
    }
  }
}

ko.applyBindings(new ViewModel());

//I guess we can't initialize map objects in ViewModel as:
//1. google map API would not have yet loaded due to async call while ViewModel is created.
//2. would that be even beneficial?: update to model could not be populated to googlemaps view as we can't add UI binding inside google maps.
function initMap() {
  googleMap = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: markers[0].position
  });

  for (marker of markerObjects) {

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
      infowindow.open(googleMap, googleMapsMarker);
    });
    //let's add googleMapMarker to our marker data model.
    //this way we can connect knockout event binding of our local data to googleMaps data.
    marker.googleMapsMarker = googleMapsMarker;
  }

}
