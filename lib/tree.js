
var before = exports.before = function (base) {

if (!base.builder        ) base.builder        = {};
if (!base.proto          ) base.proto          = {};
if (!base.proto._default ) base.proto._default = {};

base.proto._default.children = function () { return []; };

def('program', 'body',
    function (child) {
        child.parent = this;
        this.body.push(child);
        if (child.type == "VariableDeclaration" && child.kind == "let") {
            child.kind = "var";
        }
    }
);

def('functionDeclaration',['id','params','body'],
    function (child) {
        this.body.appendChild(child);
        if (child.type == "VariableDeclaration" && child.kind == "let") {
            child.kind = "var";
        }
    }
);

def('functionExpression',['id','params','body'],
    function (child) {
        this.body.appendChild(child);
        if (child.type == "VariableDeclaration" && child.kind == "let") {
            child.kind = "var";
        }
    }
);

def('expressionStatement', ['expression']);
def('blockStatement', 'body');
def('variableDeclaration', 'declarations');
def('variableDeclarator', ['id','init']);
def('arrayExpression', 'elements');
def('objectExpression', 'properties');
def('returnStatement', ['argument']);
def('tryStatement', ['block','handler','finalizer']);
def('catchClause', ['param','guard','body']);
def('throwStatement', ['argument']);
def('labeledStatement', ['label','body']);
def('breakStatement', ['label']);
def('continueStatement', ['label']);
def('switchStatement', ['discriminant',['cases']]);
def('switchCase', ['test',['consequent']]);
def('withStatement', ['object','body']);
def('conditionalExpression', ['test','alternate','consequent']);
def('sequenceExpression', 'expressions');
def('binaryExpression', ['left','right']);
def('assignmentExpression', ['left','right']);
def('unaryExpression', ['argument']);
def('updateExpression', ['argument']);
def('callExpression', ['callee',['arguments']]);
def('newExpression', ['callee',['arguments']]);
def('memberExpression', ['object','property']);
def('whileStatement', ['test','body']);
def('doWhileStatement', ['test','body']);
def('forStatement', ['init','test','update','body']);
def('forInStatement', ['left','right','body']);
def('ifStatement', ['test','alternate','consequent']);
def('objectPattern', 'properties');
def('arrayPattern', 'elements');


function def (type, children, append) {
    if (!base.proto[type]) base.proto[type] = {};
    var proto = base.proto[type];
    proto.children = childrenBuilder(children);
    proto.append = append || typeof children == 'string' ?
                             appendBuilder(children) :
                             append;
    proto.remove = remove;
    proto.replace = replace;
}

function remove (delinquent) {
    var children = this.children();
    this.children(children.splice(children.indexOf(delinquent),1));
    return this;
}

function replace (delinquent, adopted) {
    var children = this.children();
    children.splice(children.indexOf(delinquent),1, adopted);
    adopted.parent = this;
    this.children(children);
    return this;
}

// Builds a node.children method which maps properties of the node to/from an array of children
// The arg is either a string, e.g. 'body' for a functionExpression
// or an array, e.g. ['label','body'] for a labeledStatement
// or a nested array, e.g. ['callee',['arguments']] for a newExpression
function childrenBuilder (arg) {
    if (Array.isArray(arg)) {
        if (Array.isArray(arg[1])) {
            return function (setVal) {
                if (setVal) {
                    this[arg[0]] = setVal[0];
                    if (setVal.length > 1) this[arg[1]] = setVal.slice(1);
                }
                return [this[arg[0]]].concat(this[arg[1]]);
            }
        } else {
            return function (setVal) {
                if (setVal) {
                    var self = this;
                    setVal.forEach(function (el, i) {
                        self[arg[i]] = el;
                    });
                    return this.children();
                } else {
                    var self = this;
                    return arg.map(function (el) { return self[el]; });
                }
            }
        }
    } else if (typeof arg === 'string') {
        return function (setVal) { return setVal ? this[arg] = setVal : this[arg]; }
    } else {
        return arg;
    }
}

// Builds a method which appends children to the specified property of a node
function appendBuilder (prop) {
    return function (child) {
        child.parent = this;
        this[prop].push(child);
    };
}

return base;

};

// modifies builder functions to assign the created node as the parent of its children
var after = exports.after = function (base) {
    for (var type in base.builder) (function (nodeType) {
        if (nodeType in base.proto && 'children' in base.proto[nodeType]) {
            var old = base.builder[nodeType];
            base.builder[nodeType] = function () {
                var node = old.apply(old,arguments);
                node.children().forEach(function (child) {
                    if (child) {
                        Object.defineProperty(child, "parent",
                            {value: node, enumerable: false, writable: true});
                    }
                });
                return node;
            }
        }
    })(type);

    return base;
};

exports.wrap = function (fun) {
    return fun ?
        function (base) { return after(fun(before(base))); } :
        function (base) { return after(before(base)); };
};

