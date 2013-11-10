(function () {


    var utils = play.utils,
        position = play.position,
        grid = play.grid,
        select = play.select,
        dom = play.dom,
        drag = play.drag,
        align = play.alignAuto,
        history = play.history;
    //move


    var left,
        top,
        marginTop,
        marginLeft,
        el,
        helper,

        target,
        axis,
        containment,
        moveable, oCood, oldCood, target;


    var centerX = function (x) {
        return   x - target.width() / 2

    }
    var centerY = function (y) {
        return   y - target.height() / 2

    }


    var startDrag = function (startX, startY, target) {


        if (play.cmd != "select")return;


        if (!target.closest(select.selectedEL).length) return;

        if (target.closest("[contenteditable='true']").length) {
            return;
        }


        moveable = select.selectedEL.prop("moveable");

        if (!moveable)return;
        play.cmd = "move";


        target = select.selectedEL;

        target = moveable && moveable.target || target;
        oCood = select.cood;


        //  $(iframe).css("pointer-events", "none");


    }
    var ondrag = function (startX, startY, endX, endY, target) {


        if (play.cmd != "move")return;

        if (!target.closest(select.selectedEL).length) return;
        if (target.closest("[contenteditable='true']").length) {
            return;
        }
        target = select.selectedEL;
        if (!moveable)return;

        oldCood = {
            left: oCood.left + (endX - startX),
            top: oCood.top + (endY - startY),
            width: oCood.width,
            height: oCood.height
        }
        oldCood.right = oldCood.left + oldCood.width;
        oldCood.bottom = oldCood.top + oldCood.height;


        align.start(oldCood, parent, moveable, select.selectedEL);
        var cood = align.cood;

        if (cood.x) {
            if (cood.x.position == 0) {
                oldCood.left = cood.x.value
            } else if (cood.x.position == 1) {
                oldCood.left = cood.x.value - el.width() / 2;
            }
            else if (cood.x.position == 2) {
                oldCood.left = cood.x.value - el.width()
            }
        }

        if (cood.y) {
            if (cood.y.position == 0) {

                oldCood.top = cood.y.value;

            } else if (cood.y.position == 1) {

                oldCood.top = cood.y.value - select.selectedEL.height() / 2;

            }
            else if (cood.y.position == 2) {
                oldCood.top = cood.y.value - select.selectedEL.height()
            }

        }


        if (moveable.axis == "x") {

            oldCood.top = oCood.top;
            oldCood.bottom = oCood.bottom;

        }
        if (moveable.axis == "y") {
            oldCood.left = oCood.left;
            oldCood.right = oCood.right;
        }


        if (moveable.containment) {

            var containCood = position.cood(moveable.containment);


            if (oldCood.left < containCood.left) {
                oldCood.left = containCood.left
            }
            if (oldCood.right > containCood.right) {
                oldCood.left = containCood.right - oldCood.width;
            }
            if (oldCood.top < containCood.top) {
                oldCood.top = containCood.top
            }
            if (oldCood.bottom > containCood.bottom) {
                oldCood.top = containCood.bottom - oldCood.height;
            }


        }


        helper.position(oldCood);


        var parent = position.getFullInParent(oldCood, play.iframeDoc);


        select.selectParentEL(parent);


    }
    var endDrag = function (startX, startY, endX, endY, target, endTarget) {
        if (play.cmd != "move")return;


        if (!target.closest(select.selectedEL).length) return;

        if (target.closest("[contenteditable='true']").length) {
            return;
        }
        target = select.selectedEL;
        if (!moveable)return;


        align.stop()
        select.move();
        select.cancelHoverEL();
        select.unSelectParentEL()
        helper.hide();


        var filterChildren = function () {

            return   select.selectedEL.filter(function (index) {
                var el = select.selectedEL.eq(index);
                var result = true;
                select.selectedEL.each(function (index, parent) {

                    if ($(parent).find(el).length) {

                        result = false;

                    }
                })

                return result;


            })


        }

        var els = filterChildren();


        els.each(function (index, el) {

            el = $(el);
            var elCood = position.cood(el);

            elCood.left = elCood.left + oldCood.left - oCood.left;
            elCood.top = elCood.top + oldCood.top - oCood.top;


            el.get(0)._elCood = elCood;


        })
        els.each(function (index, el) {

            dom.moveEl(el, el._elCood);


        })


        play.cmd = "select";


    }

    $(document).on("iframeload", function () {
        helper = drag.createHelper();
        helper.css("cursor", "move");
        drag.ondrag(play.iframeDoc, startDrag, ondrag, endDrag, play.iframeDoc);
    })


    $(document).on("iframeload", function () {


        //
        var timer;
        //left
        $([document, play.iframeDoc]).bind("keydown", "left", function (e) {


            if (!select.selectedEL)return;

            if (select.selectedEL && select.selectedEL.prop("contenteditable") == "true")return;
            e.preventDefault();

            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            timer = setTimeout(function () {
                var cood = position.cood(select.selectedEL);
                cood.left -= 1;

                position.cood(select.selectedEL, cood);
                select.selectEL(select.selectedEL)

            }, 10)


        })
        //right
        $([document, play.iframeDoc]).bind("keydown", "right", function (e) {


            if (!select.selectedEL)return;

            if (select.selectedEL && select.selectedEL.prop("contenteditable") == "true")return;
            e.preventDefault();

            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            timer = setTimeout(function () {
                var cood = position.cood(select.selectedEL);
                cood.left += 1;

                position.cood(select.selectedEL, cood);
                select.selectEL(select.selectedEL)

            }, 10)


        })
        //top
        $([document, play.iframeDoc]).bind("keydown", "up", function (e) {


            if (!select.selectedEL)return;

            if (select.selectedEL && select.selectedEL.prop("contenteditable") == "true")return;

            e.preventDefault();
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            timer = setTimeout(function () {
                var cood = position.cood(select.selectedEL);
                cood.top -= 1;

                position.cood(select.selectedEL, cood);
                select.selectEL(select.selectedEL)

            }, 10)


        })
        //bottom


        $([document, play.iframeDoc]).bind("keydown", "down", function (e) {


            if (!select.selectedEL)return;

            if (select.selectedEL && select.selectedEL.prop("contenteditable") == "true")return;
            e.preventDefault();

            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            timer = setTimeout(function () {
                var cood = position.cood(select.selectedEL);
                cood.top += 1;

                position.cood(select.selectedEL, cood);
                select.selectEL(select.selectedEL)

            }, 10)


        })

    })


})();