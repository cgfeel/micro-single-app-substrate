/// <reference types="systemjs" />

import {registerApplication, start, LifeCycles} from "single-spa";

const rootPath = process.env.BASE_URL ?? "/";

// 注册应用
registerApplication({
  name: "@single-spa/welcome",
  // 远程加载模块
  app: () => System.import<LifeCycles>("https://unpkg.com/single-spa-welcome@2.0.0/dist/single-spa-welcome.js"),
  // activeWhen: ["/"],
  activeWhen: (location) => location.pathname === rootPath,
});

registerApplication({
  name: "@levi/react",
  app: () => System.import<LifeCycles>("@levi/react"),
  activeWhen: (location) => location.pathname.startsWith(`${rootPath}react`),
});

registerApplication({
  name: "@levi/vue-project",
  app: () => System.import<LifeCycles>("@levi/vue-project"),
  activeWhen: (location) => location.pathname.startsWith(`${rootPath}vue`),
});

// registerApplication({
//   name: "@levi/navbar",
//   app: () => System.import("@levi/navbar"),
//   activeWhen: ["/"]
// });

start({
  urlRerouteOnly: true,
});

// 根应用
// 父应用的加载过程：9000 - index.ejs - @levi/root-config - levi-root-config.js
// 匹配路径加载应用
