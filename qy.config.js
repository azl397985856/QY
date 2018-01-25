module.exports = {
  root: path.resolve(),
  imgThreshold: 50,
  imgExts: ["image/jpeg"],
  imgSSIMThreshold: 0.75,
  checkDeps: true,
  webhookUrl:
    "https://oapi.dingtalk.com/robot/send?access_token=d13cec2d8ac5fd6ac2e07a566bd734a3164eee3511654a3a046cd61cb810cbc3",
  checkDepsOpts: {
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
};
