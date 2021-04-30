const { runLoaders } = require('loader-runner');
const fs = require('fs');
const path = require('path');

runLoaders({
	resource: path.join(__dirname, './src/data.txt'),
	loaders: [
        {
            loader: path.join(__dirname, './src/raw-loader.js'),
            options: {
                name: 'rawLoader'
            }
        }
    ],
	context: { minimize: true },
	readResource: fs.readFile.bind(fs)
}, (err, res) => {
    err ? console.log(err) : console.log(res);
})
