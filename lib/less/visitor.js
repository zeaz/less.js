(function (tree) {

    tree.visitor = function(implementation) {
        this._implementation = implementation;
    };

    tree.visitor.prototype = {
        visit: function(node) {

            if (node instanceof Array) {
                return this.visitArray(node);
            }

            if (!node || !node.type) {
                return node;
            }

            var funcName = "visit" + node.type,
                func = this._implementation[funcName],
                visitArgs;
            if (func) {
                visitArgs = {visitDeeper: true};
                node = func(node);
            }
            if ((!visitArgs || visitArgs.visitDeeper) && node.accept) {
                node.accept(this);
            }
            return node;
        },
        visitArray: function(nodes) {
            var i, newNodes;
            for(i = 0; i < nodes.length; i++) {
                var evald = this.visit(nodes[i]);
                if (evald instanceof Array) {
                    newNodes = newNodes.concat(evald);
                } else {
                    newNodes.push(evald);
                }
            }
            return newNodes;
        }
    };

})(require('./tree'));