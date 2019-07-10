let map;
const markers = {};
let lines = [];

$(document).ready(setUp);

function setUp() {
  if (numberOfParticipants() > 0) {
    loadParticipantsFromLocalStorage();
  } else {
    addParticipantRow(false);
    if (!localStorage.tutorialWatched) {
      showHelp();
    }
  }
}

const numberOfParticipants = () =>
  Object.keys(getParticipantsFromLocalStorage()).length;

// return central location for specified participants
const centralLocation = participants => {
  if (Object.keys(participants).length <= 1) {
    return {};
  }
  const lats = [];
  const lngs = [];
  Object.values(participants).forEach(participant => {
    lats.push(participant.location.lat);
    lngs.push(participant.location.lng);
  });
  return new google.maps.LatLng(average(lats), average(lngs));
};

const average = collection =>
  collection.reduce((a, b) => a + b, 0) / collection.length;

/* drop central pin on the map
    & configure its event listenerto display address */
function setCentralPin() {
  const center = centralLocation(getParticipantsFromLocalStorage());

  if (markers[0]) {
    deleteMarker(0);
  }

  var image = {
    url: "assets/images/central-pin.svg",
    size: new google.maps.Size(71, 71),
    origin: new google.maps.Point(0, 0),
    anchor: new google.maps.Point(17, 34),
    scaledSize: new google.maps.Size(40, 40)
  };

  if (numberOfParticipants() > 1) {
    const marker = addMarker(center, "Meeting Point", "", {
      icon: image,
      title: "Central Location!",
      animation: google.maps.Animation.BOUNCE
    });

    var geocoder = new google.maps.Geocoder();
    var infowindow = new google.maps.InfoWindow();

    marker.addListener("click", () => {
      map.setZoom(18);
      map.setCenter(marker.getPosition());
      geocoder.geocode({ location: center }, function (results, status) {
        if (status === "OK") {
          infowindow.setContent(getPrintableAddress(results[0], center));
          infowindow.open(map, marker);
        } else {
          showAlert(
            "Geocode was not successful",
            `Reason: ${errorMap[status] || status}`
          );
        }
      });
    });

    markers[0] = marker;
  }
}

// format address for cetral pin
const getPrintableAddress = (geocodeResponse, fallbackLocaton) => {
  const address = geocodeResponse
    ? geocodeResponse.formatted_address
    : JSON.stringify(fallbackLocaton);
  // replace whitespaces with <br> for more compact form
  const formattedAddress = `<div id="central-pin-info-window">${address.replace(
    /\s*,\s*/g,
    "<br>"
  )}</div>`;
  return formattedAddress;
};

// pre-populate Who-is-coming form from local storage
function loadParticipantsFromLocalStorage() {
  Object.values(getParticipantsFromLocalStorage()).forEach(participant => {
    // insert a new row and populate it from local store
    addParticipantRow();
    const row = $(".participant-row").first();
    row
      .find("[name=name]")
      .first()
      .val(participant.name);
    row
      .find("[name=address]")
      .first()
      .val(participant.address);
    deleteParticipantFromLocalStorage(participant.id);
  });
}

/* add Name + Address input boxes
  followed by confirmation and deletion buttons */
function addParticipantRow(withFocusOnButton = true) {

  // opting for string HTML over JavaScript DOM manipulations
  // because it is more compact and there is no risk of HTML injections
  var newRow = $(
    '<div class="participant-row row align-items-center justify-content-center">'
  );

  let cols =
    '<input type="text" class="form-control col-12" name="name" placeholder="Name" />';
  cols +=
    '<input type="text" class="form-control col-12" name="address" placeholder="Address" />';
  cols += `<button type="button" class="btn btn-success confirm-participant-button" onclick="confirmParticipant(this)">
        <ion-icon name="checkmark" class="confirm-participant-icon"></ion-icon></button>`;
  cols += `<button type="button" class="btn btn-danger delete-participant-button" onclick="deleteParticipantRow(this)">
            <ion-icon name="trash" class="delete-participant-icon" /></button>`;

  newRow.append(cols);
  $("#who-is-coming-table").prepend(newRow);

  // option to automatically set focus to Name
  // for better (mouse-less) user experience
  if (withFocusOnButton) {
    document.querySelector("input[name='name']").focus();
  }
}

// delete a participant and trigger map updates
const deleteParticipantRow = event => {
  const div = $(event).closest("div")[0];
  const participantId = div.id;
  deleteParticipantFromLocalStorage(participantId);
  div.remove();
  deleteMarker(participantId);

  reflectChangesOnMap();
};

const deleteMarker = participantId => {
  if (markers[participantId]) {
    markers[participantId].setMap(null);
    delete markers[participantId];
  }
};

const getParticipantsFromLocalStorage = () =>
  localStorage.participants ? JSON.parse(localStorage.participants) : {};

const saveParticipantsToLocalStorage = participants =>
  localStorage.setItem("participants", JSON.stringify(participants));

