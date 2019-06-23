let map;
const markers = {};

$(document).ready(setUp);

function setUp() {
  if (Object.keys(getParticipantsFromLocalStorage()).length) {
    loadParticipantsFromLocalStorage();
  } else {
    addRowToWhoIsComingTable();
  }
}

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
  const lat = lats.reduce((a, b) => a + b, 0) / lats.length;
  const lng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
  return new google.maps.LatLng(lat, lng);
};

async function setCentralPin(participants) {
  const center = centralLocation(participants);

  if (markers[0]) {
    deleteMarkerFor(0);
  }

  const marker = addMarker(center, "", {
    icon: { url: "http://maps.google.com/mapfiles/ms/icons/green.png" },
    animation: google.maps.Animation.BOUNCE
  });

  markers[0] = await marker;
}

function loadParticipantsFromLocalStorage() {
  Object.values(getParticipantsFromLocalStorage()).forEach(participant => {
    addRowToWhoIsComingTable();
    const row = $(".participant-row").last();
    row
      .find("[name=name]")
      .first()
      .val(participant.name);
    row
      .find("[name=country]")
      .first()
      .val(participant.country);
    row
      .find("[name=postcode]")
      .first()
      .val(participant.postCode);
    deleteParticipantFromLocalStorage(participant.id);
  });
}

function addRowToWhoIsComingTable() {
  document.querySelector("#addrow").click();
}

function addParticipantRow() {
  var newRow = $(
    '<div class="participant-row row align-items-center justify-content-center">'
  );

  let cols =
    '<input type="text" class="form-control col-lg col-xl-5" name="name" placeholder="Name" />';
  cols +=
    '<input type="text" class="form-control col-lg" name="country" placeholder="Country" />';
  cols +=
    '<input type="text" class="form-control col-lg" name="postcode" placeholder="Post Code" />';
  cols += `<button type="button" class="btn btn-success confirm-participant-button" onclick="confirmParticipant(this)">
        <ion-icon name="checkmark" class="confirm-participant-icon"></ion-icon></button>`;
  cols += `<button type="button" class="btn btn-danger delete-participant-button" onclick="deleteParticipantRow(this)">
            <ion-icon name="trash" class="delete-participant-icon" /></button>`;
  newRow.append(cols);
  $("#who-is-coming-table").append(newRow);
  document.querySelector("#addrow").scrollIntoView(false);
}

const deleteParticipantRow = event => {
  const div = $(event).closest("div")[0];
  const participantId = div.id;
  deleteParticipantFromLocalStorage(participantId);
  div.remove();
  deleteMarkerFor(participantId);

  setCentralPin(getParticipantsFromLocalStorage());
};

const deleteMarkerFor = participantId => {
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

  addParticipant(participant);
  lockRow(row);
  row.setAttribute("id", participant.id);

  setCentralPin(getParticipantsFromLocalStorage());
};

const addMarkerForParticipant = async participant => {
  const marker = addMarker(participant.location, getInitials(participant.name));
  markers[participant.id] = await marker;
};

const addMarker = (location, label, otherProps) => {
  map.setCenter(location);
  const payload = {
    map: map,
    position: location,
    animation: google.maps.Animation.DROP,
    label: label,
    ...otherProps
  };

  return new google.maps.Marker(payload);
};

const addParticipant = async participant => {
  const geocoder = new google.maps.Geocoder();

  geocoder.geocode(
    { address: `${participant.country}, ${participant.postCode}` },
    (results, status) => {
      if (status === "OK") {
        const location = results[0].geometry.location;
        participant.location = location;
        addMarkerForParticipant(participant);
        appendParticipantToLocalStorage(participant);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    }
  );
};

const getInitials = name =>
  name
    .split(/\s+/)
    .map(word => word.trim()[0])
    .join("");

const notifyFetchLocationFailed = (row, participant) => {
  alert(`failed to fetch location for \n${JSON.stringify(participant)}`);
};

const lockRow = row => {
  Array.from(row.getElementsByTagName("input")).forEach(element => {
    if (element.name == "name") {
      element.value = `(${getInitials(element.value)}) ${element.value}`;
    }
    element.setAttribute("disabled", "disabled");
  });

  row.removeChild(row.querySelector("[class*=confirm-participant-button]"));
};

class Participant {
  constructor(name, country, postCode) {
    this.name = name;
    this.country = country;
    this.postCode = postCode;
    this.id = new Date().getTime();
  }
}

const participantFactory = row => {
  const [name, country, postCode] = Array.from(
    row.getElementsByTagName("input")
  ).map(input => input.value);
  return new Participant(name, country, postCode);
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 51.53037, lng: -0.173648 },
    zoom: 8
  });
}
