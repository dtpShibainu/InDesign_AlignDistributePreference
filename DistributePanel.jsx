#targetengine "alignPanel"
var lastSpacing = $.getenv("lastSpacing") || "10mm";
var win = new Window("palette", "分布パネル", undefined, { resizeable: false });
win.orientation = "column";
win.alignChildren = "left";
var spacingGroup = win.add("group");
spacingGroup.add("statictext", undefined, "間隔:");
var spacingInput = spacingGroup.add("edittext", undefined, lastSpacing);
spacingInput.characters = 7;


// ショートカットを割り当ててください
win.add("statictext", undefined, "垂直：⌥⌘←");
win.add("statictext", undefined, "水平：⌥⌘→");


spacingInput.onChanging = function () {
    $.setenv("lastSpacing", spacingInput.text);
};

function distribute(mode) {
    if (app.documents.length === 0 || app.selection.length < 2) {
        alert("2つ以上のオブジェクトを選択してください。");
        return;
    }
    var spacingStr = spacingInput.text;
    var spacingVal;
    try {
        spacingVal = new UnitValue(spacingStr).as("pt");
    } catch (e) {
        alert("単位エラー: " + e);
        return;
    }
    $.setenv("lastSpacing", spacingStr);
    $.setenv("lastMode", mode);
    app.doScript(function () {
        var doc = app.activeDocument;
        var sel = app.selection;
        var keyObj = doc.selectionKeyObject ? app.selectionKeyObject : undefined;
        var bounds = doc.selectionKeyObject ? AlignDistributeBounds.KEY_OBJECT : AlignDistributeBounds.ITEM_BOUNDS;
        var opt = (mode === "HORIZONTAL") ? DistributeOptions.HORIZONTAL_SPACE : DistributeOptions.VERTICAL_SPACE;
        doc.distribute(sel, opt, bounds, true, spacingVal, keyObj);
    }, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT);
}

win.center();
win.show();
