/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
(function ($) {
  const typingTable = (function () {
    const table = { ん: ['ｎ'] };
    const gyous = {
      ｋ: 'かきくけこ',
      ｇ: 'がぎぐげご',
      ｓ: 'さしすせそ',
      ｚ: 'ざじずぜぞ',
      ｔ: 'たちつてと',
      ｄ: 'だぢづでど',
      ｎ: 'なにぬねの',
      ｈ: 'はひふへほ',
      ｂ: 'ばびぶべぼ',
      ｐ: 'ぱぴぷぺぽ',
      ｍ: 'まみむめも',
      ｙ: 'やゆよ',
      ｒ: 'らりるれろ',
      ｗ: 'わを',
    };
    const yoons = ['ゃ', 'ゅ', 'ょ'];
    for (let k1 in gyous) {
      const gyouChars = gyous[k1].split('');
      for (let k2 of gyouChars) {
        table[k2] = [k1, k2];
      }
      if (gyouChars.length === 5) {
        const ion = gyouChars[1];
        for (let yoon of yoons) {
          const ionYoon = `${ion}${yoon}`;
          table[ionYoon] = ion === 'じ' ? ['ｊ', ionYoon] : [k1, `${k1}ｙ`, ionYoon];
        }
      }
    }
    return table;
  })();

  const toTypings = function (text) {
    const ss = text.match(/.[ゃゅょ]|./g);
    const typings = [];
    let lastTyping = '';
    for (let index = 0; index < ss.length; index++) {
      const s = ss[index];
      const keys =
        s === 'っ' && typingTable[ss[index + 1]]
          ? [typingTable[ss[index + 1]][0]]
          : typingTable[s] || [s];
      for (let key of keys) {
        typings.push(`${lastTyping}${key}`);
      }
      lastTyping += s;
    }
    if (typings[typings.length - 1] !== lastTyping) {
      typings.push(lastTyping);
    }
    return typings;
  };

  const delay = (ms, fn, that) =>
    function () {
      if (fn) {
        setTimeout(function () {
          fn.call(that || this);
        }, ms || 0);
      }
    };

  const $newNode = function (options, name) {
    const tagName = options[`${name}TagName`];
    const className = options[`${name}ClassName`];
    return $(`<${tagName}>`).addClass(className);
  };

  const runInputAs = function (name, inputs, options, $base, updated, fn) {
    const $node = $newNode(options, 'input').addClass(options[`${name}ClassName`]).appendTo($base);
    var run = function (i) {
      if (!inputs[i]) {
        fn && fn();
        return;
      }

      const lastInput = inputs[i - 1] || '';
      const input = inputs[i];

      let prefix = '';
      for (let j = 0; j < input.length; j++) {
        const c = input[j];
        if (c !== lastInput[j]) {
          break;
        }
        prefix += c;
      }

      const typings = toTypings(input.slice(prefix.length)).map((t) => prefix + t);
      if (lastInput) {
        for (let n = prefix.length, end = lastInput.length; n <= end; n++) {
          typings.unshift(lastInput.slice(0, n));
        }
      }

      var update = function (k) {
        $node.text(typings[k]);
        updated && updated();
        if (typings[k + 1]) {
          delay(options.typeSpeed, function () {
            update(k + 1);
          })();
        } else {
          run(i + 1);
        }
      };

      delay(options.typeStartSpeed, function () {
        update(0);
      })();
    };
    run(0);
  };

  const runConvert = function (convsSet, options, $base, updated, fn) {
    $base.empty();
    for (let convs of convsSet) {
      $newNode(options, 'input').text(convs[0]).appendTo($base);
    }
    const $convs = $base.find(`>.${options.inputClassName}`);
    $convs.addClass(options.typingClassName);
    $convs.eq(0).addClass(options.convertClassName);
    updated && updated();
    var update = function (i, j) {
      if (convsSet[i][j]) {
        $convs.removeClass(options.convertClassName);
        $convs.eq(i).addClass(options.convertClassName).text(convsSet[i][j]);
        updated && updated();
        delay(options.convertSpeed, function () {
          update(i, j + 1);
        })();
        return;
      }
      for (let k = i + 1, end = convsSet.length; k < end; k++) {
        if (convsSet[k].length > 1) {
          delay(options.convertJumpSpeed, function () {
            update(i + 1, 0);
          })();
          return;
        }
      }
      fn && fn();
    };
    delay(options.convertJumpSpeed, function () {
      update(0, 1);
    })();
  };

  const runComplete = function (options, $base, updated) {
    $base
      .find(`>.${options.inputClassName}`)
      .removeClass(`${options.typingClassName} ${options.convertClassName}`);
    updated && updated();
  };

  var appendInputs = function (index, options, $caret, updated, comp) {
    if (!options.inputs[index]) {
      comp && comp();
      return;
    }

    const runComp = function () {
      runComplete(options, $base, updated);
      delay(options.typeStartSpeed, function () {
        appendInputs(index + 1, options, $caret, updated, comp);
      })();
    };
    var $base = $newNode(options, 'base').insertBefore($caret);

    if (Array.isArray(options.inputs[index][0])) {
      runInputAs('typing', options.inputs[index][0], options, $base, updated, function () {
        if (options.inputs[index][1]) {
          runConvert(
            options.inputs[index][1],
            options,
            $base,
            updated,
            delay(options.convertJumpSpeed, runComp)
          );
        } else {
          runComp();
        }
      });
    } else {
      runInputAs('input', options.inputs[index], options, $base, updated, runComp);
    }
  };

  const removeInputsBefore = function ($caret, options, updated, comp) {
    const caret = $caret[0];
    var removeFromLast = function (node, fn) {
      if (node.nodeType !== 3) {
        removeFromLast(node.lastChild, function () {
          if (!node.lastChild) {
            node.parentNode.removeChild(node);
          }
          updated && updated();
          fn && fn();
        });
        return;
      }

      var removeText = function (i) {
        if (i >= 0) {
          delay(options.removeSpeed, function () {
            node.nodeValue = node.nodeValue.slice(0, i);
            updated && updated();
            removeText(i - 1);
          })();
          return;
        } else {
          node.parentNode.removeChild(node);
          updated && updated();
          fn && fn();
          return;
        }
      };
      removeText(node.nodeValue.length - 1);
    };

    var removeAll = function () {
      if (caret.previousSibling) {
        removeFromLast(caret.previousSibling, removeAll);
      } else {
        comp && comp();
      }
    };
    removeAll();
  };

  const parseArguments = function (args, ...types) {
    const options = {};
    for (let arg of args) {
      if ($.isPlainObject(arg)) {
        $.extend(options, arg);
        break;
      }
      for (let i = 0; i < types.length; i++) {
        const [k, type] = types[i];
        if (($.isFunction(type) && type(arg)) || typeof arg === type) {
          options[k] = arg;
          types.splice(i, 1);
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
        ['inputs', Array.isArray],
        ['complete', $.isFunction],
        ['completeDelay', 'number']
      )
    );
    $.fn.jatyping.assertOptions(options);

    return this.each(function () {
      let comp, updated;
      const that = this;
      if (options.complete) {
        comp = delay(options.completeDelay, options.complete, that);
      }
      if (options.update) {
        updated = function () {
          options.update.call(that);
        };
      }
      let $caret = $(this).find(`>.${options.caretClassName}`);
      if (!$caret.length) {
        $caret = $newNode(options, 'caret').appendTo(this);
      }
      if (options.inputs) {
        appendInputs(0, options, $caret, updated, comp);
      } else {
        removeInputsBefore($caret, options, updated, comp);
      }
    });
  };

  $.fn.jatyping.assertOptions = function (options) {
    for (let k in this.defaults) {
      const v = this.defaults[k];
      if (!v || /[^a-z0-9_-]/i.test(v)) {
        throw new Error(`invalid options.${k}: ${v}`);
      }
    }
  };

  $.fn.jatyping.defaults = {
    baseTagName: 'span',
    baseClassName: 'jatyping',
    caretTagName: 'span',
    caretClassName: 'jatyping-caret',
    inputTagName: 'span',
    inputClassName: 'jatyping-input',
    typingClassName: 'jatyping-typing',
    convertClassName: 'jatyping-convert',
    removeSpeed: 25,
    typeSpeed: 80,
    typeStartSpeed: 150,
    convertSpeed: 150,
    convertJumpSpeed: 200,
  };
})(jQuery);
