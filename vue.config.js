// const TerserPlugin = require('terser-webpack-plugin')
module.exports = {
  transpileDependencies: ["vuetify"],
  publicPath: process.env.NODE_ENV === "production" ? "/panel/" : "/",
    // configureWebpack: config => {
    //   console.log(config);
    //   config.optimization = {
    //     minimizer: [new TerserPlugin({
    //       terserOptions: {
    //         ecma: 'es6',
    //         warnings: false,
    //         parse: {},
    //         compress: true,
    //         mangle: true, // Note `mangle.properties` is `false` by default.
    //         module: false,
    //         output: { comments: false },
    //         toplevel: true,
    //         nameCache: null,
    //         ie8: false,
    //         keep_classnames: false,
    //         keep_fnames: false,
    //         safari10: true,
    //       },
    //     })
    //   ],
    //   }
    // }
};
