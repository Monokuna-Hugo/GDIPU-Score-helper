import { useState, useEffect } from 'react';

const useStudentData = () => {
    const [studentInfo, setStudentInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const data = await new Promise((resolve) => {
                    chrome.storage.local.get('studentInfo', ({ studentInfo }) => {
                        resolve(studentInfo);
                    });
                });

                setStudentInfo(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return { studentInfo, loading, error };
};

export default useStudentData;