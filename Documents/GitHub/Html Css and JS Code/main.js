function renderMainPage(){
    console.log("Integreting wih Main.Html");

    //accessed the div tag
    var divtag = document.getElementById("demo-div");

    // created a new button to be displayed by JS
    var submitButton = document.createElement("button");

    //set props on button
    submitButton.innerHTML = "Submitttttt";

    divtag.appendChild(submitButton);

    //when submit clicked, console should log "CLickeddddd"
    submitButton.addEventListener("click",
    () => {console.log("clickedddd!!!!!")});

    submitButton.addEventListener("click",
    () => {alert('submit clicked')});
}

renderMainPage();
