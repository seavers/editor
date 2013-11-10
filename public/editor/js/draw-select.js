(function () {

    "use strict";
    var utils = play.utils,
        position = play.position,
        grid = play.grid,
        select = play.select,
        drag = play.drag,
        align = play.align,
        history = play.history,


        getAllEls = function (cood) {


            var results = [];
            var worker = function (root) {
                var y = position.isFullIn(cood, position.cood(root));
                if (y) {
                    results.push(root.get(0));
                    var children = root.children();

                    children.each(function (index, el) {
                        worker($(el));
                    })
                }
                else {
                    var children = root.children();
                    children.each(function (index, el) {
                        worker($(el));
                    })
                }

            }

            worker($(play.iframeDoc.body))


            return $(results);


        },


        el, selectedEls = [];


    var onstart = function (sx, sy, target) {

        if (play.cmd !== "select") return;

        if (target.prop("moveable")&&target.closest(play.select.selectedEL).length) return;

        play.select.selectedEL = $("");
        play.select.cancelSelectEL();

        el = $('<div style="pointer-events: none"></div>');

        el.css("top", "0");
        el.css("left", "0");
        el.css("width", "0");
        el.css("height", "0");
        el.css("border", "dashed 1px gray");
        el.css("position", "absolute");
        el.css("pointer-events", "none");
        el.appendTo(play.container);

        selectedEls = [];



        //select.cancelSelectEL();


    };

    var timer;
    var ondrag = function (startX, startY, endX, endY, target) {

        if (play.cmd != "select")return;


        if (target.prop("moveable")&&target.closest(play.select.selectedEL).length) return;
        if (el) {

            var cood = position.toCood(startX, startY, endX, endY);
            position.cood(el, cood);


            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            timer = setTimeout(function () {

                var allEls = getAllEls(cood);


                if (allEls.length > 0) {
                    allEls.each(function (index, el) {
                        select.addEl($(el));
                    })
                }

            }, 5)


        }
    }
    var onend = function (startX, startY, endX, endY, target) {
        if (play.cmd != "select")return;


        if (el)el.remove();


    }


    $(document).on("iframeload", function () {

        // todo 圈区域的时候是否子父节点同时选择
        drag.ondraw(play.iframeDoc, onstart, ondrag, onend, play.iframeDoc);

    })


})();