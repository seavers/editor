(function () {

    var utils = play.utils,
        position = play.position,
        dom = play.dom;


    var tmpl = '' +
        '<div class="select-mask">' +
        '<div class="s-top side"></div>' +
        '<div class="s-left side"></div>' +
        '<div class="s-right side"></div>' +
        '<div class="s-bottom side"></div>' +
        '<div class="h-top handle"></div>' +
        '<div class="h-bottom handle"></div>' +
        '<div class="h-left handle"></div>' +
        '<div class="h-right handle"></div>' +
        '</div>';
    var selectMask = {

        create: function () {
            var mask = $(tmpl);

            mask.appendTo($("#editor"));


            mask.css({
                position: "absolute",
                left: 0,
                top: 0,
                width: 0,
                height: 0
            })

            mask.hide();

            mask.selectCood = function (cood, isResizable) {


                var
                    t = mask.find(".s-top") ,
                    l = mask.find(".s-left") ,
                    r = mask.find(".s-right") ,
                    b = mask.find(".s-bottom"),
                    top = mask.find(".h-top") ,
                    left = mask.find(".h-left") ,
                    right = mask.find(".h-right") ,
                    bottom = mask.find(".h-bottom");


                mask.show();

                mask.find(".side").show();

                var w = 1;
                //句柄

                var w2 = 8;


                position.cood(t, {
                    left: cood.left - w,
                    top: cood.top - w,
                    width: cood.width + w * 2,
                    height: w

                });


                position.cood(l, {
                    left: cood.left - w,
                    top: cood.top - w,
                    width: w,
                    height: cood.height + w * 2
                });
                position.cood(r, {
                    left: cood.width + cood.left,
                    top: cood.top - w,
                    width: w,
                    height: cood.height + w * 2
                });

                position.cood(b, {
                    left: cood.left - w,
                    top: cood.height + cood.top,
                    width: cood.width + w * 2,
                    height: w
                });

                if (isResizable) {

                    mask.find(".handle").show();
                    position.cood(top, {
                        left: cood.left + cood.width / 2 - w2 / 2,
                        top: cood.top - (w2 + w) / 2,
                        height: w2,
                        width: w2


                    })
                    position.cood(bottom, {
                        left: cood.left + cood.width / 2 - w2 / 2,
                        top: cood.height + cood.top + w - (w2) / 2,
                        height: w2,
                        width: w2
                    })
                    position.cood(left, {
                        left: cood.left - (w2 + w) / 2,
                        top: cood.top + cood.height / 2 - w2 / 2,
                        height: w2,
                        width: w2
                    })
                    position.cood(right, {
                        left: cood.left + cood.width + w - w2 / 2,
                        top: cood.top + cood.height / 2 - w2 / 2,
                        height: w2,
                        width: w2
                    })
                }
                else{
                    mask.find(".handle").hide();
                }



            }
            mask.select = function (el) {

                var target = play.select.selectedEL;
                if (!target)return;


                var resize = target.filter(function (index, el) {
                    return $(el).prop("resizeable")

                })


                if (target.length == 1) {

                    var cood = play.select.cood = position.cood(target);
                    mask.selectCood(cood, resize.length);
                }
                else if (target.length > 1) {

                    var cood = play.select.cood = position.getAllCood(target);
                    mask.selectCood(cood, resize.length);
                }


            }


            return mask;
        }



    }


    play.selectMask = selectMask;


})();