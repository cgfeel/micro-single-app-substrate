# micro-single-app-substrate

一个 `single-spa` 基座演示仓库，完整内容查看微前端主仓库：https://github.com/cgfeel/zf-micro-app

当前项目包含 3 个仓库：

- `single-spa` 基座-主应用：https://github.com/cgfeel/micro-single-app-substrate
- `React` 子应用：https://github.com/cgfeel/micro-single-app-react
- `Vue` 子应用：https://github.com/cgfeel/micro-single-app-vue

---

## 示例

### `Single-spa` 使用

`Single-spa` 是通过 URL 来加载不同的子应用实现微前端

目录：`./systemjs` [[查看](https://github.com/cgfeel/zf-micro-app/tree/main/single-spa)]

包含 3 个项目：

- `single-spa` 主应用，基座
- `React` 子应用
- `Vue` 子应用

运行方式：依次启动主应用、子应用服务，访问主应用顶部有子应用导航链接

### `single-spa` 主应用：

目录：`./single-spa/substrate` [[当前仓库](https://github.com/cgfeel/micro-single-app-substrate)]

加载顺序，和前面 `systemjs` 方式一致的：

- `webpack.config.js` 通过 `HtmlWebpackPlugin` 拿 `./src/index.ejs` 作为入口模板
- `./src/index.ejs` 拉到底部可看到导入语句 `System.import('@levi/root-config');`，导入当前目录下的 `levi-root-config.ts`

几个关键点：

- `Single-spa` 每个应用中包含一个组织名：`orgName`、还有一个项目名：`root-config`，作为完整的名称：`@levi/root-config`
- `index.ejs` 中去除不需要的部分再来看，和之前 `systemjs` 演示[[查看](https://github.com/cgfeel/micro-systemjs/blob/main/dist/systemjs.html)]一样分 3 个部分：`runtime`、`systemjs-importmap`、`System.import`
- `levi-root-config.ts` 通过：`registerApplication` 注册应用、`start` 启动

每个添加的应用都需要：

- 在 `index.ejs` 通过 `systemjs-importmap` 指明项目名称，以及对应的链接
- 在 `levi-root-config.ts` 通过`registerApplication` 指明应用完整的名称、以子项目名称作为导入 id、指定激活的 URL

### `React` 子应用：

目录：`./single-spa/react-project` [[查看](https://github.com/cgfeel/micro-single-app-react)]

通过 `Single-spa` 默认创建的 `React 17`，在 `webpack.config.js` [[查看](https://github.com/cgfeel/micro-single-app-react/blob/42e69b8fce5db83bdbd8767b13b410f6d4cdd3f0/webpack.config.js)]中有几个关键点：

- 完整名称是：组织名和项目名
- 通过 `devServer` 设置 `port: 3000`
- 在 `./src` 下入口文件：`levi-react.tsx`（项目同名）暴露接入协议，见下方总结

项目中为了演示保留了 `react`、`react-dom`，并添加了 `React-Router`

### `Vue` 子应用：

目录：`./single-spa/vue-project` [[查看](https://github.com/cgfeel/micro-single-app-vue)]

通过 `Single-spa` 默认创建的 `Vue 3`，和 `React` 不同的是

- 没有 `webpack.config.js`，项目名默认按照 `package.json` 项目名
- 通过 `vue.config.js` 设置 `devServer` 为 `port: 4000`
- 在 `./src` 下入口文件 `main.js` 暴露接入协议，见下方总结

项目中为了演示添加了 `Vue-Router`，并且需要去除 `SystemJSPublicPathWebpackPlugin`

### 总结：

- 无论子应用是 `React` 还是 `Vue`，默认都是子应用模式启动服务，同时还提供一个独立运行的模式：`{start|serve}:standalone`
- 所有子应用都需要修改入口文件，暴露 3 个方法：`bootstrap`, `mount`, `unmount` 用于主应用启动、加载和卸载
- 在主应用中需要对所有应用分别设置：`systemjs-importmap`、`registerApplication`（见上方主应用总结）
- 子应用的入口链接并非有规律的，比如 `Vue` 就是以 ` app.js` 提供，建议运行后在启动页面查看子应用的加载链接
