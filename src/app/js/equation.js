// All objects in the equation editor will inherit
// from Equation. This is where methods/properties
// should be set that will be common to all objects in
// the editor.
eqEd.Equation = function(fontMetrics) {
    this.className = "eqEd.Equation";
    // SymbolSizeConfig gives some info about fontHeights.
    // Allows all calculations to happen with plain javascript
    // objects without accessing the DOM.
    this.fontMetrics = fontMetrics;
    // The properties array is required for use with Property
    // class. Allows for automatic resolution of dependencies
    // during formatting loop.
    this.properties = [];
    // All object will have left, top, width, height props,
    // in the class to be actually instantiated, will want
    // to create new Property() to represent these values,
    // because allows for a tying to the DOM.
    this.left = 0;
    this.top = 0;
    this.width = 0;
    this.height = 0;
    // When calculating width, padding will be included
    // as part of the width.
    this.padLeft = 0;
    this.padRight = 0;
    this.padTop = 0;
    this.padBottom = 0;
    // Any adjust variable will affect the absolute
    // placement on the page, but will not affect
    // width calculation.
    this.adjustLeft = 0;
    this.adjustTop = 0;
    // Each object will have a corresponding object residing
    // in the Dom. To populate this property, call
    // this.buildDomObj().
    this.domObj = null;
    // Every object has a parent (except for the very top
    // level container, which will have a parent value of
    // null). The parent of a wrapper will be a container.
    // The parent of a container will be a wrapper. The
    // parent of some other object (say the horizontal 
    // bar in a fraction), will be the wrapper that 
    // contains it.
    this.parent = null;
    // This is an array for children of an equation
    // object. Some objects, like containers, and wrappers
    // have their own unique children arrays. This is a default
    // children array for non-wrappers/containers.
    this.children = [];
};

(function() {
    eqEd.Equation.prototype.constructor = eqEd.Equation;
    // Each object must have a definition for clone,
    // because will need deep clones of equations for
    // copy/cut, paste mechanisms.
    eqEd.Equation.prototype.clone = function() {
        var copy = new this.constructor(this.fontMetrics);
        return copy;
    };
    // Use buildDomObj() to create an instance of
    // equationDom.
    eqEd.Equation.prototype.buildDomObj = function() {};
    // update() will recursively call compute() on
    // nested objects while making sure all depencencies
    // are resolved in the correct order. Requires the
    // Property class. Also takes care of updating Dom
    // objects that correspond to properties being
    // computed.
    eqEd.Equation.prototype.update = function() {
        for (var i = 0; i < this.properties.length; i++) {
            this.properties[i].compute();
        }
        for (var i = 0; i < this.children.length; i++) {
            this.children[i].update();
        }
    };
    // updateAll allows formatting the entire equation
    // that some object belongs to without having a
    // reference to the root node.
    eqEd.Equation.prototype.updateAll = function() {
        // get the root element
        var currentElement = this;
        while (currentElement.parent !== null) {
            currentElement = currentElement.parent;
        }
        var rootElement = currentElement;
        // Do some set up in the static Property object
        // to allow for scanning of compute() methods
        // to determine dependencies dynamically.
        Property.beginComputing();
        
        // This line kicks off the recursive formatting cycle.
        rootElement.update();

        // Do some clean up for the static Property object.
        // This will allow for a new recursive update cycle
        // to occur correctly in the future.
        Property.endComputing();
    };
    // If this is called during a compute() call, should
    // call compute on fontSize  properties that are
    // encountered.
    eqEd.Equation.prototype.getFontHeight = function() {
        var context = this;
        while (typeof context.fontSize === "undefined") {
          context = context.parent;
        }
        return this.fontMetrics.height[context.fontSize];
    }
    eqEd.Equation.JsonTypeToConstructor = function(type) {
        var typeToConstructorMapping = {
            'Accent': eqEd.AccentWrapper,
            'BigOperator': eqEd.BigOperatorWrapper,
            'BracketPair': eqEd.BracketPairWrapper,
            'Bracket': eqEd.BracketWrapper,
            'FunctionLower': eqEd.FunctionLowerWrapper,
            'Function': eqEd.FunctionWrapper,
            'Integral': eqEd.IntegralWrapper,
            'Limit': eqEd.LimitWrapper,
            'LogLower': eqEd.LogLowerWrapper,
            'Matrix': eqEd.MatrixWrapper,
            'NthRoot': eqEd.NthRootWrapper,
            'Operator': eqEd.OperatorWrapper,
            'SquareRoot': eqEd.SquareRootWrapper,
            'StackedFraction': eqEd.StackedFractionWrapper,
            'Subscript': eqEd.SubscriptWrapper,
            'SuperscriptAndSubscript': eqEd.SuperscriptAndSubscriptWrapper,
            'Superscript': eqEd.SuperscriptWrapper,
            'Symbol': eqEd.SymbolWrapper
        }
        return typeToConstructorMapping[type];
    };
})();