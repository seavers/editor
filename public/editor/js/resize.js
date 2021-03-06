(function () {

    //画新元素

    var utils = play.utils,
        position = play.position,
        grid = play.grid,
        select = play.select,
        dom = play.dom,
        drag = play.drag,
        align = play.alignAuto,
        history = play.history;


    //resize

    var top, height, marginTop, el,
        sx, ex, sy, ey,
        target, resizeable, oCood, helper;

    var startDrag = function () {

        play.cmd = "resize";

        resizeable = select.selectedEL.prop("resizeable");

        target = select.selectedEL;

        oCood = play.select.cood;

        sx = oCood.left;
        sy = oCood.top;

        ex = oCood.right;
        ey = oCood.bottom;


    }
    var ondrag = function (startX, startY, endX, endY, starget) {

        if ($(starget).hasClass("h-top")) {
            sy = endY;
        }

        if ($(starget).hasClass("h-left")) {
            sx = endX;

            if ($(target).attr("data-align-x") == "center") {
                var dis = oCood.left - sx;
                ex = oCood.right + dis;

            }
        }

        if ($(starget).hasClass("h-right")) {
            ex = endX;
            if ($(target).attr("data-align-x") == "center") {
                var dis = ex - oCood.right;
                sx = oCood.left - dis;

            }
        }

        if ($(starget).hasClass("h-bottom")) {
            ey = endY;
        }

        var oldCood = position.toCood(sx, sy, ex, ey);




        var parent = position.getFullInParent(oldCood, play.iframeDoc);


        align.start(oldCood, parent, resizeable, target);

        var cood = align.cood;

        if (cood.x) {

            if (cood.x.position == 0) {
                if (ex < sx) {
                    ex = cood.x.value
                }
                else {
                    sx = cood.x.value
                }

            } else if (cood.x.position == 1) {


                if (ex > sx) {
                    ex = cood.x.value + (cood.x.value - sx)
                }
                else {
                    ex = cood.x.value - (sx - cood.x.value)
                }


            }
            else if (cood.x.position == 2) {
                if (ex < sx) {
                    sx = cood.x.value
                }
                else {
                    ex = cood.x.value
                }
            }
        }

        if (cood.y) {
            if (cood.y.position == 0) {

                if (ey < sy) {
                    ey = cood.y.value
                }
                else {
                    sy = cood.y.value
                }

            } else if (cood.y.position == 1) {
                if (ey > sy) {
                    ey = cood.y.value + (cood.y.value - sy)
                }
                else {
                    ey = cood.y.value - (sy - cood.y.value)
                }

            }
            else if (cood.y.position == 2) {
                if (ey < sy) {
                    sy = cood.y.value
                }
                else {
                    ey = cood.y.value
                }
            }

        }


        var oldCood = position.toCood(sx, sy, ex, ey);

        if (resizeable.axis == "x") {

            oldCood.top = oCood.top;
            oldCood.bottom = oCood.bottom;

        }
        if (resizeable.axis == "y") {
            oldCood.left = oCood.left;
            oldCood.right = oCood.right;
        }


        if (resizeable.containment) {

            var containCood = position.cood(resizeable.containment);


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


        ;

        //约束比例
        if (resizeable.constrain) {
            console.log("gogos")

            if (oCood.width !== oldCood.width) {


                var height = oldCood.width * (oCood.height / oCood.width);
                oldCood.height = height;



            }
            else if (oCood.height !== oldCood.height) {

                var width = oldCood.height * (oCood.width / oCood.height);
                oldCood.width = width;

            }


        }
        ;

        helper.position(oldCood)


        var parent = position.getFullInParent(oldCood, play.iframeDoc);

        select.selectParentEL(parent);

    }
    var endDrag = function (startX, startY, endX, endY) {

        helper.hide();
        align.stop();

        select.cancelHoverEL();
        select.unSelectParentEL();

        var cood = position.toCood(sx, sy, ex, ey);



        //约束比例
        if (resizeable.constrain) {
            console.log("gogos")

            if (oCood.width !== cood.width) {


                var height = cood.width * (oCood.height / oCood.width);
                cood.height = height;



            }
            else if (oCood.height !== cood.height) {

                var width = cood.height * (oCood.width / oCood.height);
                cood.width = width;

            }


        }
        ;


        var wp = cood.width / oCood.width;
        var hp = cood.height / oCood.height;


        var outerEl = [];
        var innerEl = [];


        select.selectedEL.filter(function (index) {
            var el = select.selectedEL.eq(index);
            var result = false;
            select.selectedEL.each(function (index, parent) {

                if ($(parent).find(el).length) {
                    result = true;
                }
            })

            if (result) {
                innerEl.push(el);
            }
            else {
                outerEl.push(el);
            }


        });

        innerEl = $(innerEl);
        outerEl = $(outerEl);


        outerEl.each(function (index, el) {
            el = $(el);
            var elCood = position.cood(el);

            elCood.left = (elCood.left - oCood.left) * wp + cood.left;
            elCood.top = (elCood.top - oCood.top) * hp + cood.top;
            elCood.width = (elCood.width ) * wp;
            elCood.height = (elCood.height ) * hp;

            //todo 嵌套时有问题

            el.get(0)._elCood = elCood;


        })
        outerEl.each(function (index, el) {
            el = $(el);
            console.log("reisze", el._elCood)

            dom.resizeEl(el, el.get(0)._elCood, resizeable);


        })
        innerEl.each(function (index, el) {
            el = $(el);

            var offsetCood = position.cood(el.parent());
            var elCood = position.cood(el);

            elCood.left = (elCood.left - offsetCood.left) * wp + offsetCood.left;
            elCood.top = (elCood.top - offsetCood.top) * hp + offsetCood.top;
            elCood.width = (elCood.width ) * wp;
            elCood.height = (elCood.height ) * hp;

            //todo 嵌套时有问题

            el.get(0)._elCood = elCood;


        })
        innerEl.each(function (index, el) {
            el = $(el);
            console.log("reisze", el._elCood)

            dom.resizeEl(el, el.get(0)._elCood, {treeModify: false});


        })


        play.cmd = "select";


    }

    $(document).on("iframeload", function () {

        helper = drag.createHelper();
        helper.css("cursor", "resize");

        drag.ondrag($(".handle"), startDrag, ondrag, endDrag, play.iframeDoc);

    })


})();