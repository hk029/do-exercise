/* eslint-disable import/prefer-default-export */
import Fetch from '@/utils/fetch';
const base = '/prjs/exercisev2';

// 一般来说base是//api/*
// 在本地开发的时候，可以通过config/config.common.js中的mockUrl，配置代理服务器的地址

/**
 *  查询用户列表
 */
export function getQuestions() {
    return Fetch.get(`${base}/api/questions`);
}

/**
 *  获取用户
 * @param {*} id
 * @param {*} sex
 * @param {*} name
 * @param {*} email
 * @param {*} address
 */
export function getUser(name, info) {
    return Fetch.postJson(`${base}/api/user`, {
        name,
        info,
    });
}
