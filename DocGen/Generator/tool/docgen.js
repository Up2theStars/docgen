
var rsvp = require('rsvp');
var fs = require('fs');
var cheerio = require('cheerio');
var marked = require('marked');

var child_process = require("child_process");

/**
* DocGen class
*/

function DocGen (options)
{

    var options = options;
    var parameters;
    var tableOfContents;

    this.pages = [];

    this.loadTemplate = function () {
        fs.readFile('Resources/template.html', 'utf8', function (err, template) {
          if (err) {
            return console.log(err);
          }
          $ = cheerio.load(template);
          console.log($('title').text());
        });
    };

    this.writeFiles = function () {

    }

    this.callExternal = function () {
        var child = child_process.exec('ls', function (error, stdout, stderr) {
            console.log(stdout);
        });
    }

    var loadJSON = function (path) {
        return new rsvp.Promise(function (resolve, reject) {
            fs.readFile (path, 'utf8', function (error, data) {
                if (error) {
                    reject(error);
                }
                try{
                    //todo - validate json against a schema
                    var result = JSON.parse(data);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });
    };

    var loadMarkdown = function (path) {
        return new rsvp.Promise(function (resolve, reject) {
            fs.readFile (path, 'utf8', function (error, data) {
                if (error) {
                    reject(error);
                }
                try{
                    var result = marked(data);
                    resolve(result);
                } catch (error) {
                    reject(error);
                }
            });
        });

/*
        this.table_of_contents.forEach( function (section) {
            section.links.forEach( function (page) {
                
                fs.readFile(page.url, {encoding: 'utf-8'}, function (err, data) {
                    if (!err) {
                        console.log(marked(data));
                    } else {
                        console.log(err);
                    }
                });

            }, this);
        }, this);
*/
    }

    this.run = function () {

        //this.loadTemplate();
        //this.loadConfig();
        //this.loadPages();
        //this.callExternal();
        //this.writeFiles();

        loadJSON('src/parameters.json').then(function (parameters) {
            console.log(parameters);
            return loadJSON('src/contents.json');
        }).then(function (contents) {
            console.log(contents);
            return loadMarkdown('src/index.txt');
        }).then(function (markdown) {
            console.log(markdown);
        }).catch(function (error) {
            console.log(error);
        });
    }
}

module.exports = DocGen;
