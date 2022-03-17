import
const path = require('path');

module.exports = function(config) {
  console.log(config);

  config.module.rules.push(
                {
                test: /\leaflet.css$/,
                use: [
                    {loader: "style-loader"},
                    {loader: "css-loader"}
                ]
            },
            {
                test: /\.css$/,
                exclude: /\leaflet.css$/,
                use: [
                    {loader: "style-loader"},
                    {
                        loader: "css-loader",
                        options: {
                            modules: true
                        }
                    }
                ]
            });

  return {
    ...config,
    externals: {
      react: 'commonjs react',
      'react-dom': 'commonjs react-dom',
      'react-leaflet': 'commonjs react-leaflet',
    },
    resolve: {
      alias: {
        'Renderer': path.resolve(__dirname, 'src', 'renderer'),
        'Components': path.resolve(__dirname, 'src', 'renderer', 'components'),
        'Hooks': path.resolve(__dirname, 'src', 'renderer', 'hooks'),
        'Store': path.resolve(__dirname, 'src', 'renderer', 'store'),
            "./images/layers.png$": path.resolve(
                __static,
                "/images/layers.png"
            ),
            "./images/layers-2x.png$": path.resolve(
                __static,
                "/images/layers-2x.png"
            ),
            "./images/marker-icon.png$": path.resolve(
                __static,
                "/images/marker-icon.png"
            ),
            "./images/marker-icon-2x.png$": path.resolve(
                __static,
                "/images/marker-icon-2x.png"
            ),
            "./images/marker-shadow.png$": path.resolve(
                __static,
                "/images/marker-shadow.png"
            )
      }
    },
  }
}
