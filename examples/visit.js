var Reflect = require('reflect');
var treeBuilder = require('reflect-tree-builder');

var source = "a + b + c(5)";
var ast = Reflect.parse(source, {builder: treeBuilder});

function visit (node, pre, post) {
    if (pre) pre(node);
    node.children().forEach(function (child) {
        visit(child, pre, post);
    });
    if (post) post(node);
}

visit(ast, null, function (n) { console.log(n.type); });

