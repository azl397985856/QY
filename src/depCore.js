import fs from "fs";
import npm from "../data/npm.json";

function getNpmRiskyVersions(version, risky) {
  const riskyVersions = Object.keys(risky);
  // ~ ^ *
  function match(riskyVersion, version) {
    return {
      match: true,
      version: riskyVersion
    };
  }
  return riskyVersions
    .map(riskyVersion => match(riskyVersion, version))
    .filter(q => q.match);
}
function lookup(pkgName, version, source = "npm") {
  if (source === "npm") {
    const riskyVersions = getNpmRiskyVersions(version, npm[pkgName]);

    if (npm[pkgName] && riskyVersions.length) {
      console.log(npm[pkgName][riskyVersions[0].version]);
    }
  }
  return false;
}

const depCore = {
  check(config) {
    const root = config.root || "";

    return new Promise((resolve, reject) => {
      fs.readFile(`${root}/package.json`, "utf-8", (err, data) => {
        if (err) return reject(err);

        try {
          const result = JSON.parse(data);
          const dependencies = result.dependencies;
          const devDependencies = result.devDependencies;

          // if (dependencies) {
          //   const names = Object.keys(dependencies);
          //   names.map(name => {
          //     const risky = lookup(name, dependencies[name], "npm");
          //   });
          // }

          // 1. depcheck(unused packages)

          // 2. get download stats(https://api.npmjs.org/downloads/point/last-month/file-writer)

          // 3. check version(current and latest)

          // 4. Snyk test and fix(disabled by default) vulnerable deps

          // 将拿到的依赖，去做查询。
          // 反馈查询结果
        } catch (err) {
          reject(err);
        }
      });
      const result = {
        success: true,
        warning: [],
        needUpdate: [],
        danger: [],
        content: ""
      };

      resolve(result);
    });
  }
};

export default depCore;
