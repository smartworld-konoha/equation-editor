eqEd.RightParenthesisBracket = function(fontMetrics) {
    eqEd.RightBracket.call(this, fontMetrics); // call super constructor.
    this.className = "eqEd.RightParenthesisBracket";

    this.matchingBracketCtor = eqEd.LeftParenthesisBracket;
    this.wholeBracket = new eqEd.RightParenthesisWholeBracket("MathJax_Main", fontMetrics);
    this.topBracket = null;
    this.middleBrackets = [];
    this.bottomBracket = null;

    this.wholeBracket.parent = this;

    this.domObj = this.buildDomObj();
    this.domObj.append(this.wholeBracket.domObj);

    this.children = [this.wholeBracket];

    // Set up the width calculation
    var width = 0;
    this.properties.push(new Property(this, "width", width, {
        get: function() {
            return width;
        },
        set: function(value) {
            width = value;
        },
        compute: function() {
            var widthVal = 0;
            var fontHeight = this.fontMetrics.height[this.parent.parent.fontSize];
            if (this.heightRatio <= 1.5) {
                widthVal = 0.377777 * fontHeight;
            } else if (this.heightRatio > 1.5 && this.heightRatio <= 2.4) {
                widthVal = 0.733333 * fontHeight;
            } else if (this.heightRatio > 2.4 && this.heightRatio <= 3) {
                widthVal = 0.777777 * fontHeight;
            } else if (this.heightRatio > 3 && this.heightRatio <= 3.33) {
                widthVal = 0.88888 * fontHeight;
            } else {
                widthVal = 0.88888 * fontHeight;
            }
            return widthVal;
        },
        updateDom: function() {
            this.domObj.updateWidth(this.width);
        }
    }));

    // Set up the height calculation
    var height = 0;
    this.properties.push(new Property(this, "height", height, {
        get: function() {
            return height;
        },
        set: function(value) {
            height = value;
        },
        compute: function() {
            var heightVal = 0;
            var fontHeight = this.fontMetrics.height[this.parent.parent.fontSize];
            if (this.heightRatio <= 1.5) {
                heightVal = fontHeight;
            } else if (this.heightRatio > 1.5 && this.heightRatio <= 2.4) {
                heightVal = 2.4 * fontHeight;
            } else if (this.heightRatio > 2.4 && this.heightRatio <= 3) {
                heightVal = 3 * fontHeight;
            } else if (this.heightRatio > 3 && this.heightRatio <= 3.33) {
                heightVal = 3.33 * fontHeight;
            } else {
                heightVal = (3.9 + (0.45 * (this.middleBrackets.length - 1))) * fontHeight;
            }
            return heightVal;
        },
        updateDom: function() {
            this.domObj.updateHeight(this.height);
        }
    }));
};
(function() {
    // subclass extends superclass
    eqEd.RightParenthesisBracket.prototype = Object.create(eqEd.RightBracket.prototype);
    eqEd.RightParenthesisBracket.prototype.constructor = eqEd.RightParenthesisBracket;
    eqEd.RightParenthesisBracket.prototype.buildDomObj = function() {
        return new eqEd.EquationDom(this,
            '<div class="bracket rightBracket rightParenthesisBracket"></div>')
    };
    // This is a callback that happens after this.heightRation gets calculated.
    eqEd.RightParenthesisBracket.prototype.updateBracketStructure = function() {
        this.domObj.empty();
        this.wholeBracket = null;
        this.topBracket = null;
        this.middleBrackets = [];
        this.bottomBracket = null;
        this.children = [];
        if (this.heightRatio <= 1.5) {
            this.wholeBracket = new eqEd.RightParenthesisWholeBracket("MathJax_Main", this.fontMetrics);
            this.wholeBracket.parent = this;
            this.domObj.append(this.wholeBracket.domObj);
            this.children = [this.wholeBracket];
        } else if (this.heightRatio > 1.5 && this.heightRatio <= 2.4) {
            this.wholeBracket = new eqEd.RightParenthesisWholeBracket("MathJax_Size3", this.fontMetrics);
            this.wholeBracket.parent = this;
            this.domObj.append(this.wholeBracket.domObj);
            this.children = [this.wholeBracket];
        } else if (this.heightRatio > 2.4 && this.heightRatio <= 3) {
            this.wholeBracket = new eqEd.RightParenthesisWholeBracket("MathJax_Size4", this.fontMetrics);
            this.wholeBracket.parent = this;
            this.domObj.append(this.wholeBracket.domObj);
            this.children = [this.wholeBracket];
        } else if (this.heightRatio > 3 && this.heightRatio <= 3.33) {
            this.topBracket = new eqEd.RightParenthesisTopBracket(this.fontMetrics);
            this.bottomBracket = new eqEd.RightParenthesisBottomBracket(this.fontMetrics);
            this.topBracket.parent = this;
            this.bottomBracket.parent = this;
            this.domObj.append(this.topBracket.domObj);
            this.domObj.append(this.bottomBracket.domObj);
            this.children = [this.topBracket, this.bottomBracket];
        } else {
            var numberOfMiddleBrackets = Math.ceil((this.heightRatio - 3.9)/0.45) + 1;
            this.topBracket = new eqEd.RightParenthesisTopBracket(this.fontMetrics);
            this.bottomBracket = new eqEd.RightParenthesisBottomBracket(this.fontMetrics);
            this.topBracket.parent = this;
            this.bottomBracket.parent = this;
            this.domObj.append(this.topBracket.domObj);
            this.domObj.append(this.bottomBracket.domObj);
            for (var i = 0; i < numberOfMiddleBrackets; i++) {
                var middleBracket = new eqEd.RightParenthesisMiddleBracket(i, this.fontMetrics);
                middleBracket.parent = this;
                this.domObj.append(middleBracket.domObj);
                this.middleBrackets.push(middleBracket);
            }
            this.children = [this.topBracket].concat(this.middleBrackets).concat([this.bottomBracket]);
        }
    }
})();