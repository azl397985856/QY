var program = require("commander");
var chalk = require("chalk");
var fs = require("fs");
var path = require("path");

var imgCore = require("../src/imgCore");
var depCore = require("../src/depCore");

var mail = require("../src/mail");
var webhook = require("../src/webhook");

// utils
var loadDir = require("../src/utils");

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

var config = program.config ? program.config : "qy.config.js";

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
let data = loadDir(`${root}/${config}`);

if (data) {
  var mergedConfig = Object.assign(data, {
    root
  });

  // 1. 图片：包括图片类型检测，图片大小检测，图片相似度检测。
  // loading
  log(chalk.blue("准备开始检测......"));

  var imgPromise = imgCore
    .check(imgList, mergedConfig) // TODO: 解析样式文件中的图片，生成图片数组
    .then(res => {
      // loading finish
      if (res.success) {
        applyPlugins(costomPlugins, {
          imgList,
          config: data
        });
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
  // 2. 依赖：对项目的 package 进行检测，发现没用的，过期的，是否有已知的安全隐患。
  var depPromise = depCore
    .check(mergedConfig)
    .then(res => {
      // loading finish
      if (res.success) {
        log(chalk.green("依赖检测未发现问题"));
      } else {
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

  Promise.all([imgPromise, depPromise])
    .then(res => {
      // mail or post webhook
      webhook.send(res, data);
      mail.send(res, data);
    })
    .catch(err => {
      // mail or post webhook
      webhook.send(err, data);
      mail.send(err, data);
    });
}
