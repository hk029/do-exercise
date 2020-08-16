import ques from './answer.json';

export default {
    // 支持值为 Object 和 Array
    'GET /prjs/exercisev2/api/questions': { code: 200, data: ques },
    'GET /prjs/exercisev2/api/user': { code: 200, data: { name: 'user', info: { "errorList": [3], "index": 10, "correctList": [0, 1, 4, 6, 7, 8, 9] } } },
    'POST /api/user': { code: 200, data: { name: 'user1', info: { "errorList": [2], "index": 3, "correctList": [0, 1] } } }
};
