(function (tree) {

tree.Extend = function Extend(elements, option, index) {
    this.selector = new(tree.Selector)(elements);
    this.option = option;
    this.index = index;
};

tree.Extend.prototype = {
    type: "Extend",
    accept: function (visitor) {
        this.selector = visitor.visit(this.ruleset);
    },
    eval: function (env, selectors) {
        var selfSelectors = findSelfSelectors(selectors || env.selectors),
            targetValue = this.selector.elements[0].value;

        env.frames.forEach(function(frame) {
            frame.rulesets().forEach(function(rule) {
                rule.selectors.forEach(function(selector) {
                    selector.elements.forEach(function(element, idx) {
                        if (element.value === targetValue) {
                            selfSelectors.forEach(function(_selector) {
                                _selector.elements[0] = new tree.Element(
                                    element.combinator,
                                    _selector.elements[0].value,
                                    _selector.elements[0].index
                                );
                                rule.selectors.push(new tree.Selector(
                                    selector.elements
                                        .slice(0, idx)
                                        .concat(_selector.elements)
                                        .concat(selector.elements.slice(idx + 1))
                                ));
                            });
                        }
                    });
                });
            });
        });
        return this;
    }
};

function findSelfSelectors(selectors) {
    var ret = [];

    (function loop(elem, i) {
        if (selectors[i] && selectors[i].length) {
            selectors[i].forEach(function(s) {
                loop(s.elements.concat(elem), i + 1);
            });
        }
        else {
            ret.push({ elements: elem });
        }
    })([], 0);

    return ret;
}

})(require('../tree'));
