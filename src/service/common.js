/* eslint-disable import/prefer-default-export */
import Fetch from '@/utils/fetch';

// 一般来说base是//api/*
// 在本地开发的时候，可以通过config/config.common.js中的mockUrl，配置代理服务器的地址

/**
 *  查询用户列表
 */
export function getQuestions() {
    return Fetch.get('/api/questions');
}

/**
 *  更新用户
 * @param {*} id
 * @param {*} sex
 * @param {*} name
 * @param {*} email
 * @param {*} address
 */
export function updateUser(id, sex, name, email, address) {
    return Fetch.post('/api/user/update', {
        id,
        email,
        address,
        name,
        sex
    });
}

/**
 *  删除用户
 * @param {*} id
 */
export function deleteUser(id) {
    return Fetch.post('/api/user/delete', { id });
}

/**
 *  添加用户
 * @param {*} sex
 * @param {*} name
 * @param {*} email
 * @param {*} address
 */
export function addUser(sex, name, email, address) {
    return Fetch.post('/api/user/add', {
        email,
        address,
        name,
        sex
    });
}
