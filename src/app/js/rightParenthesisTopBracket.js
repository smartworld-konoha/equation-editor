eqEd.RightParenthesisTopBracket = function(fontMetrics) {
    eqEd.TopBracket.call(this, fontMetrics); // call super constructor.
    this.className = "eqEd.RightParenthesisTopBracket";
    
    this.character = "⎞";
    this.fontStyle = "MathJax_Size4";
    this.domObj = this.buildDomObj();
    this.adjustTop = 0.4;
};
(function() {
    // subclass extends superclass
    eqEd.RightParenthesisTopBracket.prototype = Object.create(eqEd.TopBracket.prototype);
    eqEd.RightParenthesisTopBracket.prototype.constructor = eqEd.RightParenthesisTopBracket;
})();