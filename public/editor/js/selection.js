(function () {

    var utils = play.utils,
        position = play.position,
        dom = play.dom,
        selectedEL = null, //当前选择的元素
        parentEL ,
        init = false,


        container = $(play.container),


        selectMask ,
        parentMask,
        hoverMask,
        isHover = true;


    var select = {


        isSelectable: function (el) {


            var tagName = el.prop("tagName");

            if (!tagName) return false;
            //  var isRegisted = iframeWin.webc.registry[tagName.toLowerCase()];
            var isEditable = el.prop("editable");
            var isMoveable = el.prop("moveable");
            var resizeable = el.prop("resizeable");
            var selectable = el.prop("selectable");

            return (selectable||isEditable || isMoveable || resizeable);

        },
        getSelectableEl: function (el, s) {
            var el = $(el);


            while (el.length) {
                if (this.isSelectable(el)) {
                    break;
                }
                else {
                    el = el.parent();
                }
            }


            if (!el.get(0) || !el.get(0).tagName || el.get(0).tagName.toLowerCase() == "body" || el.get(0).tagName.toLowerCase() == "html") {

                if (s) {
                    select.cancelSelectEL();
                }

                return;
            }

            return el;
        },
        selectedEL: selectedEL,
        _selectEL: function (el) {

            $("[data-moveable]", play.iframeDoc).removeAttr("data-moveable");


            var el = this.getSelectableEl(el, true);
            if (!(el && el.length))return;


            select.selectedEL = $(el);
            select.cancelHoverEL();
            selectMask.select(el);


            return $(el);


        },

        selectEL: function (el) {
            var old = this.selectedEL;

            select.selectedEL = $(el);

            if(!old)old = $('');
            if (!old.filter(el).length) {

                selectMask.select($(el));
                $(document).trigger("selectEl", [el])
                $(document).trigger("unSelectEl", [old])


            }
            else {
                $(document).trigger("selectEl", [el])
                $(document).trigger("reSelectEl", [el])
            }


        },
        addEl: function (el) {
            if (!this.selectedEL) this.selectedEL = [];

            var old = this.selectedEL;
            if (!old.filter(el).length) {
                //避免重复
                this.selectedEL.push($(el).get(0));
                selectMask.select();
                $(document).trigger("selectEl", [el])
            }
            else {
              //  $(document).trigger("selectEl", [el])
               // $(document).trigger("reSelectEl", [el])
            }


        },

        selectedElDecoration: selectMask,
        reflow: function () {
            if (select.selectedEL) {
                selectMask.select(select.selectedEL);
                $(document).trigger("selectReflow", [select.selectedEL])
            }

        },


        cancelSelectEL: function () {

            select.selectedEL && select.selectedEL.removeAttr("data-moveable")


            $(select.selectedEL).trigger("unselect")


            // 移动的过程，其实并没有重新选择元素，但是要remove元素，导致无法重新 选择
            // 不再重新设置，使用select.reflow();
            select.selectedEL = $("");
            selectMask.hide();
            // select.selectedEL = null;
        },

        selectParentEL: function (el) {


            //  var el = this.getSelectableEl(el);
            if (!(el && el.length)) {
                this.unSelectParentEL()
                return;
            }


            if (el.is(select.selectedEL)) {
                return;
            }
            parentEL = el;

            $(parentMask).show();
            position.cood(parentMask, position.cood(parentEL))


        },
        unSelectParentEL: function () {

            parentMask.hide();

        },

        //hover元素
        hoverEL: function (el) {

            if (!isHover)return;
            var el = this.getSelectableEl(el);


            if (!(el && el.length)) {
                this.cancelHoverEL();
                return;
            }

            if (el.is(select.selectedEL))return;


            hoverMask.select(el);


        },
        stopHover: function () {
            isHover = false;
            $(hoverMask).hide();
        },
        startHover: function () {
            isHover = true;
        },
        cancelHoverEL: function () {
            $(hoverMask).hide();
        },
        nomove: function () {

        },
        move: function () {

        },
        selectMask: selectMask

    }

    $(document).on("webcReady", function () {
        select.selectMask = selectMask = play.selectMask.create();


        hoverMask = play.selectMask.create();


        hoverMask.addClass("hover-mask");
        parentMask = $('<div class="parent-mask"></div>');
        parentMask.appendTo($(play.container));


    })


    $(document).on("iframeload", function () {

        var iframeDoc = play.iframeDoc;

        //hover选择
        var timer;
        $(iframeDoc).on("mouseover", function (ev) {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }

            timer = setTimeout(function () {
                if (ev.target == iframeDoc.body || ev.target == iframeDoc.documentElement) {
                    select.cancelHoverEL();
                    return;
                }

                select.hoverEL($(ev.target))

            }, 10)


        });

        //选择元素
        $(iframeDoc).on("click", function (e) {

            //todo 当拖动时，鼠标被其它元素当住可阻止出发 click;
            //如果是拖动事件就忽略

            if (play._clickType === "drag") {

                return;
            }
            var old = select.selectedEL;


            var el = select.getSelectableEl($(e.target), true);


            if (el && el.length && e.shiftKey) {

                if (!old.filter(el).length) {
                    //避免重复
                    select.addEl(el);
                }


            }
            else if (el && el.length) {
                select.selectEL(el);


            }
            else {
                select.cancelSelectEL();
                $(document).trigger("unSelectEl", [old])
            }


            select.cancelHoverEL();


        });
        //选择


        //选择父元素成为当前元素


        $(iframeDoc).on("resize scroll", function () {
            var el = select.selectedEL;
            if (el && el.length) {
                select.selectEL(el);
                select.cancelHoverEL();
            }

        })

        $([iframeDoc, iframeDoc.body]).on("scroll", function () {
            var el = select.selectedEL;
            if (el && el.length) {
                select.selectEL(el);
                select.cancelHoverEL();
            }

        })


        //取消选择
        select.cancelSelectEL();
        select.cancelHoverEL();


    })


    $(document).on("cmd", function (e, cmd) {
        if (cmd.indexOf("draw") != -1) {
            select.cancelSelectEL();

            select.selectedEL = null;
            select.cancelHoverEL();
        }
    })

    $(document).on("addNewEl", function (ev, el) {

        select.selectEL(el);
    })
    $(document).on("removeEl", function (ev, el) {
        select.cancelSelectEL();
        select.cancelHoverEL();
    })
    $(document).on("resizeEl moveEl cssChange", function (ev, el) {
        select.reflow();
    })


    $(play.iframeWin).on("resize scroll", function (e, cmd) {
        select.reflow();
    });

    $("#editor-wrap").click(function (ev) {
        var target = $(ev.target);
        if (!target.closest("#editor").length) {
            select.cancelSelectEL();
            select.cancelHoverEL();
        }

    })
    $("#editor-wrap").mouseover(function (ev) {
        var target = $(ev.target);
        if (!target.closest("#editor").length) {

            select.cancelHoverEL();
        }

    })


    play.select = select;


})();