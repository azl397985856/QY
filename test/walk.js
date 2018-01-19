// 使用方法： FORCE_COLOR=1 node test/walk.js

var walk = require("walk");
var path = require("path");
const { spawn } = require("child_process");

var root = path.join(__dirname, "../");
var files = [],
  dirs = [];

getFileList(path.join(root, "assets", "imgs"));

function getFileList(path) {
  var walker = walk.walk(path, { followLinks: false });

  walker.on("file", function(roots, stat, next) {
    files.push(roots + "/" + stat.name);
    next();
  });

  walker.on("directory", function(roots, stat, next) {
    dirs.push(roots + "/" + stat.name);
    next();
  });
  walker.on("end", function() {
    // 调用qy-cli，将文件数组作为参数传进去
    const qy = spawn("bin/qy-cli.js", ["--img-list", files.toString()]);

    qy.stdout.on("data", data => {
      console.log(data + "");
    });

    qy.stderr.on("data", data => {
      console.error(data + "");
    });
  });
}
