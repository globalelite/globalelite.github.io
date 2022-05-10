(function ($) {
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

  const loaded = (img) => {
    const $img = $(img);
    const $div = $('<div>')
      .addClass('glitch-img')
      .css({
        width: `${img.width}px`,
        height: `${img.height}px`,
      })
      .insertBefore(img);
    for (let i = 0; i < 5; i += 1) {
      $('<div>')
        .addClass('glitch-img-layer')
        .css({
          backgroundImage: `url(${img.src})`,
          backgroundSize: `${img.width}px ${img.height}px`,
        })
        .appendTo($div);
    }
    $(window).on('resize', () => {
      $div.css({
        width: `${img.width}px`,
        height: `${img.height}px`,
      });
      $div.find('.glitch-img-layer').css({
        backgroundSize: `${img.width}px ${img.height}px`,
      });
    });
  };

  $.fn.glitch = function () {
    const options = $.extend({}, $.fn.glitch.defaults, parseArguments(arguments));
    $.fn.glitch.assertOptions(options);

    return this.each(function () {
      $(this).css({ position: 'absolute', top: '0', left: '-9999px' });

      if (this.complete) {
        loaded(this);
      } else {
        $(this).on('load', function () {
          loaded(this);
        });
      }
    });
  };

  $.fn.glitch.assertOptions = function (options) {
    for (let k in options) {
      const v = options[k];
      const dv = this.defaults[k];
      if (dv && typeof v !== typeof dv) {
        throw new Error(`invalid options.${k}: ${v}`);
      }
    }
  };

  $.fn.glitch.defaults = {
    placeholderTagName: 'span',
    placeholderClassName: 'glitch-img',
  };
})(jQuery);
