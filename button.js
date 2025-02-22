let citation = null;
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("I AM ALIVEEEEEE");
    if (message.action ==="sendButtonInfo") {
        console.log("Received message in button:", message.data);
        citation = message.data;
        //line below needs to change the h1 in the popup to the citation text
        let popupElement = document.getElementById('citation');
        popupElement.innerHTML = citation;



    }
});



document.addEventListener('DOMContentLoaded', function() {
    let citeButton = document.getElementById('mybutton');
    citeButton.addEventListener('click', function() {
        chrome.runtime.sendMessage({
            action: "requestCiteBack"
        })


    });
    let copyButton = document.getElementById('copier');
    copyButton.addEventListener('click', function(){
        let citeText = document.getElementById('citation').innerText
        //copying text
        let dummy = document.createElement("textarea");
        document.body.appendChild(dummy);
        dummy.value = citeText;
        dummy.select();
        document.execCommand("copy");
        document.body.removeChild(dummy);

    })
});




