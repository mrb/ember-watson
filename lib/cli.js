'use strict';

var program = require('commander');
var Watson = require('./watson');
var watson = new Watson();
var version = require('../package.json').version;

program
  .version(version);

program
  .command('upgrade-qunit-tests [testsPath]')
  .description('Fix QUnit tests to match 2.0 syntax. testsPath defaults to tests/')
  .option('--dry-run', 'Don\'t modify files, output JSON info instead.')
  .action(function(testsPath, options){
    testsPath = testsPath || 'tests';
    watson.transformQUnitTest(testsPath, options.dryRun);
  });

program
  .command('convert-prototype-extensions [appPath]')
  .description('Convert computed properties and observers to not use prototype extensions. appPath defaults to app/')
  .option('--dry-run', 'Don\'t modify files, output JSON info instead.')
  .action(function(appPath, options){
    appPath = appPath || 'app';
    watson.transformPrototypeExtensions(appPath, options.dryRun);
  });

program
  .command('convert-ember-data-model-lookups [appPath]')
  .description('convert Ember Data model lookups to use a dasherized string')
  .option('--dry-run', 'Don\'t modify files, output JSON info instead.')
  .action(function(appPath, options) {
    appPath = appPath || 'app';
    watson.transformEmberDataModelLookups(appPath, options.dryRun);
  });

program
  .command('convert-ember-data-async-false-relationships [appPath]')
  .description('convert Ember Data relationship with implicit async: false to explicit option')
  .option('--dry-run', 'Don\'t modify files, output JSON info instead.')
  .action(function(appPath, options) {
    appPath = appPath || 'app';
    watson.transformEmberDataAsyncFalseRelationships(appPath, options.dryRun);
  });

program
  .command('convert-resource-router-mapping [routerPath]')
  .description('convert the resource router mapping to use the route mapping with the new resetNamespace option')
  .option('--dry-run', 'Don\'t modify files, output JSON info instead.')
  .action(function(routerPath, options) {
    routerPath = routerPath || 'app/router.js';
    watson.transformResourceRouterMapping(routerPath, options.dryRun);
  });

program
  .command('methodify [path]')
  .description('Convert methods to new ES6 syntax')
  .option('--dry-run', 'Don\'t modify files, output JSON info instead.')
  .action(function(path, options) {
    path = path || 'app';
    watson.transformMethodify(path, options.dryRun);
  });

program
  .command('find-overloaded-cps [path]')
  .option('-j, --json', 'Output in JSON instead of pretty print.')
  .description('This lists all the places that will trigger the "Using the same function as getter and setter" deprecation.')
  .option('--dry-run', 'Don\'t modify files, output JSON info instead.')
  .action(function(path, options) {
    path = path || 'app';
    watson.findOverloadedCPs(path, options.dryRun).outputSummary(options.json ? 'json' : 'pretty');
  });

program
  .command('use-destroy-app-helper [path]')
  .description('Use destroy-app helper after acceptance tests.')
  .option('--dry-run', 'Don\'t modify files, output JSON info instead.')
  .action(function(path, options) {
    path = path || 'tests/acceptance';
    watson.transformTestToUseDestroyApp(path, options.dryRun);
  });

program
  .command('replace-needs-with-injection [path]')
  .description('Replace needs with controller injection.')
  .option('--dry-run', 'Don\'t modify files, output JSON info instead.')
  .action(function(path, options) {
    path = path || 'app/controllers';
    watson.replaceNeedsWithInjection(path, options.dryRun);
  });

program
  .command('all')
  .option('--tests-path [path]', 'Path to tests directory.', 'tests')
  .option('--app-path [path]', 'Path to app directory.', 'app')
  .option('--router-path [path]', 'Path to router file.', 'app/router.js')
  .option('--acceptance-path [path]', 'Path to acceptance tests directory.', 'tests/acceptance')
  .option('--controllers-path [path]', 'Path to controllers directory.', 'app/controllers')
  .option('--output [format]', 'Output format: pretty or json.', 'pretty')
  .option('--dry-run', 'Don\'t modify files, output JSON info instead.')
  .description('Run all commands.')
  .action(function(options) {
    watson.transformQUnitTest(options.testsPath, options.dryRun);
    watson.transformPrototypeExtensions(options.appPath, options.dryRun);
    watson.transformEmberDataModelLookups(options.appPath, options.dryRun);
    watson.transformEmberDataAsyncFalseRelationships(options.appPath, options.dryRun);
    watson.transformResourceRouterMapping(options.routerPath, options.dryRun);
    watson.transformMethodify(options.appPath, options.dryRun);
    watson.findOverloadedCPs(options.appPath, options.dryRun).outputSummary(options.output);
    watson.transformTestToUseDestroyApp(options.acceptancePath, options.dryRun);
    watson.replaceNeedsWithInjection(options.controllersPath, options.dryRun);
  });

module.exports = function init(args) {
  program.parse(args);
};
