const https = require('https');
const fs = require('fs');
const path = require('path');

// 确保目录存在
const mkdirp = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// 下载文件
const download = (url, dest) => {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ Downloaded: ${dest}`);
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => {});
            reject(err);
        });
    });
};

// 依赖列表
const dependencies = [
    {
        url: 'https://unpkg.com/react@17.0.2/umd/react.development.js',
        dest: 'vendor/js/react.development.js'
    },
    {
        url: 'https://unpkg.com/react-dom@17.0.2/umd/react-dom.development.js',
        dest: 'vendor/js/react-dom.development.js'
    },
    {
        url: 'https://unpkg.com/moment@2.29.4/min/moment.min.js',
        dest: 'vendor/js/moment.min.js'
    },
    {
        url: 'https://unpkg.com/antd@4.24.15/dist/antd.min.js',
        dest: 'vendor/js/antd.min.js'
    },
    {
        url: 'https://unpkg.com/echarts@5.4.3/dist/echarts.min.js',
        dest: 'vendor/js/echarts.min.js'
    },
    {
        url: 'https://unpkg.com/antd@4.24.15/dist/antd.min.css',
        dest: 'vendor/css/antd.min.css'
    }
];

// 主函数
async function main() {
    // 创建目录
    mkdirp('vendor/js');
    mkdirp('vendor/css');

    console.log('📦 开始下载依赖...');

    // 下载所有依赖
    for (const dep of dependencies) {
        try {
            await download(dep.url, dep.dest);
        } catch (err) {
            console.error(`❌ 下载失败: ${dep.dest}`, err);
        }
    }

    console.log('✨ 所有依赖下载完成！');
}

main().catch(console.error); 