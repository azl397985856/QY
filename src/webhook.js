// const request = require("request");
function request() {}
const mail = {
  send({ webhookUrl }) {
    // 读取webhook url配置文件
    // 直接向webhook url发送请求
    return request(webhookUrl);
  }
};

export default mail;
