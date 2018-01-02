const depCore = {
  check(config) {
    // 读取package文件
    // 将依赖转化为数组
    // 依次发送GET请求获取解析结果
    // 匹配，计算结果
    const result = {
      success: true,
      warning: [],
      needUpdate: [],
      danger: []
    };
    if (result.success) {
      return Promise.resolve(result);
    }
    return Promise.reject(result);
  }
};

export default depCore;
