export const addButtons = () => {
  const container = document.querySelector('.view_container_top_left');
  if (!container) {
    console.error('无法找到按钮容器');
    return;
  }

  const buttonContainer = document.createElement('div');
  buttonContainer.className = 'custom-button-container';

  const buttons = [
    { text: '获取信息', onClick: scrapeInfo }
  ];

  buttons.forEach(({ text, onClick }) => {
    const button = document.createElement('button');
    button.textContent = text;
    button.className = 'custom-button';
    button.onclick = onClick;
    buttonContainer.appendChild(button);
  });

  container.appendChild(buttonContainer);

  // 获取搜索框的边框颜色并应用到按钮
  const searchElement = document.querySelector('.header-portal .header-portal-right .header-search[data-v-010f30d2]');
  if (searchElement) {
    const searchBorderColor = window.getComputedStyle(searchElement).borderColor;
    document.documentElement.style.setProperty('--button-color', searchBorderColor);
  }
};

const scrapeInfo = async () => {
  const container = document.querySelector('.view_container_top_right');
  if (!container) {
    console.error('无法找到包含学生信息的容器');
    return;
  }

  const info = {
    totalScore: container.querySelector('.span2.span3 span')?.textContent.trim() || '未知',
    items: Array.from(container.querySelectorAll('.comprehensive_results_data_right ul li')).map(item => {
      const name = item.querySelector('.span_examineLevelDesc span')?.textContent.trim() || '';
      const score = item.querySelector('.span_examineLevelDesc p span span')?.textContent.trim() || '0';
      const percentage = name.match(/（(\d+)%）/)?.[1] || '0';
      return { name, score, percentage };
    }),
    assessmentRecords: await scrapeAssessmentRecords()
  };

  saveData(info);
};

const saveData = (info) => {
  chrome.runtime.sendMessage({ action: "saveData", data: info }, (response) => {
    if (chrome.runtime.lastError) {
      console.error('保存数据时出错:', chrome.runtime.lastError);
    } else {
      console.log('数据保存成功:', response);
      showFloatingMessage('信息已获取');
    }
  });
};

const scrapeAssessmentRecords = async () => {
  const records = [];
  let currentPage = 1;

  while (true) {
    const tableRows = document.querySelectorAll('.el-table__body-wrapper tbody tr');
    records.push(...Array.from(tableRows).map(row => {
      const cells = row.querySelectorAll('td');
      return {
        assessmentSystem: cells[0]?.textContent.trim() || '',
        assessmentIndicator: cells[1]?.textContent.trim() || '',
        assessmentItem: cells[2]?.textContent.trim() || '',
        activityName: cells[3]?.textContent.trim() || '',
        scoringCondition: cells[4]?.textContent.trim() || '',
        score: cells[5]?.textContent.trim() || '0',
        occurrenceTime: cells[6]?.textContent.trim() || ''
      };
    }));

    const nextPageButton = document.querySelector('.btn-next:not([disabled])');
    if (!nextPageButton) break;

    nextPageButton.click();
    await new Promise(resolve => setTimeout(resolve, 1000));
    currentPage++;
  }

  return records;
};

const showFloatingMessage = (message) => {
  const messageElement = document.createElement('div');
  Object.assign(messageElement.style, {
    position: 'fixed',
    top: '10%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: 'rgba(128, 128, 128, 0.1)',
    color: 'black',
    padding: '10px 20px',
    borderRadius: '5px',
    zIndex: '9999',
    transition: 'all 1s ease-out',
    fontSize: '26px',
    fontFamily: '"Microsoft YaHei", sans-serif'
  });
  messageElement.textContent = message;

  document.body.appendChild(messageElement);

  setTimeout(() => {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translate(-50%, calc(-50% - 50px))';
  }, 100);

  setTimeout(() => document.body.removeChild(messageElement), 1100);
};
