var dataBackground = {

  handleMessage: function(request, sender, sendResponse) {
    const actions = {
      saveData: () => {
        chrome.storage.local.set({studentInfo: request.data}, () => {
          if (chrome.runtime.lastError) {
            sendResponse({success: false, error: chrome.runtime.lastError});
          } else {
            sendResponse({success: true});
          }
        });
        return true; // 保持消息通道开放
      },
      openDataPage: () => {
        const url = chrome.runtime.getURL('data/index.html');
        chrome.tabs.create({url: url}, (tab) => {
          if (chrome.runtime.lastError) {
            sendResponse({success: false, error: chrome.runtime.lastError.message});
          } else if (tab) {
            sendResponse({success: true, tabId: tab.id});
          } else {
            sendResponse({success: false, error: '未返回标签页'});
          }
        });
        return true; // 保持消息通道开放
      }
    };

    if (actions[request.action]) {
      return actions[request.action]();
    }
    return false;
  }
};

// 添加以下代码来监听消息
chrome.runtime.onMessage.addListener(dataBackground.handleMessage);
//活动
console.log("Background Service Worker 正在启动");

// 常量
const TARGET_URL = "https://zhxygateway.gzzhyc.cn/studentApi/api/student/activity/addActivityEnrollApply";
const BLOCKED_URL = "https://zhxygateway.gzzhyc.cn/studentApi/api/student/activity/getActivityInfo";
const RULESET_ID = "ruleset_1";

// 全局变量
let isBlocking = false;
let capturedDataList = [];

// 初始化
chrome.runtime.onInstalled.addListener(async () => {
  await updateBlockingRule(false);
  loadCapturedData();
});

chrome.runtime.onStartup.addListener(loadCapturedData);

// 消息监听器
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const actions = {
    getCaptureStatus: () => {
      const hasData = capturedDataList.some(item => item.activityInfo.wid === request.wid);
      sendResponse({hasCapturedData: hasData});
    },
    autoCapture: async () => {
      try {
        await autoCapture(sender.tab.id, request.activityInfo);
        sendResponse({success: true});
      } catch (error) {
        console.error("自动捕获失败:", error);
        sendResponse({success: false});
      }
    },
    clearCapturedData: () => {
      clearCapturedData(request.wid);
      sendResponse({success: true});
    },
    testConnection: () => sendResponse({status: "连接成功"}),
    getCapturedData: () => sendResponse({capturedDataList}),
    testEnrollment: async () => {
      const activityData = capturedDataList.find(item => item.activityInfo.wid === request.wid);
      if (activityData) {
        try {
          const result = await sendEnrollmentRequest(activityData.fetchRequest, 'test');
          sendResponse({success: true, result});
        } catch (error) {
          sendResponse({success: false, error: error.message});
        }
      } else {
        sendResponse({success: false, error: '未找到活动数据'});
      }
    }
  };

  const action = actions[request.action];
  if (action) {
    action();
    return true; // 保持消息通道开放，以便异步响应
  } else {
    sendResponse({error: "未知操作"});
  }
});

async function autoCapture(tabId, activityInfo) {
  try {
    await updateBlockingRule(true);
    isBlocking = true;

    const [_, capturedRequest] = await Promise.all([
      chrome.tabs.reload(tabId),
      new Promise((resolve) => {
        chrome.tabs.onUpdated.addListener(function listener(updatedTabId, info) {
          if (updatedTabId === tabId && info.status === 'complete') {
            chrome.tabs.onUpdated.removeListener(listener);
            startCapturing(tabId, activityInfo).then(resolve);
          }
        });
      })
    ]);

    saveCapturedData(activityInfo, capturedRequest);
    setEnrollmentAlarm(activityInfo, capturedRequest);

    return true;
  } catch (error) {
    console.error("自动捕获过程中出错:", error);
    throw error;
  } finally {
    isBlocking = false;
    await updateBlockingRule(false);
    await chrome.tabs.reload(tabId);
  }
}

function setEnrollmentAlarm(activityInfo, capturedRequest) {
  const enrollmentTime = new Date(activityInfo.activityTime);
  const currentTime = new Date();
  const timeUntilEnrollment = enrollmentTime.getTime() - currentTime.getTime();

  if (timeUntilEnrollment <= 0) {
    return;
  }

  const preheatTime = new Date(enrollmentTime.getTime() - 10000);
  chrome.alarms.create(`preheat_${activityInfo.wid}`, {when: preheatTime.getTime()});
  chrome.alarms.create(`enrollment_${activityInfo.wid}`, {when: enrollmentTime.getTime()});
}

