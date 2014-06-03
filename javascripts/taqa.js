
// Load the map
var map = L.mapbox.map('map', 'robertocarroll.taqa-3', {
    minZoom: 2,
    maxZoom: 4,
    maxBounds: [[-85, -190.0],[85, 190.0]],
    doubleClickZoom: false
});

// Customise some features
map.zoomControl.setPosition('topleft');
map.scrollWheelZoom.disable();


map.on('dblclick', function(e) {
    // Zoom exactly to each double-clicked point
    map.setView(e.latlng, map.getZoom() + 1);
});


// Load the geojson data from a file
var geoJsonData;

// Main data
var loadGeoJson =$.getJSON('taqa.geojson', function(data) {
    geoJsonData = data;
 }); // close the loading of the geojson  
       
// Add a marker layer
var mainMarkers = L.mapbox.featureLayer().addTo(map);

// set the lat/lon for marker layer
loadGeoJson.complete(function() {
  mainMarkers.setGeoJSON(geoJsonData);
});

// Create a custom icon for the main
var LeafIcon = L.Icon.extend({
                options: {                   
                    iconSize:     [32, 32],
                    iconAnchor:   [16, 16],
                    className: 'taqa-custom-icon'
                }
            });

// Customise the marker layer

mainMarkers.on('layeradd', function(e) {
    var marker = e.layer,feature = marker.feature;
     
    // this is to get the correct marker icon depending on the type 
    s = feature.properties.type;
    customIcon = new LeafIcon({iconUrl: 'images/'+s+'-off.png',iconRetinaUrl: 'images/'+s+'@2x-off.png'});

    marker.setIcon(customIcon);

});

function resetMarkers() {

  mainMarkers.eachLayer(function(e) {
        s = e.feature.properties.type;
        customIcon = new LeafIcon({iconUrl: 'images/'+s+'-off.png',iconRetinaUrl: 'images/'+s+'@2x-off.png'});
        e.setIcon(customIcon);
  });

}

// Marker clicks: Listen for individual marker clicks
var clicked = "office";
var geoProperties;

mainMarkers.on('click',function(e) {

  resetMarkers();
  
  var marker = e.layer,feature = marker.feature;
       
  // this is to get the correct marker icon depending on the type 
  s = feature.properties.type;
  customIcon = new LeafIcon({iconUrl: 'images/'+s+'-hover.png',iconRetinaUrl: 'images/'+s+'@2x-hover.png'});
  marker.setIcon(customIcon);
    
    // Force the popup closed.
    e.layer.closePopup();

     $.when(closeWindow()).then(openWindow());

    var feature = e.layer.feature;
    var info =    '<div class="' + feature.properties.type + '">' +
                       '<div class="top-image-container">'+ feature.properties.image + '<img class="imtip" src="images/' + feature.properties.type + '-off.png">' + '</div>' +
                '<h2>' + feature.properties.country + '</h2>' +
                '<h3 >' + feature.properties.title + '</h3>' +
                feature.properties.description + '</div>'; 

    $('#info').hide().html(info).fadeIn('slow');

    map.panTo(e.layer.getLatLng());

});


var closeWindow = function(){
    $("#pop").css({ right: '-100%'});

}   

var openWindow = function(){
    $( "#pop" ).animate({
          right: 0
          }, 125, function() {
            // Animation complete.
          });
}       

$('.close').click(function(){
    resetMarkers();
    closeWindow();
});


// Filters 
var setTheFilter = function(){
    mainMarkers.setFilter(function(geoJsonData) {

        geoProperties = geoJsonData.properties['type'];
        return geoProperties === clicked;
        
    });

    map.setView(new L.LatLng(25, 0), 2);

    return false;
}   

$(".toggle").click(function(event) {

    closeWindow();
    
    clicked = event.target.id;
           
    $(".toggle").removeClass('active');
     $(this).addClass('active');
    
    // The setFilter function takes a GeoJSON feature object
    // and returns true to show it or false to hide it.

    setTheFilter ();

});

setTheFilter ();
