import * as commonService from '@/service/common';
import { getInfo, getItem, setItem } from '@/utils/store';
import pack from '../../package.json';

const setData = (state, info) => {
    const errorList = info.errorList || state.errorList;
    const correctList = info.correctList || state.correctList;
    const index = info.index || state.index;
    setItem('info', { errorList, index, correctList });
};

const setTestData = (state, info) => {
    const testList = { ...state.testList, ...info };
    setItem('test', testList);
    return testList;
};

const shuffle = (arr, t, needId = false) => {
    const newArr = Array.from(new Array(arr.length).keys())
    const times = Math.min(arr.length, t);
    const lastIndex = arr.length - 1;
    for (let i = 0; i < times; i++) {
        let rand = i + Math.floor(Math.random() * (lastIndex - i + 1))
        const value = newArr[rand];
        newArr[rand] = newArr[i];
        newArr[i] = value;
    }
    return needId ? newArr.slice(0, t) : newArr.slice(0, t).map(idx => arr[idx]);
}


const merge = (a,b) => {
    let arr = [...b];
    a.forEach(item => {
        if(!arr.includes(item)) {
            arr.push(item);
        }
    })
    return arr;
}

export default {
    namespace: 'common',

    state: {
        /**
         * 0: 还未获取状态
         * 1: 已登录
         * 2: 未登录
         */
        init: false,
        status: 1, // 先默认用户已登录
        index: 0,
        user: '',
        questions: [],
        headers: [],
        errorList: [],
        correctList: [],
        testList: {
            index: 0,
            list: [],
            answers: [],
            errorList: [],
            result: false
        },
    },

    effects: {
        * getTest({ payload: reset }, { call, put, select }) {
            const questions = yield select(({ common }) => common.questions);
            let testList = getItem('test');
            // 如果有test则直接用test
            if (reset || !testList) {
                testList = {
                    index: 0,
                    answers: [],
                    errorList: [],
                    result: false,
                    list: shuffle(questions, 100, true),
                }
            }
            yield put({ type: 'setTest', payload: testList });
            return testList;
        },
        * getUser({ payload: name }, { call, put, select }) {
            const info = getInfo();
            const { data } = yield call(commonService.getUser, name, info);
            yield put({ type: 'setInfo', payload: data.info });
            yield put({ type: 'setUser', payload: data.name });
            return data;
        },
        * init(_, { call, put, select }) {
            const init = yield select(({ common }) => common.init);
            if (!init) {
                const user = getItem('user');
                yield put({ type: 'setUser', payload: user });
                const info = getInfo();
                yield put({ type: 'setInfo', payload: info });
                const questions = getItem('questions');
                const version = getItem('version');
                if (questions && version === pack['question-version']) {
                    yield put({ type: 'setQuestions', payload: questions });
                    return questions;
                } else {
                    const { data } = yield call(commonService.getQuestions);
                    yield put({ type: 'setQuestions', payload: data });
                    yield put({ type: 'setVersion', payload: pack['question-version'] });
                    return data;
                }
            }
        },
    },

    reducers: {
        setTest(state, { payload: testList }) {
            setItem('test', testList);
            return {
                ...state,
                testList
            };
        },
        setInfo(state, { payload: info }) {
            setData(state, info);
            return {
                ...state,
                ...info
            };
        },
        setVersion(state, { payload: version }) {
            setItem('version', version);
            return {
                ...state,
                version
            };
        },
        setUser(state, { payload: user }) {
            setItem('user', user);
            return {
                ...state,
                user: user || ''
            };
        },
        setQuestions(state, { payload: questions }) {
            setItem('questions', questions);
            return {
                ...state,
                init: true,
                questions
            };
        },
        nextIndex(state) {
            const length = state.questions.length;
            const index = Math.min(length - 1, state.index + 1)
            if (index !== state.index) {
                setData(state, { index });
                return {
                    ...state,
                    index
                };
            }
            return state;
        },
        preIndex(state) {
            const index = Math.max(0, state.index - 1);
            if (index !== state.index) {
                setData(state, { index });
                return {
                    ...state,
                    index
                }
            }
            return state;
        },
        preTestIndex(state) {
            const index = Math.max(0, state.testList.index - 1)
            if (index !== state.testList.index) {
                return {
                    ...state,
                    testList: setTestData(state, { index })
                };
            }
            return state;
        },
        nextTestIndex(state) {
            const index = Math.min(99, state.testList.index + 1)
            if (index !== state.testList.index) {
                return {
                    ...state,
                    testList: setTestData(state, { index })
                };
            }
            return state;
        },
        setTestResult(state, { payload: result }) {
            const errorList = state.errorList;
            const testErrors = state.testList.errorList;
            let newList = merge(errorList, testErrors);
            setData(state, {errorList : newList});
            return {
                ...state,
                errorList: newList,
                testList: setTestData(state, { result })
            };
        },
        correctQuestion(state, { payload: id }) {
            const correctList = [...state.correctList];
            const errorList = [...state.errorList];
            // 把错误列表中的元素删除
            const idx = errorList.findIndex(cid => cid === id);
            errorList.splice(idx, 1);
            if (!correctList.includes(id)) {
                correctList.push(id);
            }
            setData(state, { errorList, correctList });
            return {
                ...state,
                errorList,
                correctList
            };
        },
        setCorrect(state, { payload: id }) {
            const correctList = [...state.correctList];
            if (correctList.includes(id)) {
                return state;
            }
            setData(state, { correctList });
            correctList.push(id);
            return {
                ...state,
                correctList
            };
        },
        setTestAnswer(state, { payload: { idx, answer, id, wrong } }) {
            const errorList = [...state.testList.errorList];
            const answers = [...state.testList.answers];
            if (wrong && !errorList.includes(id)) {
                errorList.push(id);
            }
            answers[idx] = answer;
            const testList = setTestData(state, { answers, errorList });
            return {
                ...state,
                testList
            };
        },
        setError(state, { payload: id }) {
            const errorList = [...state.errorList];
            if (errorList.includes(id)) {
                return state;
            }
            errorList.push(id);
            setData(state, { errorList });
            return {
                ...state,
                errorList
            };
        },
    },
    subscriptions: {
        getQuestions({ dispatch, history }) {
            return history.listen(() => {
                dispatch({
                    type: 'init',
                });
            });
        },
    },
};
