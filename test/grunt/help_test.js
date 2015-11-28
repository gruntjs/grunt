'use strict';

var help = require('../../lib/grunt/help');

exports.help = {
  'help.initWidths': function(test) {
    test.expect(1);
    help.initCol1('SimpleString');
    help.initWidths();
    test.equal(help.widths[3] >= 0, true, 'should always be over or equal to 0');
    test.done();
  },
  'help.initCol1': function(test) {
    test.expect(2);
    test.throws(function() { help.initCol1('thisTaskDoesNothingMoreThanTakeALotOfPlaceItsTakeMoreThanOneHundredCharactersItsJustForTheTestAndTestLimitCaseForHelpOption'); }, 'should alert for the task length limit');
    test.doesNotThrow(function() { help.initCol1('SimpleString'); }, 'should not alert for the task length limit');
    test.done();
  },
};
