function setMap(mapElementId, initLat, initLng, onInit, onLocationChanged){
    var initialized = !(initLat && initLng);
    bindEvent(window, 'message', function (e) {
      if (e.data.eventid == 'geolocation_selected') {
          if (onLocationChanged && initialized == true) onLocationChanged(e.data.eventdata);
      } else if (e.data.eventid == 'geolocation_loaded'){
        var map = document.getElementById(mapElementId);
        if (initLat && initLng) setLocation(map, initLat, initLng);
        if (onInit) {
          onInit(map);
        }
        initialized = true;
      }
    });
}


function bindEvent(element, eventName, eventHandler) {
  if (element.addEventListener) {
    element.addEventListener(eventName, eventHandler, false);
  } else if (element.attachEvent) {
    element.attachEvent('on' + eventName, eventHandler);
  }
};


function setVal(elementId, value) {
  var e = document.getElementById(elementId);
  if (e) {
    e.value = value;
    e.dispatchEvent(new Event('change'));
  }
}


function setText(elementId, value) {
  var e = document.getElementById(elementId);
  if (e) {
    e.textContent = value;
    e.dispatchEvent(new Event('change'));
  }
}


function addCss(elementId, cssClassName){
    var e = document.getElementById(elementId);
    if (e) {
        arr = e.className.split(" ");
        if (arr.indexOf(cssClassName) == -1) {
          e.className += " " + cssClassName;
        }
    }
}


function setCss(elementId, cssClassName){
    var e = document.getElementById(elementId);
    if (e) {
        arr = e.className.split(" ");
        if (arr.indexOf(cssClassName) == -1) {
          e.className = cssClassName;
        }
    }
}

function remCss(elementId, cssClassName){
    var e = document.getElementById(elementId);
    if (e) {
        if (cssClassName){
          if (arr.indexOf(cssClassName) != -1) {
            e.className = e.className.replace(cssClassName, "");
          }
        } else {
          e.className = "";
        }
    }
}


function setLocation(map, lat, lng) {
  if (typeof map === 'string' || map instanceof String){
    map = document.getElementById(map);
  }

  map.contentWindow.postMessage({
    eventid: 'geolocation_selected',
    eventdata: { lat, lng }
  }, '*');
}


function setMarkers(map, markers, name = 'radar') {
  map.contentWindow.postMessage({
    eventid: 'markers_selected',
    eventdata: {name: name, points: markers}
  }, '*');
}


function setZone(map, polygons, options) {
  if (typeof map === 'string' || map instanceof String) {
    map = document.getElementById(map);
  }

  map.contentWindow.postMessage({
    eventid: 'highlight_zone',
    eventdata: { polygons, options }
  }, '*');
}

function setHighlightRadius(map, radius) {
  map.contentWindow.postMessage({
    eventid: 'highlight_radius_selected',
    eventdata: radius
  }, '*');
}


function rad(deg) {
  return deg * (Math.PI/180);
}


function getDistanceInMeters(srcLat, srcLng, dstLat, dstLng) {
  var earthRadiusInMeters = 6378137.0;
  var dLat = rad(dstLat - srcLat);
  var dLng = rad(dstLng - srcLng);

  var a = Math.pow(Math.sin(dLat / 2), 2) 
          + Math.cos(rad(srcLat)) 
          * Math.cos(rad(dstLat)) 
          * Math.pow(Math.sin(dLng / 2), 2);

    return (earthRadiusInMeters * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))));
}
