(function () {

    var utils = play.utils,
        select = play.select,
        position = play.position,
        dom = play.dom;

    function filter() {

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

        return {innerEl: innerEl, outerEl: outerEl}
    }

    var left = function () {


        utils.XSort(select.selectedEL);

        var base = select.selectedEL.eq(0);
        var baseCood = position.cood(base);

        var result = filter();
        select.selectedEL.each(function (index, el) {

            el = $(el);


            var oCood = position.cood(el);

            var cood = {
                left: baseCood.left,
                top: oCood.top,
                width: oCood.width,
                height: oCood.height

            }
            el.get(0)._elCood = cood;


        })


        result.outerEl.each(function (index, el) {
            el = $(el);
            if (el.is(base))return;

            position.cood(el, el.get(0)._elCood)

        })


        result.innerEl.each(function (index, el) {
            el = $(el);


            position.cood(el, el.get(0)._elCood, {treeModify: false})


        })


        select.reflow();

    }

    var center = function () {
        var baseCood = position.getAllCood(select.selectedEL);
        var result = filter();

        var c = baseCood.left + baseCood.width / 2;

        select.selectedEL.each(function (index, el) {

            el = $(el);


            var oCood = position.cood(el);

            var cood = {
                left: c - oCood.width / 2,
                top: oCood.top,
                width: oCood.width,
                height: oCood.height

            }
            el.get(0)._elCood = cood;


        })
        result.outerEl.each(function (index, el) {
            el = $(el);


            position.cood(el, el.get(0)._elCood)

        })


        result.innerEl.each(function (index, el) {
            el = $(el);


            position.cood(el, el.get(0)._elCood, {treeModify: false})


        })
        select.reflow();


    }


    var right = function () {

        var baseCood = position.getAllCood(select.selectedEL);


        var r = baseCood.right;

        var result = filter();
        select.selectedEL.each(function (index, el) {

            el = $(el);


            var oCood = position.cood(el);

            var cood = {
                left: r - oCood.width,
                top: oCood.top,
                width: oCood.width,
                height: oCood.height

            }
            el.get(0)._elCood = cood;


        })


        result.outerEl.each(function (index, el) {
            el = $(el);


            position.cood(el, el.get(0)._elCood)

        })


        result.innerEl.each(function (index, el) {
            el = $(el);


            position.cood(el, el.get(0)._elCood, {treeModify: false})


        })


        select.reflow();

    }
    var top = function (target) {

        utils.YSort(select.selectedEL);
        var base = select.selectedEL.eq(0);
        var baseCood = position.cood(base);

        var result = filter();
        select.selectedEL.each(function (index, el) {

            el = $(el);


            var oCood = position.cood(el);

            var cood = {
                left: oCood.left,
                top: baseCood.top,
                width: oCood.width,
                height: oCood.height

            }
            el.get(0)._elCood = cood;


        })


        result.outerEl.each(function (index, el) {
            el = $(el);
            if (el.is(base))return;

            position.cood(el, el.get(0)._elCood)

        })


        result.innerEl.each(function (index, el) {
            el = $(el);


            position.cood(el, el.get(0)._elCood, {treeModify: false})


        })


        select.reflow();

    }
    var middle = function () {
        var baseCood = position.getAllCood(select.selectedEL);
        var result = filter();

        var m = baseCood.top + baseCood.height / 2;

        select.selectedEL.each(function (index, el) {

            el = $(el);


            var oCood = position.cood(el);

            var cood = {
                left: oCood.left,
                top: m - oCood.height/2,
                width: oCood.width,
                height: oCood.height

            }
            el.get(0)._elCood = cood;


        })
        result.outerEl.each(function (index, el) {
            el = $(el);


            position.cood(el, el.get(0)._elCood)

        })


        result.innerEl.each(function (index, el) {
            el = $(el);


            position.cood(el, el.get(0)._elCood, {treeModify: false})


        })
        select.reflow();


    }

    var bottom = function (target) {

        var baseCood = position.getAllCood(select.selectedEL);

        var b = baseCood.bottom;

        var result = filter();
        select.selectedEL.each(function (index, el) {

            el = $(el);


            var oCood = position.cood(el);

            var cood = {
                left: oCood.left,
                top: b - oCood.height,
                width: oCood.width,
                height: oCood.height

            }
            el.get(0)._elCood = cood;


        })


        result.outerEl.each(function (index, el) {
            el = $(el);


            position.cood(el, el.get(0)._elCood)

        })


        result.innerEl.each(function (index, el) {
            el = $(el);


            position.cood(el, el.get(0)._elCood, {treeModify: false})


        })


        select.reflow();

    }


    play.align = {

        left: left,
        center: center,
        right: right,
        top: top,
        bottom: bottom

    }


})();