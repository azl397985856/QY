# QY

一站式前端自动检测平台

## 名字的由来

`西游记`中记载：唐丞相魏征斩了泾河老龙王之后，老龙王的鬼魂自觉委屈，便每夜进入内宫找唐太宗李世民索命。无奈宫门外有`秦琼`，`尉迟恭`二将把守，老龙王冤魂自不敢从双锏双鞭下走过，便转至皇宫的后宰门，砸砖碎瓦。由于秦琼和尉迟恭已在前门，故丞相魏征只好亲自持诛龙宝剑夜守后宰门，时间一长，老龙王的冤魂渐渐地衰落下去，魏征手中那把诛龙宝剑便不再呈高扬之状而垂立一侧了。魏征在隋唐演义中本是一文臣，最早在潞城县二贤庄三清观内当道长，后被民间奉为门神后，其像也仗剑怒目，一派英武气概。

因此取`秦琼`和`尉迟恭`二人的名字作为我们的名字。中国民间常常将二人供奉为门神，将其神像贴于门上，用以驱邪避鬼、卫家宅、保平安、助功利、降吉祥等。我们的这个平台做的事情也是一样，将牛鬼蛇神拒之门外，保证代码的高质量，这是一个伟大的愿景。

## 我们的目标

我们的目标是有两个关键字。 一个是检测，另一个是弱相关。 检测的意思是我们只会检测并给出检测结果。并不会对文件进行任何修改，也就是说没有副作用。第二个是弱相关，怎么理解呢？ 其实就是我们检测的东西是那些即使你错了，也可以正常运行，从而被很多人，尤其是习惯不好的人所忽略的内容。

## 第一期功能

第一期功能比较有限，我会在接下来的时间慢慢完善，将检测的范围和精确度上更进一层。第一期的功能主要有：

### 检测

图片：包括图片类型检测，图片大小检测，图片相似度检测。

依赖：对项目的 package 进行检测，发现没用的，过期的，是否有已知的安全隐患。

### 通知

将检测结果通知相关人员。支持 webhook 自定义

## 下一步

1.  加入不安全写法的检测，并可以通过插件实现定制。如公司信息泄漏，安全隐患写法等。
2.  支持更多图片格式和类型，如 base64，webp 等
3.  将 QY 拆分为 QY-cli 和 QY-core

## 让我们开始吧

### 配置

1.  将 qy.config.js 放到项目根目录。

文件内容如下：

```js
{
  root: '/', // 项目根目录,默认当前目录
  imgThreshold: 50, // 限制图片大小为50k内 （单位kb），默认30kb
  imgExts: ['png'], // 限制的图片类型，不限制填*，也可不填。默认不限制。
  imgSSIMThreshold: 0.7, // 图片相似度阀值，默认为0.8
  webhookUrl: 'http://www.xxx.com/', // 推送结果的webhookUrl，默认不推送
  postProccess(content) { // 对检测结果的后处理，参数是检测报告，string类型
      return content.replace(/\/Users.*?project-name/gim, "project-name");
  },
  checkDeps: true, // 只有true才会检测依赖
  checkDepsOpts: { // 检测依赖配置，详情：https://github.com/depcheck/depcheck#API
    withoutDev: false, // [DEPRECATED] check against devDependencies
    ignoreBinPackage: false, // ignore the packages with bin entry
    ignoreDirs: [
      // folder with these names will be ignored
      "sandbox",
      "dist",
      "bower_components"
    ],
    ignoreMatches: [
      // ignore dependencies that matches these globs
      "grunt-*"
    ]
  }
}
```

2.  安装 qy-cli

```bash
npm i qy-cli -g
```

3.  运行

```
cd your-workspace
qy
```

## 插件

我们提供了插件机制供开发者定制自己的功能。这里有一个插件的例子：[图片压缩插件](https://www.npmjs.com/package/qy-plugin-compress)

本质上插件就是一个函数，函数的参数是用户的配置信息（见上方的配置）和 img-list。插件将会在**检测通过之后**调用。
将来我们也可能增加更多钩子。 比如检测失败的钩子，检测成功的钩子等。

## FQ&A

1.  Cannot find module '/xxxx/xxxx/qy.config.js'

maybe you should specify the root.for example:

```js
./qy-cli.js --root ../
```

2.  the chalk does't work as expected.

try FORCE_COLOR=1.

```bash
FORCE_COLOR=1 node test/walk.js
```

## 参考

[Does this package have known security vulnerabilities](https://snyk.io/test/npm/redux)

[controlling-node-js-security-risk-npm-dependencies](https://blog.risingstack.com/controlling-node-js-security-risk-npm-dependencies/)

## License

MIT
