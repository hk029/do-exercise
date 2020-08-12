import * as commonService from '@/service/common';
import { getItem, setItem } from '@/utils/store';

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
        userInfo: {
            nickName: '姓名',
            mailAddress: 'test@corp.netease.com',
        },
        questions: [],
        headers: [],
        errorList: [],
        correctList: [],
    },

    effects: {
        * init(_, { call, put, select }) {
            const init = yield select(({ common }) => common.init);
            if (!init) {
                const info = getItem('info');
                yield put({ type: 'setInfo', payload: info });
                const { data } = yield call(commonService.getQuestions);
                yield put({ type: 'setQuestions', payload: data });
                return data;
            }
        },
    },

    reducers: {
        setInfo(state, { payload: info }) {
            return {
                ...state,
                ...info
            };
        },
        setQuestions(state, { payload: questions }) {
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
            const idx = correctList.findIndex(id);
            errorList.splice(idx, 1);
            if (!correctList.includes(id)) {
                correctList.push(id);
            }
            if (correctList.includes(id)) {
                return state;
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
