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

var ViewModel = function() {
  self = this;
  this.markerList = ko.observableArray([]);
  this.markerList.push(...markers);
}

ko.applyBindings(new ViewModel());
