
// ref: https://umijs.org/config/
const path = require('path');
const getAbsolutePath = p => path.join(__dirname, p);

const colorTheme = {
    red: '#ea524e',
    blue: '#1590ff',
};

export default {
    treeShaking: true,
    routes: [
        {
            path: '/',
            component: '../layouts/index',
            routes: [
                { path: '/', component: '../pages/index' }
            ]
        }
    ],
    plugins: [
        // ref: https://umijs.org/plugin/umi-plugin-react.html
        ['umi-plugin-react', {
            antd: true,
            dva: true,
            dynamicImport: false,
            title: 'do-exercise',
            dll: true,

            routes: {
                exclude: [
                    /models\//,
                    /services\//,
                    /model\.(t|j)sx?$/,
                    /service\.(t|j)sx?$/,
                    /components\//,
                ],
            }, 
            theme: {
                'primary-color': colorTheme.red,
            },
            alias: {
                '@': getAbsolutePath('src'),
                '@package': getAbsolutePath('package.json'),
                '@base': getAbsolutePath('base'),
            },
        }],
    ],
}