chrome.alarms.onAlarm.addListener((alarm) => {
  const [action, wid] = alarm.name.split('_');
  const activityData = capturedDataList.find(item => item.activityInfo.wid === wid);

  if (activityData) {
    if (action === 'preheat') {
      executePreheatRequest(activityData.fetchRequest);
    } else if (action === 'enrollment') {
      executeEnrollment(activityData.fetchRequest, wid);
    }
  }
});

async function executePreheatRequest(fetchRequest) {
  try {
    const preheatUrl = new URL(fetchRequest.url);
    const response = await fetch(preheatUrl.origin + preheatUrl.pathname, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'https://study.gdip.edu.cn',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': Object.keys(fetchRequest.headers).join(',')
      }
    });
    console.log('预热请求发送成功，状态码:', response.status);
  } catch (error) {
    console.error('预热请求发送失败:', error);
  }
}

async function executeEnrollment(fetchRequest, wid) {
  const enrollmentPromises = Array(3).fill().map((_, i) => sendEnrollmentRequest(fetchRequest, i + 1));

  try {
    const results = await Promise.all(enrollmentPromises);
    console.log('所有报名请求已发送，结果:', results);

    // 删除对应的数据
    clearCapturedData(wid);
    console.log(`已删除 WID ${wid} 的数据`);
  } catch (error) {
    console.error('报名过程中出错:', error);
  }
}

async function sendEnrollmentRequest(fetchRequest, attemptNumber) {
  try {
    const response = await fetch(fetchRequest.url, {
      method: fetchRequest.method,
      headers: fetchRequest.headers,
      body: fetchRequest.body
    });
    const result = await response.json();
    console.log(`报名请求 #${attemptNumber} 结果:`, result);
    return result;
  } catch (error) {
    console.error(`报名请求 #${attemptNumber} 失败:`, error);
    throw error;
  }
}

async function updateBlockingRule(enable) {
  const action = enable ? 'enableRulesetIds' : 'disableRulesetIds';
  await chrome.declarativeNetRequest.updateEnabledRulesets({
    [action]: [RULESET_ID]
  });
}

async function startCapturing(tabId, activityInfo) {
  try {
    await chrome.debugger.attach({tabId: tabId}, "1.2");
    await Promise.all([
      chrome.debugger.sendCommand({tabId: tabId}, "Network.enable"),
      chrome.debugger.sendCommand({tabId: tabId}, "Network.setCacheDisabled", {cacheDisabled: true})
    ]);

    const [clickResult, capturedRequest] = await Promise.all([
      simulateClick(tabId),
      new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('捕获请求超时')), 5000);

        async function debuggerListener(debuggeeId, message, params) {
          if (debuggeeId.tabId !== tabId) return;

          if (message === "Network.requestWillBeSent" &&
            params.request.url === TARGET_URL &&
            params.request.method === "POST") {
            clearTimeout(timeout);
            chrome.debugger.onEvent.removeListener(debuggerListener);
            resolve({
              url: params.request.url,
              method: params.request.method,
              headers: params.request.headers,
              body: params.request.postData || await getRequestBody(tabId, params.requestId)
            });
          }
        }
        chrome.debugger.onEvent.addListener(debuggerListener);
      })
    ]);

    if (!clickResult) {
      throw new Error('未找到报名按钮，无法模拟点击');
    }

    await chrome.debugger.detach({tabId: tabId});
    return capturedRequest;
  } catch (error) {
    console.error("捕获过程中出错:", error);
    await chrome.debugger.detach({tabId: tabId}).catch(() => {});
    throw error;
  }
}

async function getRequestBody(tabId, requestId) {
  const bodyResult = await chrome.debugger.sendCommand(
    {tabId: tabId},
    "Network.getRequestPostData",
    {requestId: requestId}
  );
  return bodyResult.postData;
}

async function simulateClick(tabId) {
  const results = await chrome.scripting.executeScript({
    target: { tabId: tabId },
    function: () => {
      let applyButton = document.querySelector('.action-apply.clickable.apply-status7');
      if (applyButton) {
        applyButton.click();
        return true;
      }
      return false;
    }
  });
  return results[0].result;
}

function saveCapturedData(activityInfo, capturedRequest) {
  const existingIndex = capturedDataList.findIndex(item => item.activityInfo.wid === activityInfo.wid);
  if (existingIndex !== -1) {
    capturedDataList[existingIndex] = { activityInfo, fetchRequest: capturedRequest };
  } else {
    capturedDataList.push({ activityInfo, fetchRequest: capturedRequest });
  }
  chrome.storage.local.set({capturedDataList});
}

function clearCapturedData(wid) {
  capturedDataList = capturedDataList.filter(item => item.activityInfo.wid !== wid);
  chrome.storage.local.set({capturedDataList});
}

function loadCapturedData() {
  chrome.storage.local.get('capturedDataList', result => {
    capturedDataList = result.capturedDataList || [];
  });
}