/*
 * GET home page.
 */

var db = require("../db"),
    Site = db.Site,
    Page = db.Page;


exports.createSite = function (req, res) {
    var site = new db.Site();
    site.title = req.param("title");
    site.author = 'admin';	//from cookie //req.param("author");
    site.html = req.param("html");
    site.save(function () {
        res.json({ success: true });
    })
};

exports.updateSite = function (req, res) {
    var site = new db.Site();

    var id = req.param("id");
    var html = req.param("html");
    site.update({"_id": id}, {"html":html}, function () {
        res.json({ success: true });
    })
};

exports.publish = function (req, res) {
    var site = new db.Site();

    var id = req.param("id");
    site.update({"_id": id}, {"status":"1"}, function () {
        res.json({ success: true });
    })
};

exports.list = function (req, res) {
    var site = new db.Site();

    site.find({"status": "1"}).toArray(function (err, result) {
        res.json({ success: true, result: result });
    })
};

/*
exports.removeSite = function (req, res) {
    var site = new db.Site();
    site.title = req.param("title")
    site.author = req.param("author");
    site.save(function () {
        res.json({ success: true });
    })
};
*/

exports.createPage = function (req, res) {
    var siteid = req.param("siteid");
    var title = req.param("title");
    var doc = req.param("doc");

    var site = Site.findById(siteid);

    var newPage = new Page();
    newPage.title = title;
    newPage.doc = doc;
    site.pages.push(newPage);


    site.save(function () {
        res.json({ success: true });
    })
};

exports.updatePage = function (req, res) {
    var siteid = req.param("siteid");
    var pageid = req.param("pageid");
    var title = req.param("title");
    var doc = req.param("doc");

    var site = Site.findById(siteid);

    var page = site.pages.id(pageid);


    page.title = title;
    page.doc = doc;


    site.save(function () {
        res.json({ success: true });
    })
};


exports.removePage = function (req, res) {
    var id = req.param("id");
    var siteid = req.param("siteid");
    var pageid = req.param("pageid");


    var site = Site.findById(siteid);

    var page = site.pages.id(pageid);

    page.remove({ _id: id }, function (err) {
        res.json({ success: true });
    });


};





