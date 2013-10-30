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

            position.cood(el, cood)


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
    var right = function (target) {
        var base = select.selectedEL.eq(0);
        var baseCood = position.cood(base);

        var result = filter();
        select.selectedEL.each(function (index, el) {

            el = $(el);


            var oCood = position.cood(el);

            var cood = {
                left: baseCood.right - oCood.width,
                top: oCood.top,
                width: oCood.width,
                height: oCood.height

            }
            el.get(0)._elCood = cood;

            position.cood(el, cood)


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
    var top = function (target) {
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

            position.cood(el, cood)


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
    var bottom = function (target) {
        var base = select.selectedEL.eq(0);
        var baseCood = position.cood(base);

        var result = filter();
        select.selectedEL.each(function (index, el) {

            el = $(el);


            var oCood = position.cood(el);

            var cood = {
                left: oCood.left,
                top: baseCood.bottom - oCood.height,
                width: oCood.width,
                height: oCood.height

            }
            el.get(0)._elCood = cood;

            position.cood(el, cood)


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


    play.align = {

        left: left,
        right: right,
        top: top,
        bottom: bottom

    }


})();