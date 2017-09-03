/* eslint-env browser */
/* eslint no-underscore-dangle: "off", prefer-spread: "off", prefer-rest-params: "off" */

window.__karma__.start = (function jasmineAdapter(originalStartJasmine) {
  return function startJasmine() {
    const originalArguments = [].slice.call(arguments);
    const originalOnLoadHandler = window.onload;

    window.onload = function handleOnLoad() {
      if (originalOnLoadHandler) {
        originalOnLoadHandler();
      }

      originalStartJasmine.apply(undefined, originalArguments);
    };
  };
})(window.__karma__.start);
