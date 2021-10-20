document.querySelectorAll(".drop-zone_input").forEach(inputElement => {

    const dropZoneElement = inputElement.closest(".drop-zone");

    dropZoneElement.addEventListener("click", e => {
        inputElement.click();
    });

    inputElement.addEventListener("change", e => {
        if (inputElement.files.length) {
            updateThumbnail(dropZoneElement, inputElement.files[0]);
        }
    });

    dropZoneElement.addEventListener("dragover", e => {
        e.preventDefault();
        dropZoneElement.classList.add("drop-zone-over");

    });

    ["dragleave", "dragend"].forEach(type => {
        dropZoneElement.addEventListener(type, e => {
            dropZoneElement.classList.remove("drop-zone-over");
        });
    });

    dropZoneElement.addEventListener("drop", e => {
        e.preventDefault();

        if (e.dataTransfer.files.length) {
            inputElement.files = e.dataTransfer.files;
            updateThumbnail(dropZoneElement, e.dataTransfer.files[0]);
        }
        dropZoneElement.classList.remove("drop-zone-over");
    });
});

//Update thumbnail in dropZoneElement
function updateThumbnail(dropZoneElement, file) {

    let thumbnailElement = dropZoneElement.querySelector(".drop-zone_thumbnail");
    // Create headers for csv string data
    var csvDataDragAndDrop = "microvolts,trialstart,oddball\n";

    //Remove prompt if there is a thumbnail
    if (dropZoneElement.querySelector(".drop-zone_prompt")) {
        dropZoneElement.querySelector(".drop-zone_prompt").remove();
    }

    //First time -- there is no thumbnail elements so we will "make" one
    if (!thumbnailElement) {
        thumbnailElement = document.createElement("div");
        thumbnailElement.classList.add("drop-zone_thumbnail");
        dropZoneElement.appendChild(thumbnailElement);
    }

    thumbnailElement.dataset.label = file.name;

    //Read text files
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (e) {
        //Displays contents of text file
        csvDataDragAndDrop += e.target.result; // Add file contents to csvDataDragAndDrop
        localStorage.setItem("csvData:fileHandler.js", csvDataDragAndDrop); // Store the csv String in local storage to grab in another page
        //console.log(csvDataDragAndDrop);

        var data = csvJSON(csvDataDragAndDrop);
        var xhr = new XMLHttpRequest();
        xhr.open("POST", 'http://localhost:8000/datasets', true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(data);
    };

} //End of updateThumbnail

async function button() {
    // FILE PICKER BUTTON
    // Create headers for csv string data
    var csvDataFilePicker = "microvolts,trialstart,oddball\n"
    let [fileHandle] = await window.showOpenFilePicker();
    let fileData = await fileHandle.getFile();
    let text = await fileData.text();
    // Add file contents to csvDataFilePicker
    csvDataFilePicker += text;
    // Store the csv String in local storage to grab in another page
    localStorage.setItem("csvData:fileHandler.js", csvDataFilePicker);
    console.log(csvDataFilePicker);
}

//var csv is the CSV file with headers
function csvJSON(csv){
    var lines=csv.split("\n");
    var result = [];
    var headers=lines[0].split(",");
  
    for(var i=1;i<lines.length;i++){
  
        var obj = {};
        var currentline=lines[i].split(",");
  
        for(var j=0;j<headers.length;j++){
            obj[headers[j]] = currentline[j];
        }
        result.push(obj);
    }
    console.log(result);

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
  }