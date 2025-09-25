export const filterRecords = (records, filters) => {
    return records.filter(r =>
        (filters.indicator === 'all' || r.assessmentIndicator === filters.indicator) &&
        matchLevelFilter(r, filters.level) &&
        matchModeFilter(r, filters.mode)
    );
};

export const matchLevelFilter = (r, levelValue) => {
    levelValue === 'all' ? true :
        levelValue === 'other' ? !['校级', '学院', '社团', '班级'].some(level => r.accessmentItem.includes(level)) :
            r.accessmentItem.includes(levelValue);
}

export const matchModeFilter = (r, modeValue) => {
    if (modeValue === 'all') return true;
    const [isNonOffline, isNonOnline, isOffline, isOnline] =
        ['非线下', '非线上', '线下', '线上'].map(m => r.assessmentItem.includes(m));
    return modeValue === '线下' ? isOffline || isNonOnline :
        modeValue === '线上' ? isOnline || isNonOffline :
            !isOffline && !isOnline && !isNonOffline && !isNonOnline;
};

export const calculateScoreSum = (records, indicatorValue) => {
    return indicatorValue !== 'all' ?
        records.reduce((sum, r) => sum + parseFloat(r.score), 0).toFixed(2) :
        'N/A';
};