var timer = null;
var CDN_ADDRESS = '//cdn.jsdelivr.net/npm/eruda';

/**
 * 简易的第三方移动端控制台erdua封装
 * @param {String} slogan  唤起关键词
 * @param {Number} timeout 超时时间
 */
var monitor = function monitor() {
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10000;

    // 引入CDN
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = CDN_ADDRESS;
    document.getElementsByTagName('body')[0].appendChild(script);

    // 超时处理
    setTimeout(function () {
        if (timer) clearInterval(timer);
    }, timeout);

    // 轮询确保加载
    timer = setInterval(function () {
        if (window.eruda && window.eruda.init) {
            window.eruda.init();
            clearInterval(timer);
        }
    }, 100);
};

export default monitor;