var wrapper  = require("./default");

// wrapper.wrap() returns a function that defines the builder
var extend = wrapper.wrap();

// define builder functions directly on exports
extend({builder: exports});

// allow other builder "middleware" to compose with this one
exports.wrapper = wrapper;
