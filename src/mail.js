const nodemailer = require("nodemailer");

const mail = {
  send(config) {
    // 读取账户配置文件
    // 将配置转化，下传给node-mail模块
    return Promise.resolve({
      success: true
    });
    return nodemailer.createAccount().sendMail();
  }
};

export default mail;
