function compareFiles() {
  var file1 = document.getElementById("file1").files[0];
  var file2 = document.getElementById("file2").files[0];

  if (!file1 || !file2) {
    alert("Please select two files.");
    return;
  }

  var formData = new FormData();
  formData.append("file1", file1);
  formData.append("file2", file2);

  fetch("/compare", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("differences").innerText = data.differences;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
