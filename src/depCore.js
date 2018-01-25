import fs from "fs";
import depcheck from "depcheck";

import npm from "../data/npm.json";

function getNpmRiskyVersions(version, risky) {
  if (!risky) return [];
  const riskyVersions = Object.keys(risky);
  // TODO:  ~ ^ * 匹配版本
  function match(riskyVersion, version) {
    return {
      match: true, // 先写死，必然命中
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
      return {
        result: true,
        content: npm[pkgName][riskyVersions[0].version]
      };
    }
  }
  return {
    result: false,
    content: ""
  };
}

// object -> String
function stringify(obj) {
  return Object.keys(obj)
    .map(key => {
      const item = obj[key];
      if (!item) return item;
      if (item instanceof Array) {
        if (!item.length) return "";
        return `${key}:${item.join(",")}`;
      } else if (item instanceof Object) {
        if (!Object.keys(item).length) return "";
        return `${key}:${JSON.stringify(item)}`;
      }
      return `${key}:${item}`;
    })
    .filter(q => q)
    .join("\n");
}
const depCore = {
  check(config) {
    const root = config.root || "";
    const checkDepsOpts = config.checkDepsOpts || {};

    return new Promise((resolve, reject) => {
      fs.readFile(`${root}/package.json`, "utf-8", (err, data) => {
        if (err) return reject(err);

        let dependenciesRiskys = [];
        let devDependenciesRiskys = [];

        try {
          const result = JSON.parse(data);
          const dependencies = result.dependencies;
          const devDependencies = result.devDependencies;

          if (dependencies) {
            const names = Object.keys(dependencies);
            dependenciesRiskys = names.map(name => {
              return lookup(name, dependencies[name], "npm");
            });
          }

          if (devDependencies) {
            const names = Object.keys(dependencies);
            devDependenciesRiskys = names.map(name => {
              return lookup(name, dependencies[name], "npm");
            });
          }

          // 1. depcheck(unused packages)
          const checkResult = {
            "unused dependencies": [],
            "unused devDependencies": [],
            missing: {},
            "invalid files": {},
            "invalid dirs": {}
          };

          depcheck(root, checkDepsOpts, unused => {
            checkResult["unused dependencies"] = unused.dependencies;
            checkResult["unused devDependencies"] = unused.devDependencies;

            checkResult.missing = unused.missing;

            checkResult["invalid files"] = unused.invalidFiles;
            checkResult["invalid dirs"] = unused.invalidDirs;

            const warning = devDependenciesRiskys
              .concat(dependenciesRiskys)
              .filter(r => r.result)
              .map(r => r.content)
              .join("");
            const info = stringify(checkResult);

            const result = {
              success: !!!(warning || info),
              warning,
              info,
              needUpdate: [],
              danger: [],
              content: warning.concat(info)
            };

            resolve(result);
          });

          // 2. get download stats(https://api.npmjs.org/downloads/point/last-month/file-writer)

          // 3. check version(current and latest)

          // 4. Snyk test and fix(disabled by default) vulnerable deps

          // 将拿到的依赖，去做查询。
          // 反馈查询结果
        } catch (err) {
          reject(err);
        }
      });
    });
  }
};

export default depCore;
