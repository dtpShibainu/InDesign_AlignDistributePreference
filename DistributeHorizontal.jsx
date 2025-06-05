#target "InDesign"

var spacingStr = $.getenv("lastSpacing") || "10mm";
var spacingVal = new UnitValue(spacingStr).as("pt");

if (app.documents.length === 0 || app.selection.length < 2) {
    alert("オブジェクトを選択してください。");
    exit();
}

app.doScript(function () {
    var doc = app.activeDocument;
    var sel = app.selection;
    var keyObj = doc.selectionKeyObject ? app.selectionKeyObject : undefined;
    var bounds = doc.selectionKeyObject ? AlignDistributeBounds.KEY_OBJECT : AlignDistributeBounds.ITEM_BOUNDS;
    doc.distribute(sel, DistributeOptions.HORIZONTAL_SPACE, bounds, true, spacingVal, keyObj);
}, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT);
