// src/utils/dataUtils.js

export const isDataChanged = (prevData, newData) => {
    if (prevData.length !== newData.length) {
        return true;
    }
    // Compare content
    for (let i = 0; i < prevData.length; i++) {
        if (JSON.stringify(prevData[i]) !== JSON.stringify(newData[i])) {
            return true;
        }
    }
    return false;
};
