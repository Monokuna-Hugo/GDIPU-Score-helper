console.log("数据后台已启动");

try {
    importScripts('./background.bundle.js');
} catch (error) {
    console.error('数据后台加载脚本时出错:', error);
}


import DataBackGround from './DataBackground';
const dataBackGround = new DataBackGround();

chrome.runtime.onMessage.addListener(dataBackGround.messageHandler.bind(dataBackGround));

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (['onDataSave', 'onDataPageOpen'].includes(request.action)) {
        return dataBackGround.messageHandler(request, sender, sendResponse);
    }
    return false;
})

chrome.alarms.create("keepAlive", { periodInMinutes: 0.2 });

