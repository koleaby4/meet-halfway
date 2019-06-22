$(document).ready(whoIsComingTable);

function whoIsComingTable() {
  $("#addrow").on("click", function() {
    var newRow = $(
      '<div class="participant-row row align-items-center justify-content-center">'
    );
    var cols = "";

    cols +=
      '<input type="text" class="form-control col-lg col-xl-5" name="name" placeholder="Name" />';
    cols +=
      '<input type="text" class="form-control col-lg" name="country" placeholder="Country" />';
    cols +=
      '<input type="text" class="form-control col-lg" name="postcode" placeholder="Post Code" />';
    cols +=
      '<td class="col-1 delete-participant-column block"><ion-icon name="trash" class="delete-participant badge-danger" /></td >';
    newRow.append(cols);
    $("#who-is-coming-table").append(newRow);
  });

  $("#who-is-coming-table").on("click", ".delete-participant-button", function(
    event
  ) {
    $(this)
      .closest("div")
      .remove();
  });
}

const confirmParticipant = button => {
  const row = button.parentNode;
  const participant = participantFactory(row);
  const location = fetchLocation(row, participant);
  if (location) {
    lockRow(row);
  } else {
    notifyFetchLocationFailed(row, participant);
  }
};

const fetchLocation = row => {
  console.log(`fetching location for ${row}... `);
  return null;
};

const notifyFetchLocationFailed = (row, participant) => {
  alert(`failed to fetch location for \n${JSON.stringify(participant)}`);
};

const lockRow = row => {
  Array.from(row.getElementsByTagName("input")).forEach(element =>
    element.setAttribute("disabled", "disabled")
  );

  row.removeChild(row.querySelector("[class*=confirm-participant-button]"));
};

class Participant {
  constructor(name, country, postCode) {
    this.name = name;
    this.country = country;
    this.postCode = postCode;
  }
}

const participantFactory = row => {
  const [name, country, postCode] = Array.from(
    row.getElementsByTagName("input")
  ).map(input => input.value);
  return new Participant(name, country, postCode);
};
