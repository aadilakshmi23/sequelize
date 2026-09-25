module.exports = {
     reporters: [
          'default',
          [
               'jest-html-reporter',
               {
                    pageTitle: 'API Test Assertion Report',
                    outputPath: 'reports/test-summary.html',
                    includeFailureMsg: true,     // Captures custom logs on failure
                    includeConsoleLog: true,     // Captures requests/responses printed to console
               },
          ],
     ],
}