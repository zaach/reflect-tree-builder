var base  = require("reflect-builder").wrapper;
var tree = require("./tree");

// extend the base builder then define builder methods on exports
tree.wrap(
  base.wrap()
)({builder: exports});

// allow other builder "middleware" to compose with this one
exports.wrapper = tree;
