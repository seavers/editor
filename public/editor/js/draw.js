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


    var helper,
        el,
        state,
        oldCood,
        parent;


    var onstart = function (sx, sy, target) {


        if (play.cmd.indexOf("draw") != -1 && $(target).prop("parentable")) {

            state = 1;
        }
        else {
            state = 0;
        }


        //select.cancelSelectEL();


    }
    var ondrag = function (startX, startY, endX, endY, target) {

        if (state !== 1)return;


        oldCood = position.toCood(startX, startY, endX, endY);
        parent = position.getFullInParent(oldCood);
        align.start(oldCood, parent);

        var cood = align.cood;

        if (cood.x) {
            if (cood.x.position == 0) {
                if (endX < startX) {
                    endX = cood.x.value
                }
                else {
                    startX = cood.x.value
                }

            } else if (cood.x.position == 1) {


                if (endX > startX) {
                    endX = cood.x.value + (cood.x.value - startX)
                }
                else {
                    endX = cood.x.value - (startX - cood.x.value)
                }


            }
            else if (cood.x.position == 2) {
                if (endX < startX) {
                    startX = cood.x.value
                }
                else {
                    endX = cood.x.value
                }
            }
        }

        if (cood.y) {
            if (cood.y.position == 0) {

                if (endY < startY) {
                    endY = cood.y.value
                }
                else {
                    startY = cood.y.value
                }

            } else if (cood.y.position == 1) {
                if (endY > startY) {
                    endY = cood.y.value + (cood.y.value - startY)
                }
                else {
                    endY = cood.y.value - (startY - cood.y.value)
                }

            }
            else if (cood.y.position == 2) {
                if (endY < startY) {
                    startY = cood.y.value
                }
                else {
                    endY = cood.y.value
                }
            }

        }


        oldCood = position.toCood(startX, startY, endX, endY);

        helper.position(oldCood);

        var parent = position.getFullInParent(oldCood, play.iframeDoc);


        select.selectParentEL(parent);


    }
    var onend = function (startX, startY, endX, endY, target) {


        if (state !== 1)return;
        align.stop();
        helper.hide();
        if (oldCood.width < 8)return;
        if (oldCood.height < 8)return;


        dom.addNewEl(oldCood,parent);

        select.unSelectParentEL();

        // nomm支持连续画
         play.cmd = "select";


    }


    $(document).on("iframeload", function () {
        helper = drag.createHelper();
        drag.ondraw(play.iframeDoc.body, onstart, ondrag, onend, play.iframeDoc);
        // 支持连续画
        $(document).on("click", function () {
            console.log("mousedown")
            if (play._clickType === "drag") {

                return;
            }
            // play.cmd = "select";
        })

        $(play.iframeDoc).on("click", function () {
            if (play._clickType === "drag") {
                console.log("play._clickType", play._clickType)

                return;
            }
            play.cmd = "select";
        })

        $(document).on("cmd", function (e, value) {
            console.log("cmd")
            var target = $(e.target);
            if (value == "draw") {
                var tagName = target.attr("data-tagname");
                var is = target.attr("data-is");
                play.cmdArgs = {tagName: tagName, is: is}

            }


        })

    });


})();