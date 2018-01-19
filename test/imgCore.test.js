const assert = require("assert");

const images = [
  "https://yun.tuisnake.com/h5/activity/fishinggold/images/table.png",
  "https://yun.yuyiya.com/mami-media/img/ajx2cpm6ih.png"
];
var imgCore = require("../lib/imgCore");

describe("#图片引擎", function() {
  this.timeout(10000);
  it("##图片格式不正确-1", function() {
    return imgCore
      .check(images, {
        imgThreshold: 50,
        imgExts: ["image/png"],
        imgSSIMThreshold: 0.75
      })
      .then(res => {
        assert.equal(res.success, false);
      });
  });

  it("图片格式不正确-2", function() {
    return imgCore
      .check(images, {
        imgThreshold: 50,
        imgExts: ["image/jpeg"],
        imgSSIMThreshold: 0.75
      })
      .then(res => {
        assert.equal(res.success, false);
      });
  });

  it("图片格式正确", function() {
    imgCore
      .check(images, {
        imgThreshold: 50,
        imgExts: ["image/jpeg", "image/png"],
        imgSSIMThreshold: 0.75
      })
      .then(res => {
        assert.equal(res.success, true);
      });
  });
});
