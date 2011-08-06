var treeBuilder = require('../lib/builder');

var Reflect = require('reflect');

var ast = Reflect.parse('4 + 5', {builder: treeBuilder});

console.log(ast.children());

