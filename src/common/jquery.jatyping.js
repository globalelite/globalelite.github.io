(function ($) {
  const { remove, addToElement, add } = require('./jatyping.ts');

  const delay = (ms, fn, that) => () => {
    if (fn) {
      setTimeout(function () {
        fn.call(that || this);
      }, ms || 0);
    }
  };

  const parseArguments = (args, ...typeTests) => {
    const options = {};
    for (let i = 0; i < args.length; i += 1) {
      const arg = args[i];
      if ($.isPlainObject(arg)) {
        $.extend(options, arg);
        break;
      }
      for (let j = 0; j < typeTests.length; j += 1) {
        const [k, typeTest] = typeTests[j];
        if ((typeof typeTest === 'function' && typeTest(arg)) || typeof arg === typeTest) {
          options[k] = arg;
          typeTests.splice(j, 1);
          break;
        }
      }
    }
    return options;
  };

  $.fn.jatyping = function () {
    const options = $.extend(
      {},
      $.fn.jatyping.defaults,
      parseArguments(
        arguments,
        ['patterns', Array.isArray],
        ['complete', 'function'],
        ['completeDelay', 'number'],
      ),
    );
    $.fn.jatyping.assertOptions(options);

    return this.each(function () {
      const onFinish = delay(options.completeDelay, options.complete, this);
      const onTyping = options.update
        ? () => {
            options.update.call(this);
          }
        : undefined;
      const opts = {
        ...options,
        onTyping,
        onFinish,
      };

      if (options.patterns) {
        addToElement(this, options.patterns, opts);
      } else if ($(this).find(`[${options.patternsAttribute}]`).length) {
        add(this, {
          ...opts,
          patternsAttributeName: options.patternsAttribute,
        });
      } else {
        remove(this, opts);
      }
    });
  };

  $.fn.jatyping.assertOptions = function (options) {
    for (let k in options) {
      const v = options[k];
      const dv = this.defaults[k];
      if (dv && typeof v !== typeof dv) {
        throw new Error(`invalid options.${k}: ${v}`);
      }
    }
  };

  $.fn.jatyping.defaults = {
    patternsAttribute: 'data-jatyping',
    caretTagName: 'span',
    caretClassName: 'jatyping-caret',
    removeCaret: true,
    inputTagName: 'span',
    inputClassName: 'jatyping-input',
    inputTypingClassName: 'jatyping-typing',
    inputConvertClassName: 'jatyping-convert',
    speed: 12.5,
    delay: 150,
    convertSpeed: 6,
    convertDelay: 150,
    removeSpeed: 40,
    removeDelay: 150,
  };
})(jQuery);
