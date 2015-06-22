var chalk     = require('chalk');
var fs        = require('fs');

var findFiles = require('./helpers/find-files');

var qunitTransforms = require('./formulas/qunit-transforms');
var prototypeExtensionTransforms = require('./formulas/prototype-extension-transforms');
var transformEmberDataModelLookups = require('./formulas/ember-data-model-lookup-transform');
var transformEmberDataAsyncFalseRelationships = require('./formulas/ember-data-async-false-relationships-transforms');


module.exports = EmberWatson;

function EmberWatson() { }

EmberWatson.prototype._transformEmberDataAsyncFalseRelationships = transformEmberDataAsyncFalseRelationships;

EmberWatson.prototype.transformEmberDataAsyncFalseRelationships = function(rootPath, dryRun, exclude) {
  var files = findFiles(rootPath, '.js', exclude);
  var checkName = "transformEmberDataAsyncFalseRelationships";
  var description = "Convert Ember Data relationship with implicit async: false to explicit option";

  transform(files, this._transformEmberDataAsyncFalseRelationships, checkName, description, dryRun);
};

EmberWatson.prototype._transformEmberDataModelLookups = transformEmberDataModelLookups;

EmberWatson.prototype.transformEmberDataModelLookups = function(rootPath, dryRun, exclude) {
  var files = findFiles(rootPath, '.js', exclude);
  var checkName = "transformEmberDataModelLookups";
  var description = "Convert Ember Data model lookups to use a dasherized string";

  transform(files, this._transformEmberDataModelLookups, checkName, description, dryRun);
};

EmberWatson.prototype._transformQUnitTest = qunitTransforms;

EmberWatson.prototype.transformQUnitTest = function(rootPath, dryRun, exclude) {
  var tests  = findFiles(rootPath, '.js').filter(function(file, exclude){
    return file.indexOf('-test.js') > 0;
  });
  var checkName = "transformQUnitTest";
  var description = "Fix QUnit tests to match 2.0 syntax";

  transform(tests, this._transformQUnitTest, checkName, description, dryRun);
};

EmberWatson.prototype._transformPrototypeExtensions = prototypeExtensionTransforms;

EmberWatson.prototype.transformPrototypeExtensions = function(rootPath, dryRun, exclude) {
  var files = findFiles(rootPath, '.js', exclude);
  var checkName = "transformPrototypeExtensions";
  var description = "Convert computed properties and observers to not use prototype extensions";

  transform(files, this._transformPrototypeExtensions, checkName, description, dryRun);
};

function transform(files, transformFormula, checkName, description, dryRun) {
  var wontFix = [];

  files.forEach(function(file) {
    var source = fs.readFileSync(file);
    try {
      var newSource = transformFormula(source);
      if (source != newSource) {
        if (dryRun){
          console.log("%j\0", {
            type: "Issue",
            check_name: checkName,
            description: description,
            categories: ["Style"],
            location: { 
              path: file, 
              lines: {begin: 1, end: 1}
            }
          })
        } else {
          console.log(chalk.green('Fixed: ', file));

          fs.writeFileSync(file, newSource);
        }
      }
    } catch (err) {
      wontFix.push(file);
    }
  }, this);

  if (wontFix.length > 0) {
    console.log(
      chalk.red('\n\nOh Dear! I wasn\'t able to save the following files:')
    );

    wontFix.forEach(function(file) {
      console.log(chalk.red(file));
    });

    console.log(chalk.red('\nA possible cause is having all the source code commented.'));
    console.log(chalk.red('If that\'s not the problem please fill a report with the hospital directors\nat https://github.com/abuiles/ember-watson/issues.\n\n'));
  }

  return true;
}
