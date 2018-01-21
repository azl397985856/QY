var fs = require("fs");
var path = require("path");
var vm = require("vm");

function _require(filename) {
  const fn = vm.runInThisContext(
    "(function(require, module, exports, __dirname, __filename, path) {" +
      fs.readFileSync(filename, "utf-8") +
      "\n})"
  );
  const m = {
    exports: {}
  };

  fn.call(m.exports, _require, m, m.exports, __dirname, __filename, path);
  return m.exports;
}
module.exports = function(filename) {
  return _require(filename);
};
