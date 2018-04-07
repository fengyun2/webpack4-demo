# webpack4-demo

## Lodash优化(lodash-webpack-plugin、 babel-plugin-lodash)

都是列出Gzip后的大小

**未引入lodash前**：

app.js：827KB
vendors.js：692KB

**引入lodash后，优化前**：

app.js：1.1MB
vendors.js：692KB

**引入lodash后，优化后**：

app.js：829KB
vendors.js：692KB

## moment优化

### 方案一：去掉不必要的locale(优化后还是很大)

**优化前**：

app.js: 1.1MB
vendors.js：692KB

**优化后**：

app.js: 918KB
vendors.js：692KB

### 方案二：替换为 [date-fns](https://date-fns.org/)

**优化前**：

app.js: 829KB
vendors.js：692KB

**优化后**：

app.js: 918KB
vendors.js：692KB

**引入 babel-plugin-date-fns 插件后**：

app.js: 850KB
vendors.js：692KB

## 参考文档

1. [webpack-demo](https://github.com/carloluis/webpack-demo)
2. [webpack4-demo](https://github.com/jdf2e/webpack4-demo)
3. [webpack-ci](https://github.com/Faithree/webpack-ci)
4. [优雅的提交你的 Git Commit Message](https://zhuanlan.zhihu.com/p/34223150)

5. [ant-design-demo](https://github.com/yezihaohao/react-admin)