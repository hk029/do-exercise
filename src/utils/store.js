const base = 'ex-';
const defaultData = {
    index: 0,
    errorList: [],
    correctList: [],
}
export const getItem = val => {
    let data = {};
    try{
        data = JSON.parse(window.localStorage.getItem(`${base}${val}`));
    } catch(err) {
        data = null;
    }
    finally{
        return data;
    }
}

export const getInfo = () => {
    const data = getItem('info');
    return data || defaultData;
}

export const setItem = (key,val) => window.localStorage.setItem(`${base}${key}`, JSON.stringify(val));