const deleteParticipantFromLocalStorage = id => {
  const participants = getParticipantsFromLocalStorage();
  delete participants[id];
  saveParticipantsToLocalStorage(participants);
};

const appendParticipantToLocalStorage = participant => {
  const participants = getParticipantsFromLocalStorage();
  participants[participant.id] = participant;
  saveParticipantsToLocalStorage(participants);
};

const confirmParticipant = button => {
  const row = button.parentNode;
  const participant = participantFactory(row);

  addParticipant(participant, () => {
    lockRow(row);
    row.setAttribute("id", participant.id);
    reflectChangesOnMap();
  });

  if (document.querySelectorAll(".confirm-participant-button").length < 2) {
    addParticipantRow(true);
  }

  shakeElement('.map-view-float-button img', 5, 2)

};

const shakeElement = (selector, resetAfter, delay) => {
  document.querySelector(selector).style.animation = `button-pulse 1s ease-in-out ${delay}s`
  // reset animation - so we could use it again
  setTimeout(function () { document.querySelector(selector).style.animation = 'none' }, resetAfter * 1000);
}

const reflectChangesOnMap = () => {
  setCentralPin();
  zoomToMarkers();
  drawLines();
};

// adjust map zoom level so that all pins are visible
const zoomToMarkers = () => {
  const pins = Object.values(markers);
  var bounds = new google.maps.LatLngBounds();
  for (var i = 0; i < pins.length; i++) {
    bounds.extend(pins[i].position);
  }
  map.fitBounds(bounds);
  if (pins.length == 1) {
    map.setZoom(15);
  }
};

const addMarkerForParticipant = participant =>
  (markers[participant.id] = addMarker(
    participant.location,
    participant.name,
    getInitials(participant.name)
  ));


// draw lines from every participant to central pin
// for better visualisation of distances and locations
const drawLines = () => {
  deleteLines();

  if (markers[0] === undefined) {
    return;
  }

  Object.values(markers).forEach(marker => {
    let line = new google.maps.Polyline({
      path: [marker.position, markers[0].position],
      geodesic: true,
      strokeColor: "#53be53",
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    line.setMap(map);
    lines.push(line);
  });
};

const deleteLines = () => {
  lines.forEach(line => line.setMap(null));
  lines = [];
};

const addMarker = (location, title, label, otherProps) => {
  map.setCenter(location);
  const payload = {
    map: map,
    position: location,
    animation: google.maps.Animation.DROP,
    title,
    label,
    ...otherProps
  };

  return new google.maps.Marker(payload);
};

// given a participant - drop pin on the map
// then run callback (needed due to async nature of geocoder.geocode)
const addParticipant = (participant, callback) => {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ address: participant.address }, (results, status) => {
    if (status === "OK") {
      const location = results[0].geometry.location;
      participant.location = location;
      addMarkerForParticipant(participant);
      appendParticipantToLocalStorage(participant);
      callback();
    } else {
      showAlert(
        "Geocode was not successful",
        `Reason: ${errorMap[status] || status}`
      );
    }
  });
};

// map of more user-friendly error messages
const errorMap = {
  INVALID_REQUEST: "Address not provided",
  ZERO_RESULTS: "Address not found"
};

// custom and yet generic allert for given title and text
const showAlert = (title, text) =>
  Swal.fire({
    title,
    text,
    type: "warning",
    confirmButtonText: "Cool",
    timer: 4000
  });

// show help modal and mark it as watched ( localStorage.tutorialWatched )
// so that it does not open by default on consecutive visit
const showHelp = () =>
  Swal.fire({
    title: "User Guide",
    html: document.querySelector("#help-modal").outerHTML.toString(),
    confirmButtonText: "Cool",
    showCloseButton: true
  }).then(() => (localStorage.tutorialWatched = true));

const getInitials = name =>
  name
    .split(/\s+/)
    .map(word => word.trim()[0])
    .join("");

// make name and address read-only
// remove confirmation button
const lockRow = row => {
  Array.from(row.getElementsByTagName("input")).forEach(element => {
    if (element.name == "name") {
      // if name not provided - overwrite placeholder with a space
      element.value = element.value ? `(${getInitials(element.value)}) ${element.value}` : " ";
    }
    element.setAttribute("disabled", "disabled");
  });

  row.removeChild(row.querySelector("[class*=confirm-participant-button]"));
};

// data class for storing participant's details
class Participant {
  constructor(name, address) {
    this.name = name;
    this.address = address;
    this.id = new Date().getTime();
  }
}

// read participant's name and address from the form
// and return an initialised instance of Participant
const participantFactory = row => {
  const [name, address] = Array.from(row.getElementsByTagName("input")).map(
    input => input.value
  );
  return new Participant(name, address);
};

// initialise map on load
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 51.53037, lng: -0.173648 },
    zoom: 8,
    mapTypeControl: false,
    fullscreenControl: false
  });
}
