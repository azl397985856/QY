const imgCore = {
  check(config) {
    const { imgThreshold, imgExts, imgSSIMThreshold } = config;

    // 类型
    const actualExts = "png";
    // 大小
    const size = 1056;
    // 相似度
    const similarity = 0.6;

    // 匹配，计算结果
    const result = {
      success: false,
      actualExts,
      size,
      similarity
    };

    return Promise.resolve(result);
  }
};

export default imgCore;
