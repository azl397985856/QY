#!/usr/bin/env node

var program = require("commander");
var chalk = require("chalk");
var fs = require("fs");

var imgCore = require("../lib/imgCore");
var depCore = require("../lib/depCore");

var mail = require("../lib/mail");
var webhook = require("../lib/webhook");

var log = console.log;

function applyPlugins(plugins = [], payload) {
  return plugins.map(plugin => plugin(payload));
}

program
  .version(require("../package.json").version)
  .usage("[project name] [options] ")
  .option(
    "-C, --config <str>",
    "specify your config file, default is .qyconfig"
  )
  .option("-il, --img-list <str,str...>", "img list string seprated by comma")
  .option("-p, --plugins <str,str...>", "plugin list string seprated by comma")
  .parse(process.argv);

var imgList = (program.imgList || "").split(",").filter(q => q);

var config = program.config ? program.config : ".qyconfig";

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

fs.readFile(config, function(err, data) {
  if (!err) {
    var config = JSON.parse(data.toString("utf-8"));

    if (config) {
      var mergedConfig = Object.assign(config, {
        cwd: process.cwd()
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
              config
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
          webhook.send(res, config);
          mail.send(res, config);
        })
        .catch(err => {
          // mail or post webhook
          webhook.send(err, config);
          mail.send(err, config);
        });
    }
  } else {
    console.error("config file", config || "", "is not found");
  }
});
