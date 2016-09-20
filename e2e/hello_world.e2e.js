import { expect } from 'chai';
import testUtils from './utils';

describe('application launch', function () {

    beforeEach(testUtils.beforeEach);
    afterEach(testUtils.afterEach);

    it('contains the test content values hidden on screen after launch', function () {
        return this.app.client.getText('#e2eTestContent').then(function (text) {
            console.log("Got text ", text);
            console.log("Assert text ", testUtils.constants.testContentValues);
            expect(text).to.equal(testUtils.constants.testContentValues);
        });
    });
});
