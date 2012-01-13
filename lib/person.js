/**
 * @name: person
 * @author: maple
 */
var db = require('./db.js');

var person = function() {};
person.prototype = new db.oop();
person.prototype.construction = person;

exports.oop = person;