import * as path from 'path';
import * as assert from 'assert';
import * as ttm from 'azure-pipelines-task-lib/mock-test';
import Utils from '../utils'


describe('Utility Padding tests', function () {

    before( function() {

    });

    after(() => {

    });

    it('should pad a number with zeros by the given parameters', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.PadLeft(1, 4);
        assert.strictEqual(test , '0001' , 'should have padded 1 into 0001');
        done();
    });

    it('should pad a number with zeros by the given parameters', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.PadLeft(23, 6);
        assert.strictEqual(test , '000023' , 'should have padded 23 into 000023');
        done();
    });
});

describe('Version Number Extraction tests', function () {

    before( function() {

    });

    after(() => {

    });

    it('should parse a 4 digit version number', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetVersionNumber('1.0.0.0');
        assert.strictEqual(test , '1.0.0.0' , 'should have parsed a 4 digit build number');
        done();
    });

    it('should parse a 3 digit version number', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetVersionNumber('1.0.0');
        assert.strictEqual(test , '1.0.0' , 'should have parsed a 3 digit build number');
        done();
    });
});

describe('Padding routines', function () {

    before( function() {

    });

    after(() => {

    });

    it('should LEFT pad a number to 3 digits', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.PadLeft(1, 3);
        assert.strictEqual(test , '001' , 'should have padded 1 to 001');
        done();
    });

    it('should LEFT pad a number to 2 digits', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.PadLeft(1, 2);
        assert.strictEqual(test , '01' , 'should have padded 1 to 01');
        done();
    });

    it('should LEFT pad a number to 1 digits', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.PadLeft(1, 1);
        assert.strictEqual(test , '1' , 'should have padded 1 to 1');
        done();
    });

    it('should LEFT pad a number to -1 digits', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.PadLeft(1, -1);
        assert.strictEqual(test , '1' , 'should have padded 1 to 1');
        done();
    });

});

describe('Combined Patch BuildNumbers tests', function () {

    before( function() {

    });

    after(() => {

    });

    it('should parse a 4 part version number into 3 part', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetCombinedPatchBuildNumbers('1.0.0.0');
        assert.strictEqual(test , '1.0.00000' , 'should have parsed a 4 digit build number');
        done();
    });

    it('should parse a 4 part version number into 3 part (1.2.3.4 => 1.2.03004)', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetCombinedPatchBuildNumbers('1.2.3.4');
        assert.strictEqual(test , '1.2.03004' , 'should have parsed a 4 digit build number');
        done();
    });

    it('should parse a 4 part version number with Alpha notation into 3 digit (1.2.3-alpha.1 => 1.2.03001) ', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetCombinedPatchBuildNumbers('1.2.3-alpha.1');
        assert.strictEqual(test , '1.2.03001' , 'should have parsed a 4 digit build number');
        done();
    });

    it('should parse a 4 part version number with Beta notation into 3 part (1.2.3-beta.1 => 1.2.03001) ', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetCombinedPatchBuildNumbers('1.2.3-beta.1');
        assert.strictEqual(test , '1.2.03001' , 'should have parsed a 4 digit build number');
        done();
    });

    it('should parse a 4 part version number with RC notation into 3 part (1.2.3-rc.1 => 1.2.03001)', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetCombinedPatchBuildNumbers('1.2.3-rc.1');
        assert.strictEqual(test , '1.2.03001' , 'should have parsed a 4 digit build number');
        done();
    });

    it('should parse a 4 part version number with alphanumeric notation into 3 part (1.2.3-ci.1 => 1.2.03001)', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetCombinedPatchBuildNumbers('1.2.3-ci.1');
        assert.strictEqual(test , '1.2.03001' , 'should have parsed a 4 digit build number');
        done();
    });

    
    it('should parse a 4 part version number into 3 part (1.2.3.4 => 1.2.03004) ', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetCombinedPatchBuildNumbers('1.2.3.4');
        assert.strictEqual(test , '1.2.03004' , 'should have parsed a 4 digit build number');
        done();
    });
    
    it('should parse a 3 part hyphenated version number into 3 part (1.2.3-4 => 1.2.03004)', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetCombinedPatchBuildNumbers('1.2.3-4');
        assert.strictEqual(test , '1.2.03004' , 'should have parsed a 4 digit build number');
        done();
    });

    it('should parse a 3 part hyphenated version number into 3 part (1.2.3-ci4 => 1.2.03004)', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetCombinedPatchBuildNumbers('1.2.3-ci4');
        assert.strictEqual(test , '1.2.03004' , 'should have parsed a 4 digit build number');
        done();
    });

    it('should parse a 3 part + delimeted version number into 3 part (1.2.3+4 => 1.2.03004)', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetCombinedPatchBuildNumbers('1.2.3+4');
        assert.strictEqual(test , '1.2.03004' , 'should have parsed a 4 digit build number');
        done();
    });

    it('should parse a 3 part + delimeted version number into 3 part (1.2.3+ci4 => 1.2.03004)', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetCombinedPatchBuildNumbers('1.2.3+ci4');
        assert.strictEqual(test , '1.2.03004' , 'should have parsed a 4 digit build number');
        done();
    });

});

describe('4 Digit Version number merging tests' , function() {

    before( function() {

    });

    after(() => {

    });

    it('should pad a number with zeros by the given parameters', function(done: Mocha.Done) {
        this.timeout(1000);
        let utils: Utils = new Utils(false);
        let test = utils.GetCombinedFourDigitVersionNumber(1, 2, 3, 4);
        assert.strictEqual(test , '1.2.03004' , 'should have merged into 1.2.03004');
        done();
    });
});