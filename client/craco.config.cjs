const path = require('path');

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve.fallback = {
                fs: false,
                path: require.resolve('path-browserify'),
                os: require.resolve('os-browserify/browser'),
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
                assert: require.resolve('assert/'),
                util: require.resolve('util/'),
                url: require.resolve('url/'),
                buffer: require.resolve('buffer/')
            };
            return webpackConfig;
        },
    },
};
