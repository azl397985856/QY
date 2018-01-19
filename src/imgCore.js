const fetch = require("isomorphic-fetch");
const path = require("path");
const fs = require("fs");
const mime = require("mime");
// import ssim from "ssim.js";

const imgCore = {
  check(imgList = [], config) {
    const { imgThreshold, imgExts, imgSSIMThreshold } = config;

    const r = imgList.map(imgUrl => {
      if (path.isAbsolute(imgUrl)) {
        return new Promise((resolve, reject) => {
          fs.stat(imgUrl, (err, data) => {
            if (!err) {
              const type = mime.getType(imgUrl);
              const size = data.size / 1024;

              const matchType = imgExts.indexOf(type) !== -1;
              let errorMsg = "";
              if (!matchType)
                errorMsg += `文件(${imgUrl})的类型${type}与期望不匹配\n`;

              if (size > imgThreshold)
                errorMsg += `文件(${imgUrl})的大小${size}与期望不匹配\n`;
              return resolve(errorMsg);
            }
            return reject(err);
          });
        });
      } else {
        return fetch(imgUrl).then(response => {
          const type = response.headers.get("Content-Type");
          const size = response.headers.get("Content-Length") / 1024;

          let errorMsg = "";
          const matchType = imgExts.indexOf(type) !== -1;

          if (!matchType)
            errorMsg += `文件(${imgUrl})的类型${type}与期望不匹配\n`;
          if (size > imgThreshold)
            errorMsg += `文件(${imgUrl})的大小${size}与期望不匹配\n`;

          return errorMsg;
        });
      }
    });

    return Promise.all(r).then(content => {
      // imgList.reduce((pre, next) => {
      //   return ssim(pre, next)
      //     .then(out => console.log(`SSIM: ${out.mssim} (${out.performance}ms)`))
      //     .catch(function(err) {
      //       console.error("Error generating SSIM", err);
      //     });
      // });

      const success = !content.filter(q => q).length;

      return {
        success,
        content: content.filter(q => q).join("\n")
      };
    });
  }
};

export default imgCore;
