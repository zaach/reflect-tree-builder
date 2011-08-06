This is the default builder used in [reflect.js](https://github.com/zaach/reflect.js) and is also used as a base for others, such as the [tree builder](https://github.com/zaach/reflect-tree-builder). This builder is useful since the Reflect API doesn't let you change individual node behavior -- you must supply a whole new builder. This builder lets you change only the nodes you care about, leaving the rest as their default behavior.


Example:

    var Reflect = require('reflect');
    var builder = require('reflect-builder');

    // [modificaitons to builder functions here]

    var soure = "var a = b + c;";
    var ast = Reflect.parse(source, {builder: builder});

#### Node Properties

See the [Mozilla](https://developer.mozilla.org/en/SpiderMonkey/Parser_API#Node_objects) docs.

## License

MIT X License
