const assert = require("assert");

const images = [
  "https://yun.tuisnake.com/h5/activity/fishinggold/images/table.png",
  "https://yun.yuyiya.com/mami-media/img/ajx2cpm6ih.png"
];
var imgCore = require("../lib/imgCore");

imgCore
  .check(images, {
    imgThreshold: 50,
    imgExts: ["image/png"],
    imgSSIMThreshold: 0.75
  })
  .then(res => assert.equal(res.success, false));

imgCore
  .check(images, {
    imgThreshold: 50,
    imgExts: ["image/jpeg"],
    imgSSIMThreshold: 0.75
  })
  .then(res => assert.equal(res.success, false));

imgCore
  .check(images, {
    imgThreshold: 50,
    imgExts: ["image/jpeg", "image/png"],
    imgSSIMThreshold: 0.75
  })
  .then(res => assert.equal(res.success, true));
