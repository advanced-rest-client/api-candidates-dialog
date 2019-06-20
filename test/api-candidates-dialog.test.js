import { fixture, assert, nextFrame, aTimeout } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import '../api-candidates-dialog.js';

[
  '../node_modules/web-animations-js/web-animations-next.min.js'
].forEach((src) => {
  const s = document.createElement('script');
  s.src = src;
  document.head.appendChild(s);
});

describe('<api-candidates-dialog>', function() {
  async function basicFixture() {
    return (await fixture(`<api-candidates-dialog></api-candidates-dialog>`));
  }

  describe('_renderOpened()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls cancelAnimation()', () => {
      const stub = sinon.stub(element, 'cancelAnimation');
      element._renderOpened();
      assert.isTrue(stub.called);
    });

    it('Calls playAnimation()', () => {
      const stub = sinon.stub(element, 'playAnimation');
      element._renderOpened();
      assert.isTrue(stub.called);
    });

    it('playAnimation() is called with "entry" argument', () => {
      const stub = sinon.stub(element, 'playAnimation');
      element._renderOpened();
      assert.equal(stub.args[0][0], 'entry');
    });
  });

  describe('_renderClosed()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls cancelAnimation()', () => {
      const stub = sinon.stub(element, 'cancelAnimation');
      element._renderClosed();
      assert.isTrue(stub.called);
    });

    it('Calls playAnimation()', () => {
      const stub = sinon.stub(element, 'playAnimation');
      element._renderClosed();
      assert.isTrue(stub.called);
    });

    it('playAnimation() is called with "entry" argument', () => {
      const stub = sinon.stub(element, 'playAnimation');
      element._renderClosed();
      assert.equal(stub.args[0][0], 'exit');
    });
  });

  describe('_onNeonAnimationFinish()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Calls _finishRenderOpened() when opened', () => {
      const stub = sinon.stub(element, '_finishRenderOpened');
      element.opened = true;
      element._onNeonAnimationFinish();
      assert.isTrue(stub.called);
    });

    it('Calls _finishRenderClosed() when not opened', () => {
      const stub = sinon.stub(element, '_finishRenderClosed');
      element._onNeonAnimationFinish();
      assert.isTrue(stub.called);
    });
  });

  describe('_computeHasSelection()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Returns false when no argument', () => {
      const result = element._computeHasSelection();
      assert.isFalse(result);
    });

    it('Returns true when has an argument', () => {
      const result = element._computeHasSelection('test');
      assert.isTrue(result);
    });
  });

  describe('_selectHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    function dispatch() {
      const e = new CustomEvent('api-select-entrypoint', {
        bubbles: true,
        cancelable: true,
        detail: {
          candidates: ['a', 'b', 'c']
        }
      });
      document.body.dispatchEvent(e);
      return e;
    }

    it('Does nothing when event is canceled', () => {
      document.body.addEventListener('api-select-entrypoint', function f(e) {
        document.body.removeEventListener('api-select-entrypoint', f);
        e.preventDefault();
      });
      const e = dispatch();
      assert.isUndefined(e.detail.result);
    });

    it('Cancels the event', () => {
      const e = dispatch();
      assert.isTrue(e.defaultPrevented);
    });

    it('Clears the selection', () => {
      element.selected = 'test';
      dispatch();
      assert.isUndefined(element.selected);
    });

    it('Sets the candidates', () => {
      const e = dispatch();
      assert.deepEqual(element.candidates, e.detail.candidates);
    });

    it('Opens the dialog', () => {
      dispatch();
      assert.isTrue(element.opened);
    });

    it('Sets promise on the detail object', () => {
      const e = dispatch();
      assert.typeOf(e.detail.result.then, 'function');
    });

    it('Sets _lastResolve property', () => {
      dispatch();
      assert.typeOf(element._lastResolve, 'function');
    });

    it('Sets _lastReject property', () => {
      dispatch();
      assert.typeOf(element._lastReject, 'function');
    });
  });

  describe('_clearPromises()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element._lastResolve = () => {};
      element._lastReject = () => {};
    });

    it('Clears _lastResolve', () => {
      element._clearPromises();
      assert.isUndefined(element._lastResolve);
    });

    it('Clears _lastReject', () => {
      element._clearPromises();
      assert.isUndefined(element._lastReject);
    });
  });

  describe('_acceptSelection()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.opened = true;
    });

    it('Closes the dialog', () => {
      element._acceptSelection();
      assert.isFalse(element.opened);
    });
  });

  describe('_closeHandler()', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      element.candidates = ['a', 'b', 'c'];
      element.opened = true;
      await nextFrame();
    });

    it('Does nothing when no promise', () => {
      element._closeHandler();
      // no error
    });

    it('Rejects when canceled', (done) => {
      let resolveCalled = false;
      let rejectCalled = false;
      const resolve = () => resolveCalled = true;
      const reject = () => rejectCalled = true;
      element._lastReject = reject;
      element._lastResolve = resolve;
      element.close();
      setTimeout(() => {
        assert.isTrue(rejectCalled);
        assert.isFalse(resolveCalled);
        done();
      }, 60);
    });

    it('Rejects when no selection', () => {
      let resolveCalled = false;
      let rejectCalled = false;
      const resolve = () => resolveCalled = true;
      const reject = () => rejectCalled = true;
      element._lastReject = reject;
      element._lastResolve = resolve;
      element._closeHandler({
        detail: {
          canceled: false
        }
      });
      assert.isTrue(rejectCalled);
      assert.isFalse(resolveCalled);
    });

    it('Resolves when has selection', () => {
      let resolveCalled = false;
      let rejectCalled = false;
      const resolve = () => resolveCalled = true;
      const reject = () => rejectCalled = true;
      element._lastReject = reject;
      element._lastResolve = resolve;
      element.selected = 'a';
      element._closeHandler({
        detail: {
          canceled: false
        }
      });
      assert.isTrue(resolveCalled);
      assert.isFalse(rejectCalled);
    });

    it('Resolved function has selection', () => {
      let param;
      const resolve = (arg) => param = arg;
      const reject = () => {};
      element._lastReject = reject;
      element._lastResolve = resolve;
      element.selected = 'a';
      element._closeHandler({
        detail: {
          canceled: false
        }
      });
      assert.equal(param, 'a');
    });

    it('Clears promise when resolves', () => {
      element._lastReject = () => {};
      element._lastResolve = () => {};
      element.selected = 'a';
      element._closeHandler({
        detail: {
          canceled: false
        }
      });
      assert.isUndefined(element._lastResolve);
      assert.isUndefined(element._lastReject);
    });

    it('Clears promise when rejects', () => {
      element._lastReject = () => {};
      element._lastResolve = () => {};
      element.selected = 'a';
      element._closeHandler({
        detail: {
          canceled: false
        }
      });
      assert.isUndefined(element._lastResolve);
      assert.isUndefined(element._lastReject);
    });
  });
});
