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
            console.log(e.target.result);
            
        };

    // //Show thumbnail for text files
    // if (file.type.startsWith("text/")) {
    //     var file = e.dataTransfer.files[0];
    //     const reader = new FileReader();

    //     reader.readAsDataURL(file);
    //     reader.onload = () => {
    //         thumbnailElement.style.backgroundImage = `url('${ reader.result }')`;
            
    //     };
    // } else {
    //     thumbnailElement.style.backgroundImage = null;
    // }

}

async function button() {
    let [fileHandle] = await window.showOpenFilePicker();
    let fileData = await fileHandle.getFile();
    let text = await fileData.text();
    console.log(text);
}