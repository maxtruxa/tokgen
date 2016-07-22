'use strict';

const crypto = require('crypto');
const expect = require('expect.js');
const sinon = require('sinon');
const TokenGenerator = require('../../lib/token-generator');

describe('TokenGenerator', function() {

  it('should be exported', function() {
    expect(TokenGenerator).to.be.a('function');
  });

  describe('constructor', function() {

    it('should be default constructible', function() {
      const CHARS = '0123456789' +
        'abcdefghijklmnopqrstuvwxyz' +
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      let generator = new TokenGenerator();
      let options = generator._options;
      expect(options).to.have.property('chars');
      expect(options.chars).to.eql(CHARS.split(''));
      expect(options).to.have.property('length', 32);
    });

    it('should set chars from options', function() {
      let generator = new TokenGenerator({chars: 'abc'});
      let options = generator._options;
      expect(options).to.have.property('chars');
      expect(options.chars).to.eql(['a', 'b', 'c']);
    });

    it('should set length from options', function() {
      let generator = new TokenGenerator({length: 8});
      let options = generator._options;
      expect(options).to.have.property('length', 8);
    });

    it('should throw if chars is not a string', function() {
      let wrapper = () => { new TokenGenerator({chars: {}}); };
      expect(wrapper).to.throwError((err) => {
        expect(err).to.be.a(TypeError);
      });
    });

    it('should throw if length is not a number', function() {
      let wrapper = () => { new TokenGenerator({length: {}}); };
      expect(wrapper).to.throwError((err) => {
        expect(err).to.be.a(TypeError);
      });
    });

    it('should use options as chars if it is a string', function() {
      let generator = new TokenGenerator('abc');
      let options = generator._options;
      expect(options).to.have.property('chars');
      expect(options.chars).to.eql(['a', 'b', 'c']);
    });

    it('should use options as length if it is a number', function() {
      let generator = new TokenGenerator(16);
      let options = generator._options;
      expect(options).to.have.property('length', 16);
    });

  });

  describe('#generate', function() {

    let realRandomBytes = crypto.randomBytes;

    afterEach('restore crypto.randomBytes', () => {
      crypto.randomBytes = realRandomBytes;
    });

    it('should throw if length is not a number', function() {
      let generator = new TokenGenerator();
      let wrapper = () => { generator.generate({}); };
      expect(wrapper).to.throwError((err) => {
        expect(err).to.be.a(TypeError);
      });
    });

    it('should throw if callback is not a function', function() {
      let generator = new TokenGenerator();
      let wrapper = () => { generator.generate(1, {}); };
      expect(wrapper).to.throwError((err) => {
        expect(err).to.be.a(TypeError);
      });
    });

    it('should return default number of random bytes', function() {
      let buffer = new Buffer([0, 1, 2, 3, 4, 5, 6, 7]);
      let stub = sinon.stub().returns(buffer);
      crypto.randomBytes = stub;

      let generator = new TokenGenerator(8);
      let token = generator.generate();
      expect(stub.calledOnce).to.be.ok();
      expect(stub.calledWith(8)).to.be.ok();
      expect(token).to.have.length(8);
    });

    it('should return default number of random bytes (async)', function(done) {
      let buffer = new Buffer([0, 1, 2, 3, 4, 5, 6, 7]);
      let stub = sinon.stub().callsArgWithAsync(1, null, buffer);
      crypto.randomBytes = stub;

      let generator = new TokenGenerator(8);
      generator.generate((error, token) => {
        try {
          expect(stub.calledOnce).to.be.ok();
          expect(stub.calledWith(8)).to.be.ok();
          expect(error).to.equal(null);
          expect(token).to.have.length(8);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('should return explicit number of random bytes', function() {
      let buffer = new Buffer([0, 1, 2, 3, 4, 5, 6, 7]);
      let stub = sinon.stub().returns(buffer);
      crypto.randomBytes = stub;

      let generator = new TokenGenerator();
      let token = generator.generate(8);
      expect(stub.calledOnce).to.be.ok();
      expect(stub.calledWith(8)).to.be.ok();
      expect(token).to.have.length(8);
    });

    it('should return explicit number of random bytes (async)', function(done) {
      let buffer = new Buffer([0, 1, 2, 3, 4, 5, 6, 7]);
      let stub = sinon.stub().callsArgWithAsync(1, null, buffer);
      crypto.randomBytes = stub;

      let generator = new TokenGenerator();
      generator.generate(8, (error, token) => {
        try {
          expect(stub.calledOnce).to.be.ok();
          expect(stub.calledWith(8)).to.be.ok();
          expect(error).to.equal(null);
          expect(token).to.have.length(8);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

    it('should return error from crypto.randomBytes (async)', function(done) {
      let error = new Error('oops');
      let stub = sinon.stub().callsArgWithAsync(1, error);
      crypto.randomBytes = stub;

      let generator = new TokenGenerator();
      generator.generate(8, (error, token) => {
        try {
          expect(stub.calledOnce).to.be.ok();
          expect(stub.calledWith(8)).to.be.ok();
          expect(error).to.equal(error);
          expect(token).to.equal(undefined);
          done();
        } catch (err) {
          done(err);
        }
      });
    });

  });

});

