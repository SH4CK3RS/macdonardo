function playSound() {
    let url = chrome.runtime.getURL('audio.html');
    url += '?volume=0.7&src=assets/tada.mp3&length=1000';

    chrome.windows.create({
        type: 'popup',
        focused: true,
        top: 1,
        left: 1,
        height: 1,
        width: 1,
        url,
    });
}

function sendTelegramMessage() {
    var botToken = localStorage['botToken'];
    var chatId = localStorage['chatId'];
    var msg = encodeURI('Macro has been stopped. Please check your reservation status.');
    if (botToken != undefined && chatId != undefined) {
        var url = 'https://api.telegram.org/bot' + botToken + '/sendmessage?chat_id=' + chatId + '&text=' + msg;

        var xmlhttp = new XMLHttpRequest();
        xmlhttp.onreadystatechange = function () {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                var response = xmlhttp.responseText; //if you need to do something with the returned value
            }
        }
        xmlhttp.open('GET', url, true);
        xmlhttp.send();
    }
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message && message.type === 'success') {
        playSound();
        sendTelegramMessage();
        sendResponse(true);
    }
});