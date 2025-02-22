let pending = null
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "sendInfo"){
        console.log("Received message:", message.data);
        pending = message.data
        chrome.runtime.sendMessage({ 
            data: message.data,
            action: "sendButtonInfo"
        });
    }
    if (message.action === 'requestCiteBack'){
        chrome.tabs.query({ active: true, currentWindow: true,}, tabs => {
            console.log("CITE REQUEST SENT")
            chrome.tabs.sendMessage(tabs[0].id, {
                action: "requestCiteLogic",
            })
        })
    }
});
