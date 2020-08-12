const base = 'ex-';
const defaultData = {
    index: 0,
    errorList: [],
    correctList: [],
}
export const getItem = val => {
    let data = {};
    try{
        data = JSON.parse(window.localStorage.getItem(`${base}${val}`)) || defaultData;
    } catch(err) {
        data = defaultData;
    }
    finally{
        return data;
    }
}

export const setItem = (key,val) => window.localStorage.setItem(`${base}${key}`, JSON.stringify(val));