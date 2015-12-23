'use strict';

var Watson = require('../../index');
var watson = new Watson();

module.exports = {
  name: 'watson:all',
  description: 'Performs all available Watson commands on a project.',
  works: 'insideProject',
  availableOptions: [
    { name: 'app-path', type: String, description: 'Path to app directory.', default: 'app' },
    { name: 'tests-path', type: String, description: 'Path to tests directory.', default: 'tests' },
    { name: 'router-path', type: String, description: 'Path to router file.', default: 'app/router.js' },
    { name: 'output', type: String, description: 'Output format: pretty or json.', default: 'pretty' },
    { name: 'acceptance-path', type: String, description: 'Path to acceptance tests directory.', default: 'tests/acceptance' },
    { name: 'controllers-path', type: String, description: 'Path to controllers directory.', default: 'app/controllers' },
    { name: 'dry-run', type: Boolean, description: 'Run the command in dry-run mode (outputs JSON, non-destructive)', default: false }
  ],
  run: function(commandOptions, rawArgs) {
    watson.transformQUnitTest(commandOptions.appPath, commandOptions.dryRun);
    watson.transformPrototypeExtensions(commandOptions.appPath, commandOptions.dryRun);
    watson.transformEmberDataModelLookups(commandOptions.appPath, commandOptions.dryRun);
    watson.transformEmberDataAsyncFalseRelationships(commandOptions.appPath, commandOptions.dryRun);
    watson.transformResourceRouterMapping(commandOptions.routerPath, commandOptions.dryRun);
    watson.transformMethodify(commandOptions.appPath, commandOptions.dryRun);
    watson.findOverloadedCPs(commandOptions.appPath, commandOptions.dryRun).outputSummary(commandOptions.output);
    watson.transformTestToUseDestroyApp(commandOptions.acceptancePath, commandOptions.dryRun);
    watson.replaceNeedsWithInjection(commandOptions.controllersPath, commandOptions.dryRun);
  }
};
