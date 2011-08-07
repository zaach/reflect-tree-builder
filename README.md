A more tree-like AST builder for [reflect.js](https://github.com/zaach/reflect.js).

# Tree Builder
The tree builder creates default nodes extended with properties and methods for traversing and manipulating the tree.


Example:

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

## Install

    npm install reflect-tree-builder

## Node Properties
See the [Mozilla](https://developer.mozilla.org/en/SpiderMonkey/Parser_API#Node_objects) documentation for the default node APIs. The following are additional properties the tree builder provides.

### node.parent
The `node`'s parent.

### node.children([children])
Returns the children of the `node`. If an array of nodes are passed as an argument, they replace `node`'s current set of children.

### node.remove(child)
Removes the specified child from `node`'s set of children.

### node.replace(delinquent, adopted)
Removes the `delinquent` and adds the `adopted` child in its place.

### node.append(child)
For block type nodes, such as `FunctionDeclaration`s, `Program`s, and `Block`s, this appends a child to its list of statements.

# License

MIT X License
