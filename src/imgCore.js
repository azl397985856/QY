const fetch = require("isomorphic-fetch");
// import ssim from "ssim.js";
import { networkInterfaces } from "os";

const imgCore = {
  check(imgList = [], config) {
    const { imgThreshold, imgExts, imgSSIMThreshold } = config;

    const r = imgList.map(imgUrl =>
      fetch(imgUrl).then(response => {
        const type = response.headers.get("Content-Type");
        const size = response.headers.get("Content-Length") / 1024;

        const matchType = imgExts.indexOf(type) !== -1;
        if (!matchType) return `文件(${imgUrl})的类型${type}与期望不匹配\n`;
        if (size > imgThreshold)
          return `文件(${imgUrl})的大小${size}与期望不匹配\n`;
        return "";
      })
    );

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
