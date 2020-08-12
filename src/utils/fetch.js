import queryString from 'query-string';
import { message } from 'antd';

const defaultErrorMessage = '系统异常，请稍后再试!';

async function parseJSON(response) {
    let json;

    try {
        json = await response.json();
    } catch {
        json = {
            code: 500,
            message: defaultErrorMessage
        };
    }

    return json;
}

async function fetchBase(apiurl, options) {
    let url = apiurl;
    let opt = options;

    opt = opt || {};
    opt.method = opt.method || 'GET';
    opt.credentials = opt.credentials || 'include';
    opt.withCredentials = true;

    if (opt.headers) {
        Object.assign(opt.headers, {
            Accept: 'application/json'
        });
    }

    if (opt.query) {
        url = `${url}?${queryString.stringify(opt.query)}`;
    }

    const res = await fetch(url, opt);

    try {
        // 如果是HEAD请求，说明不需要返回数据
        let json = { code: 200 };

        if (opt.raw) {
            return res.text();
        }

        // 如果是HEAD请求，不需要data
        if (!opt.method.toUpperCase() !== 'HEAD') {
            json = await parseJSON(res);
        }

        if (json.code === 200) {
            return {
                data: typeof json.data === 'undefined' ? true : json.data,
                // 有些场合数据是在HEADER中的
                _headers: res.headers
            };
        }

        if (json.code === 401 || json.code === 301) {
            // 未登陆的情况下，跳转登陆页, 这一步在Layout中处理
            // window.location.href = '/login';
            return false;
        }

        throw json;
    } catch (err) {

        if (!opt.noCommonTip) {
            // 其他错误情况，统一toast提示后端msg 信息
            const errorMsg = err.message || err.msg || defaultErrorMessage;
            message.error(errorMsg);
        }
    }

    // return false 可以在对应model通过if(data)来判断是否取到值
    return false;
}

/**
 * GET 方法，
 * @param {*} url api url
 * @param {*} data 传递的数据，GET请求queryString 到url上
 * @param {*} options 预留的其他配置项
 */
const get = (url, data = {}, options = {}) => fetchBase(url, {
    method: 'GET',
    query: data,
    ...options
});

/**
 * POST, 数据格式为 application/json
 * @param {*} url
 * @param {*} data
 * @param {*} options
 */
const postJson = (url, data = {}, options = {}) => {
    const body = JSON.stringify(data);
    return fetchBase(url, {
        method: 'POST',
        body,
        headers: {
            'Content-Type': 'application/json'
        },
        ...options
    });
};

/**
 * POST, 数据格式为 application/x-www-form-urlencoded
 * @param {*} url
 * @param {*} data
 * @param {*} options
 */
const post = (url, data = {}, options = {}) => {
    let body = Object.keys(data)
        .filter(key => data[key] !== undefined)
        .map(
            key => `${key}=${
                typeof data[key] === 'object'
                    ? JSON.stringify(data[key])
                    : data[key]
            }`
        )
        .join('&');
    body = encodeURI(body);

    return fetchBase(url, {
        method: 'POST',
        body,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        ...options
    });
};

/**
 * POST, 数据格式为 multipart/form-data
 * @param {*} url
 * @param {*} data
 * @param {*} options
 */
const postFormData = (url, data = {}, options = {}) => {
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
        formData.append(key, data[key]);
    });

    return fetchBase(url, {
        method: 'POST',
        body: formData,
        ...options
    });
};

export default {
    get,
    post,
    postJson,
    postFormData
};
