#!/usr/bin/env node

var program = require("commander");
var fs = require("fs");

var imgCore = require("../lib/imgCore");
var depCore = require("../lib/depCore");

var mail = require("../lib/mail");
var webhook = require("../lib/webhook");

program
  .version(require("../package.json").version)
  .usage("[project name] [options] ")
  .option(
    "-C, --config <str>",
    "specify your config file, default is .qyconfig"
  )
  .parse(process.argv);

var deploy_env = program.args[0];
var config = program.config ? program.config : ".qyconfig";
fs.readFile(config, function(err, data) {
  if (!err) {
    var config = JSON.parse(data.toString("utf-8"));
    if (config) {
      // 1. 图片：包括图片类型检测，图片大小检测，图片相似度检测。
      // loading
      var imgPromise = imgCore
        .check(config)
        .then(res => {
          // loading finish
          if (res.success) {
            // chalk green
          } else {
            // chalk red
          }
        })
        .catch(err => {
          // loading finish
          // chalk red
        });
      // 2. 依赖：对项目的 package 进行检测，发现没用的，过期的，是否有已知的安全隐患。
      var depPromise = depCore
        .check(config)
        .then(res => {
          // loading finish
          if (res.success) {
            // chalk green
          } else {
            // chalk red
          }
        })
        .catch(err => {
          // loading finish
          // chalk red
        });

      Promise.all(imgPromise, depPromise)
        .then(res => {
          // mail or post webhook
          webhook.send(config);
          mail.send(config);
        })
        .catch(err => {
          // mail or post webhook
          webhook.send(config);
          mail.send(config);
        });
    }
  } else {
    console.error("config file", config || "", "is not found");
  }
});
