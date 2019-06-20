$(document).ready(whoIsComingTable);

function whoIsComingTable() {
  $("#addrow").on("click", function() {
    var newRow = $("<tr class='row justify-content-center'>");
    var cols = "";

    cols +=
      '<td class="col-lg col-xl-5"><input type="text" class="form-control" name="name" placeholder="Name" /></td >';
    cols +=
      '<td class="col-lg"><input type="text" class="form-control" name="country" placeholder="Country" /></td>';
    cols +=
      '<td class="col-lg"><input type="text" class="form-control" name="postcode" placeholder="Post Code" /></td>';
    cols +=
      '<td class="col-1 delete-participant-column block"><ion-icon name="trash" class="delete-participant badge-danger" /></td >';
    newRow.append(cols);
    $("table.who-is-coming").append(newRow);
  });

  $("table.who-is-coming").on("click", ".delete-participant", function(event) {
    $(this)
      .closest("tr")
      .remove();
  });
}
