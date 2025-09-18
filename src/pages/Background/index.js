
class DataBackGround {
    constructor() {
        this.init();
    }

    init() { }

    messageHandler(request, sender, sendResponse) {
        const actions = {
            onDataSave: () => this.onDataSave(request, sendResponse),
            onDataPageOpen: () => this.onDataPageOpen(),
        };

        if (Object.prototype.hasOwnProperty.call(actions, request.action)) {
            actions[request.action]();
        }
        return false;
    }

    onDataSave(request, sendResponse) {
        chrome.storage.local.set({ studentInfo: request.data }, () => {
            chrome.runtime.lastError ? sendResponse({ success: false }) : sendResponse({ success: true });
        })
        return true;
    }

    onDataPageOpen() {
        chrome.runtime.openOptionsPage();
        return true;
    }

}

chrome.runtime.onMessage.addListener(new DataBackGround().messageHandler.bind(new DataBackGround()));

console.log("Background script loaded");