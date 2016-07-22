'use strict';

const expect = require('expect.js');
const TokenGenerator = require('../');

describe('exports', function() {

  it('TokenGenerator should be exported', function() {
    expect(TokenGenerator).to.be.a('function');
  });

});

