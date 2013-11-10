(function () {
    var utils = play.utils,
        position = play.position,
        select = play.select,
        dom = play.dom;


    var shortcutbar = $('<div class="shortcutbar" ><div class="btn-group"></div>' +

        '</div>');


    shortcutbar.css({
        maxWidth: 700
    })


    shortcutbar.add = function (cmds) {
        cmds = cmds || []

        var groups = shortcutbar.find(".btn-group");


        var cmdsEl = groups;
        for (var i = 0; i < cmds.length; i++) {
            var cmd = cmds[i];

            var name = cmd.name;
            var cmdType = cmd.type;
            var desc = cmd.desc;
            var func = cmd.func;

            if (!cmdType || cmdType == "button") {
                desc = cmd.icon || desc;

                var cmdEl = $('<a   data-name="' + name + '">' + desc + '</a>');
                cmdsEl.append(cmdEl);
                cmdEl.on("click", cmds[i].func);

            }
            else if (cmdType == "input") {

                var value = cmd.value;
                var cmdEl = $('<input  type="text" style="float:left;width: 60px" placeholder="' + name + '" data-name="' + name + '"/>');
                var btn = $("<span></span>")

                cmdsEl.append(cmdEl);
                cmdEl.on("keyup", cmds[i].func);


            }


        }


    }

    shortcutbar.css({
        "position": "absolute",
        top: 0,
        left: 0,
        zIndex: 10000
    })

    shortcutbar.hide();

    shortcutbar.reflow = function (target) {

        var target = target || select.selectedEL;

        var cood = position.cood(target);

        var top = cood.top - shortcutbar.height() ;

        if (top < 0) {
            top = cood.top + cood.height ;
        }
        if (top < 0) {
            top = 0;
        }
        cood.top = top;
        if (cood.left < 0) {
            cood.left = 0
        }

        position.offset(shortcutbar, cood);

    }


    shortcutbar.iframeInit = function () {
        var iframeDoc = play.iframeDoc;
        $(shortcutbar).appendTo($(play.container));

        $(shortcutbar).on("click", function(ev){
            ev.stopPropagation();

        })


        $(document).on("selectEl", function (ev, target) {

            if(play.select.selectedEL.length>1){
                shortcutbar.hide();
                return;
            }

            var groups = shortcutbar.find(".btn-group");
            groups.html("");

            shortcutbar.show();


            function command(ev) {

                var parent = play.select.selectedEL;
                while((parent = parent.parent()).length){
                    console.log(parent.get(0))

                    if(play.select.isSelectable(parent)){
                        break;
                    }
                }
                if(parent&&parent.length)play.select.selectEL(parent);

            }


            var cmds = [
                {name: "P", icon: '<i class="fa fa-angle-up fa-1"></i>', desc: "选择父元素", func: command}


            ]
            shortcutbar.add(cmds);


            var remove = function () {
                dom.removeEl(play.select.selectedEL)

            }


            shortcutbar.add(target.prop("cmds"));


            shortcutbar.reflow(target);


        })
        $(iframeDoc).on("unselect", function (ev) {
            var target = $(ev.target);
            shortcutbar.hide();

        })

        $(document).on("resizeEl moveEl cssChange", function (ev, el) {
            shortcutbar.reflow();
        })


        $(play.iframeWin).on("resize scroll", function (e, cmd) {
            shortcutbar.reflow();
        });

        $(document).on("removeEl", function (ev, el) {
            shortcutbar.hide();
        })




    };


    $(document).on("iframeload", function () {
        shortcutbar.iframeInit();
    })


    play.shortcutbar = shortcutbar;


})();