#简介
TODO: 简要介绍你的项目。通过此节说明此项目的目标或动机。

#入门
TODO: 指导用户在自己的系统上设置和运行代码。在本节中，可讨论:
1.	安装过程
2.	软件依赖项
  "devDependencies": {
    "@types/js-cookie": "^3.0.2",   // js-cookie 是关于 cookie 存储
    "@types/webpack-env": "^1.17.0", // webpack
    "@typescript-eslint/eslint-plugin": "^5.27.1", // 插件，包含一系列TypeScript的ESint规则
    "@typescript-eslint/parser": "^5.27.1", // 解析器，让ESLint拥有规范TypeScript代码的能力
    "@vue/cli-plugin-babel": "~4.5.0", // 插件解析器
    "@vue/cli-plugin-eslint": "~4.5.0", // 向vue-cli-service注入命令lint
    "@vue/cli-plugin-typescript": "^4.5.15", 
    "@vue/cli-service": "~4.5.0", // 是一个开发环境依赖 CLI 服务 
    "@vue/compiler-sfc": "^3.0.0", // 是针对浏览器环境开发的编译器
    "@vue/eslint-config-typescript": "^10.0.0", // typescript工具包
    "babel-eslint": "^10.1.0", //用于ESlint的Babel解析的包装器
    "babel-plugin-dynamic-import-node": "^2.3.3", // 在开发环境下解决vue热加载编译速度慢
    "eslint": "^7.1.0", // 代码检测工具，统一代码风格
    "eslint-plugin-vue": "^7.0.0", // 用ESLint检查.vue文件的<template>和<script>
    "http-proxy-middleware": "^2.0.3", // 配置代理服务器
    "sass": "^1.52.1", // css预处理器
    "sass-loader": "10.2.1", // scss编译器，打包scss文件
    "source-map-loader": "^3.0.1", // 允许webpack保持跨库的 source maps 数据连续性
    "style-resources-loader": "^1.5.0", // 样式资源加载器
    "svg-sprite-loader": "^6.0.11", // 引入svg格式的图片
    "vue-cli-plugin-style-resources-loader": "^0.1.5"
  },
3.	发布
发布要发布两份（一份正式（production环境下）一份测试（development环境下））
hbuild打包apk也要打包两份（正式地址测试地址不一样，需要hbuild地址对应修改）
4.	API 参考

#生成与测试
TODO: 说明并展示如何生成代码和运行测试。
运行开发模式命令：npm run serve:dev
运行生产模式命令：npm run serve
打包开发模式命令: npm run build:dev
打包生产模式命令: npm run build
注意调试要用开发模式命令运行（否则调试不了debugger）
#参与
TODO: 说明其他用户和开发人员可如何帮助改善代码。

如需深入了解如何创建优秀的自述文件，请参阅以下[指南](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops)。还可从以下自述文件中寻求灵感:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore)