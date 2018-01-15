import fs from "fs";

const depCore = {
  check(config) {
    const cwd = config.cwd || "";
    // 读取package文件
    // 将依赖转化为数组
    // 依次发送GET请求获取解析结果
    // 匹配，计算结果

    fs.readFile(`${cwd}/package.json`, "utf-8", (err, data) => {
      if (err) throw err;

      try {
        const result = JSON.parse(data);
        const dependencies = result.dependencies;
        const devDependencies = result.devDependencies;

        // 将拿到的依赖，去做查询。
        // 反馈查询结果
      } catch (err) {
        throw new Error("package.json应该是一个JSON文件", err);
      }
    });
    const result = {
      success: true,
      warning: [],
      needUpdate: [],
      danger: []
    };

    return Promise.resolve(result);
  }
};

export default depCore;
