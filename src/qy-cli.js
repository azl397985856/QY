#!/usr/bin/env node
var program = require("commander");
var chalk = require("chalk");
var fs = require("fs");
var path = require("path");

var imgCore = require("./imgCore");
var depCore = require("./depCore");

var mail = require("./mail");
var webhook = require("./webhook");

// utils
var loadDir = require("./utils");

var log = console.log;

function applyPlugins(plugins = [], payload) {
  return plugins.map(plugin => plugin(payload));
}

program
  .version(require("../package.json").version)
  .usage("[project name] [options] ")
  .option(
    "-C, --config <str>",
    "specify your config file, default is qy.config.js"
  )
  .option("-il, --img-list <str,str...>", "img list string seprated by comma")
  .option("-p, --plugins <str,str...>", "plugin list string seprated by comma")
  .option("-r, --root <str>", "the root path of the project")
  .parse(process.argv);

var imgList = (program.imgList || "").split(",").filter(q => q);

var configFile = program.config ? program.config : "qy.config.js";

var plugins = program.plugins;

let costomPlugins;

if (plugins) {
  try {
    costomPlugins = plugins.split(",").map(plugin => {
      const module = require(`qy-plugin-${plugin}`);
      if (module instanceof Function) {
        return module;
      }
      throw new Error("插件必须是一个函数");
    });
  } catch (err) {
    log(chalk.red("加载插件出错", err));
  }
}
const root = program.root || process.cwd();
let config;
if (!fs.existsSync(`${root}/${configFile}`)) {
  config = {};
} else {
  config = loadDir(`${root}/${configFile}`);
}

if (config) {
  var mergedConfig = Object.assign(config, {
    root
  });

  function postWebhook({ img, dep }) {
    const webhookUrl = config.webhookUrl;
    const postProccess = config.postProccess;
    const checkDeps = config.checkDeps;

    let processedImgContent = img.content;

    let processedDepContent = Boolean(checkDeps) ? dep.content : "";

    if (processedDepContent || processedImgContent) {
      // 传递给用户自定义的处理函数处理
      if (postProccess && postProccess instanceof Function) {
        processedDepContent = postProccess(processedDepContent);
      }

      if (postProccess && postProccess instanceof Function) {
        processedImgContent = postProccess(processedImgContent);
      }

      // 打印届国际
      const msg = [
        processedImgContent && "-------图片检测结果--------",
        processedImgContent || "",
        processedDepContent && "-------依赖检测结果--------",
        processedDepContent || ""
      ].join("\n");

      console.log(msg);

      // 有检测结果且用户配置了webhookUrl
      if (webhookUrl) {
        webhook.send(
          Object.assign({
            msg,
            webhookUrl
          }),
          config
        );
      }
    }
  }

  // 1. 图片：包括图片类型检测，图片大小检测，图片相似度检测。
  // loading
  log(chalk.blue("准备开始检测......"));

  // 目前插件只有一种， 就是在运行之前执行一次，
  // 将图片列表和config配置传过去
  fs.readFile(`${root}/package.json`, "utf-8", (err, data) => {
    if (err) return err;

    applyPlugins(costomPlugins, {
      imgList,
      config: config,
      packageData: JSON.parse(data)
    });
  });

  var imgPromise = Promise.resolve({});
  if (config.checkIMG) {
    imgPromise = imgCore
      .check(imgList, mergedConfig) // TODO: 解析样式文件中的图片，生成图片数组
      .then(res => {
        // loading finish

        if (res.success) {
          log(chalk.green("图片检测未发现问题"));
        } else {
          log(chalk.red("图片检测发现问题"));
        }
        return res;
      })
      .catch(err => {
        // loading finish
        log(chalk.red("图片检测失败", err));

        return err;
      });
  }

  var depPromise = Promise.resolve({});

  if (config.checkDeps) {
    // 2. 依赖：对项目的 package 进行检测，发现没用的，过期的，是否有已知的安全隐患。
    depPromise = depCore
      .check(mergedConfig)
      .then(res => {
        // loading finish
        if (res.success) {
          log(chalk.green("依赖检测未发现问题"));
        } else if (config.checkDeps) {
          log(chalk.red("依赖检测发现问题"));
        }
        return res;
      })
      .catch(err => {
        // loading finish
        // chalk red
        log(chalk.red("依赖检测失败", err));
        return err;
      });
  }

  Promise.all([imgPromise, depPromise])
    .then(res => {
      // mail or post webhook
      postWebhook({
        img: res[0],
        dep: res[1]
      });
      // mail.send(res, config);
    })
    .catch(err => {
      // mail or post webhook

      postWebhook({
        img: err[0],
        dep: err[1]
      });
      // mail.send(err, config);
    })
    .then(() => log(chalk.blue("检测完成～")));
}
