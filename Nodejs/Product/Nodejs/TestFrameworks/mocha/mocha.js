"use strict";
var EOL = require('os').EOL;
var fs = require('fs');
var path = require('path');

// Choose 'tap' rather than 'min' or 'xunit'. The reason is that
// 'min' produces undisplayable text to stdout and stderr under piped/redirect,
// and 'xunit' does not print the stack trace from the test.
var defaultMochaOptions = { ui: 'tdd', reporter: 'tap', timeout: 2000 };

var find_tests = function (testFileList, discoverResultFile, projectFolder) {
    var Mocha = detectMocha(projectFolder);
    if (!Mocha) {
        return;
    }

    function getTestList(suite, testFile) {
        if (suite) {
            if (suite.tests && suite.tests.length !== 0) {
                suite.tests.forEach(function (t, i, testArray) {
                    testList.push({
                        test: t.fullTitle(),
                        suite: suite.fullTitle(),
                        file: testFile,
                        line: 0,
                        column: 0
                    });
                });
            }

            if (suite.suites) {
                suite.suites.forEach(function (s, i, suiteArray) {
                    getTestList(s, testFile);
                });
            }
        }
    }
    var testList = [];
    testFileList.split(';').forEach(function (testFile) {
        var mocha = initializeMocha(Mocha, projectFolder);
        process.chdir(path.dirname(testFile));

        try {
            mocha.addFile(testFile);
            mocha.loadFiles();
            getTestList(mocha.suite, testFile);
        } catch (e) {
            //we would like continue discover other files, so swallow, log and continue;
            logError("Test discovery error:", e, "in", testFile);
        }
    });

    var fd = fs.openSync(discoverResultFile, 'w');
    fs.writeSync(fd, JSON.stringify(testList));
    fs.closeSync(fd);
};
module.exports.find_tests = find_tests;

var run_tests = function (testName, testFile, workingFolder, projectFolder) {
    var Mocha = detectMocha(projectFolder);
    if (!Mocha) {
        return;
    }

    var mocha = initializeMocha(Mocha, projectFolder);

    if (testName) {
        if (typeof mocha.fgrep === 'function')
            mocha.fgrep(testName); // since Mocha 3.0.0
        else
            mocha.grep(testName); // prior Mocha 3.0.0
    }
    mocha.addFile(testFile);

    mocha.run(function (code) {
        process.exit(code);
    });
};

function logError() {
    var errorArgs = Array.prototype.slice.call(arguments);
    errorArgs.unshift("NTVS_ERROR:");
    console.error.apply(console, errorArgs);
}

// cache mocha module to avoid resolving it all the time
var _mochaModule = null;

function detectMocha(projectFolder) {
    if (!_mochaModule) {
        // perform require look up on working directory and up the tree
        var cd = projectFolder + "/." // adds /. to make loop easier on edge case;
        var mochaModule = null;
        do {
            // get parent
            cd = path.dirname(cd);
            var mochaPath = path.join(cd, 'node_modules', 'mocha');
            if (fs.existsSync(mochaPath)) {
                try {
                    mochaModule = require(mochaPath);
                    break; // we found mocha
                } catch (ex) {
                    // ignore, not found
                }
            }
        } while (cd != path.dirname(cd)); // stop when cd is root

        if (!mochaModule) {
            // if not found, try global
            try {
                mochaModule = require("mocha");
            } catch (ex) {
                // ignore, not found
            }
        }

        if (mochaModule) {
            _mochaModule = mochaModule;
        } else {
            logError("Failed to find Mocha package.  Mocha must be installed either in the project locally, in a parent node_modules folder or globably.  Mocha can be installed locally with the npm manager via solution explorer or with \".npm install mocha\" via the Node.js interactive window.");
        }
    }

    return _mochaModule;
}

function initializeMocha(Mocha, projectFolder) {
    var mocha = new Mocha();
    applyMochaOptions(mocha, getMochaOptions(projectFolder));
    return mocha;
}

function applyMochaOptions(mocha, options) {
    if (options) {
        for (var opt in options) {
            var mochaOpt = mocha[opt];
            var optValue = options[opt];

            if (typeof mochaOpt === 'function') {
                try {
                    mochaOpt.call(mocha, optValue);
                } catch (e) {
                    console.log("Could not set mocha option '" + opt + "' with value '" + optValue + "' due to error:", e);
                }
            }
        }
    }
}

function getMochaOptions(projectFolder) {
    var mochaOptions = defaultMochaOptions;
    try {
        var optionsPath = path.join(projectFolder, 'test', 'mocha.json');
        var options = require(optionsPath) || {};
        for (var opt in options) {
            mochaOptions[opt] = options[opt];
        }
        console.log("Found mocha.json file. Using Mocha settings: ", mochaOptions);
    } catch (ex) {
        console.log("Using default Mocha settings");
    }

    // set timeout to 10 minutes, because the default of 2 sec is too short for debugging scenarios
    if (typeof (v8debug) === 'object') {
        mochaOptions['timeout'] = 600000;
    }

    return mochaOptions;
}

module.exports.run_tests = run_tests;
