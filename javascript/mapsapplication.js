var locationDetails = function(){
	// The following array is used to store information for each point in a marker...
	var areaDetails = [{
		areaName:"Rådhusstræde 5",
		areaDescription:"Eatery",
		areaStr:"Copenhagen",
		streetView:"http://maps.googleapis.com/maps/api/streetview?size=400x200&location=r%C3%A5dhusstr%C3%A6de",
		latLng:{
			lat:55.676964,
			lng:12.574255
		}, 
	},
	{ 	areaName:"Amagertorv 11",
		areaDescription:"The Foot Locker",
		areaStr: "Copenhagen",
		streetView:"http://maps.googleapis.com/maps/api/streetview?size=400x200&location=amagertorv%2011",
		latLng:{
			lat:55.678665,
			lng:12.578270
		},
	},{	
		areaName:"Valkendorfsgade 7",
		areaDescription:"Royal Bagel",
		areaStr: "Copenhagen",
		streetView:"http://maps.googleapis.com/maps/api/streetview?size=400x200&location=valkendorfsgade",
		latLng:{
			lat:55.680077,
			lng:12.577937
		},
	},
	{	areaName:"Nørre Voldgade 94",
		areaDescription:"Netto (Shopping)",
		areaStr:"Copenhagen",
		streetView:"http://maps.googleapis.com/maps/api/streetview?size=400x200&location=N%C3%B8rre%20Voldgade%2094",
		latLng:{
			lat:55.683752,
			lng:12.573103
		},
	},
	{
		areaName: "Søborg Hovedgade 29",
		areaDescription: "Pizza Perfecto",
		areaStr: "Copenhagen",
		streetView:"http://maps.googleapis.com/maps/api/streetview?size=400x200&location=S%C3%B8borg%20Hovedgade%2029",
		latLng:{
			lat: 55.730302,
			lng: 12.521172
		},
	},
	{
		areaName: "Herlev Ringvej 75",
		areaDescription: "Hospital",
		areaStr: "Copenhagen",
		streetView:"http://maps.googleapis.com/maps/api/streetview?size=400x200&location=Herlev%20Ringvej%2075",
		latLng:{
			lat: 55.731009,
			lng: 12.443272
		},
	},
	{
		areaName: "Frederiksborgvej 9",
		areaDescription: "Q8 Tankstation",
		areaStr: "Copenhagen",
		streetView: "http://maps.googleapis.com/maps/api/streetview?size=400x200&location=Frederiksborgvej%209",
		latLng:{
			lat:55.812721,
			lng: 12.376593
		},
	}];

	var ViewModel = function(){
		var self = this;
		//SELF could be used to replace THIS
		self.googleMap = new google.maps.Map(document.getElementById('displayMap'),{
			center:{
				lat: 55.676097,
				lng: 12.568337
			},
			zoom:3
	});
	self.allLocations = [] // empty array for the locations
	areaDetails.forEach(function(location){   //will loop through the location function
		self.allLocations.push(new Location(location)); // the push will execute after each time when creating a new location
	});
    // adding a map maker after looping through
	self.allLocations.forEach(function(location){
		var contentString = '<div class="text-center row">' +'<h1>' + location.areaName + '</h1>' + '<h2>' + location.areaDescription+
		'<img class="img-responsive" src=" ' + location.streetview + '">' + "<div id='content'></div>" + '</div>';

		var markerOptions = {
			map: self.googleMap,
			position:location.latLng,
			draggable: false,
			animation: google.maps.Animation.DROP,
			content: contentString
		};

		location.marker = new google.maps.Marker(markerOptions);

		location.marker.infoWindow = new google.maps.InfoWindow ({
			position:location.latLng,
			content:contentString
		});

		location.marker.infoWindow.setContent(location.marker.content);

		location.marker.addListener('click', function toggleBounce(){
			location.marker.infoWindow.open(self.googleMap);
			getApi();
			if (location.marker.getAnimation() !== null){
				place.marker.setAnimation (null);

			} else{
				location.marker.setAnimation(google.maps.Animation.BOUNCE);
			}
			setTimeOut (function (){
				location.marker.setAnimation(null);

			}, 1400);
		});
		var getApi = function(){

			var windowContent = $('content');
			var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + location.areaStr + '&format=json&callback=wikiCallback';
			var wikiRequestTimeOut = setTimeOut (function(){
				windowContent.text("cannot connect to the wiki material");
			}, 8000);

			$.ajax ({
				url: wikiUrl, 
				dataType: "jsonp",
				success: function (response){
					var articleList = response[1];
					var i;
					var articleStr;
					var url;
					windowContent.text('');
					for (i= 0; i<articleList.length; i+=1){
						articleStr = articleList[i];
						url = 'http://en.wikipedia.org/wiki/' + articleStr;
                        windowContent.append('<li class="text-center"><a href="' + url + '">' + articleStr + '</a></li>');
					}
					clearTimeOut(wikiRequestTimeOut);
				}
			});
		};
	});
	// observable ARRAY to show when marker is visible
	self.visible = ko.observableArray();
	// used to loop through the location
	self.allLocations.forEach(function(location){
		self.visible.push(location);
	});
	self.userInput =ko.observable('');

	self.filterMarkers = function(){
		var searchInput = self.userInput().toLowerCase();
		self.visible.removeAll();

		self.allLocations.forEach(function(location){
			location.marker.setMap(null);

			if (location.areaDescription.toLowerCase().indexOf(searchInput) !== -1){
				self.visible.push(location);
			};
		});
		self.visible().forEach(function(location){
			location.marker.setMap (self.googleMap);

		});
	};
	function Location(dataObj){
		this.areaName = dataObj.areaName;
		this.areaDescription = dataObj.areaDescription;
		this.streetView = dataObj.streetView;
		this.latLng = dataObj.latLng;
		this.areaStr = dataObj.areaStr;

		this.openInfoWindow = function(){
			this.marker.infoWindow.open(self.googleMap, this.marker);
		};
		this.marker = null;
	};
};
	ko.applyBindings(new ViewModel());
};