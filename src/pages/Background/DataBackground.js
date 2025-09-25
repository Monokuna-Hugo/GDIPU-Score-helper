class DataBackGround {
    constructor() {
        this.init();
    }

    init() { }

    /**
     * 消息处理函数，用于处理接收到的消息请求。
     * 根据请求中的 action 属性，调用对应的处理方法。
     * 
     * @param {Object} request - 接收到的消息请求对象，包含 action 属性用于指定操作类型。
     * @param {Object} sender - 消息发送者的信息对象。
     * @param {Function} sendResponse - 用于向消息发送者返回响应的函数。
     * @returns {boolean} 始终返回 false，表示不需要异步响应。
     */
    messageHandler(request, sender, sendResponse) {
        // 定义操作映射对象，将 action 与对应的处理方法关联起来
        const actions = {
            onDataSave: () => this.onDataSave(request, sendResponse),
            onDataPageOpen: () => this.onDataPageOpen(),
        };

        // 检查请求的 action 是否存在于操作映射对象中
        if (Object.prototype.hasOwnProperty.call(actions, request.action)) {
            // 若存在，则调用对应的处理方法
            actions[request.action]();
        }
        // 返回 false，表示不需要异步响应
        return false;
    }
    /**
     * 数据保存处理函数，用于处理接收到的保存数据请求。
     * 
     * @param {Object} request - 接收到的消息请求对象，包含 action 属性用于指定操作类型。
     * @param {Object} sender - 消息发送者的信息对象。
     * @param {Function} sendResponse - 用于向消息发送者返回响应的函数。
     * @returns 
     */
    onDataSave(request, sendResponse) {
        chrome.storage.local.set({ studentInfo: request.data }, () => {
            chrome.runtime.lastError ? sendResponse({ success: false }) : sendResponse({ success: true });
        })
        return true;
    }
    /**
     * 数据页面打开处理函数，用于处理接收到的数据页面打开请求。
     * 
     * @returns {boolean} 始终返回 true，表示需要异步响应。
     */
    onDataPageOpen() {
        chrome.runtime.openOptionsPage();
        return true;
    }



}
