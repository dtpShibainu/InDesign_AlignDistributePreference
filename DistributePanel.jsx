#targetengine "alignPanel"

var lastSpacing = $.getenv("lastSpacing") || "10mm";

var win = new Window("palette", "分布パネル", undefined, { resizeable: false });
win.orientation = "column";
win.alignChildren = "left";

var spacingGroup = win.add("group");
spacingGroup.add("statictext", undefined, "間隔:");
var spacingInput = spacingGroup.add("edittext", undefined, lastSpacing);
spacingInput.characters = 7;

win.add("statictext", undefined, "垂直：⌥⌘←");
win.add("statictext", undefined, "水平：⌥⌘→");

spacingInput.onChanging = function () {
    $.setenv("lastSpacing", spacingInput.text);
};

win.addEventListener("keydown", function (k) {
    if (!k.metaKey || !k.altKey) return;
    if (k.keyName === "Left") {
        distribute("VERTICAL");
        k.preventDefault();
    } else if (k.keyName === "Right") {
        distribute("HORIZONTAL");
        k.preventDefault();
    }
});

function distribute(mode) {
    if (app.documents.length === 0 || app.selection.length < 2) {
        alert("2つ以上のオブジェクトを選択してください。");
        return;
    }

    var spacingStr = spacingInput.text;
    var spacingValPT;

    try {
        spacingValPT = new UnitValue(spacingStr).as("mm"); // ★ ptに変換（mm入力対応）
    } catch (e) {
        alert("有効な単位付き数値（例：10mm, 15pt）を入力してください。\n" + e);
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

        doc.distribute(sel, opt, bounds, true, spacingValPT, keyObj);
    }, ScriptLanguage.JAVASCRIPT, undefined, UndoModes.ENTIRE_SCRIPT);
}

win.center();
win.show();
