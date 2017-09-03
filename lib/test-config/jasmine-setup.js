/* eslint-env browser */
/* eslint no-underscore-dangle: "off" */
/* eslint prefer-rest-params: "off" */
/* eslint prefer-spread: "off" */
/* eslint no-var: "off" */

window.__karma__.start = (function jasmineAdapter(originalStartJasmine) {
  return function startJasmine() {
    var originalArguments = [].slice.call(arguments);
    var originalOnLoadHandler = window.onload;

    window.onload = function handleOnLoad() {
      if (originalOnLoadHandler) {
        originalOnLoadHandler();
      }

      originalStartJasmine.apply(undefined, originalArguments);
    };
  };
})(window.__karma__.start);
