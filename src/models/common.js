import * as commonService from '@/service/common';
import { getInfo, getItem, setItem } from '@/utils/store';

const setData = (state, info) => {
    const errorList = info.errorList || state.errorList;
    const correctList = info.correctList || state.correctList;
    const index = info.index || state.index;
    setItem('info', { errorList, index, correctList });
};

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
    },

    effects: {
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
                if (questions) {
                    yield put({ type: 'setQuestions', payload: questions });
                    return questions;
                } else {
                    const { data } = yield call(commonService.getQuestions);
                    yield put({ type: 'setQuestions', payload: data });
                    return data;
                }
            }
        },
    },

    reducers: {
        setInfo(state, { payload: info }) {
            setData(state, info);
            return {
                ...state,
                ...info
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
        }
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
