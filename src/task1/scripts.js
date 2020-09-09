$(($) => {
  const loaded = function () {
    const $this = $(this);
    const $div = $('<div>')
      .addClass('glitch-codrops-images')
      .css({
        width: `${this.width}px`,
        height: `${this.height}px`,
      })
      .insertBefore(this);
    for (let i = 0; i < 5; i += 1) {
      $('<div>')
        .addClass('glitch-codrops-image')
        .css({
          backgroundImage: `url(${this.src})`,
          backgroundSize: `${this.width}px ${this.height}px`,
        })
        .appendTo($div);
    }
    $this.remove();
  };

  $('.splash').css('display', 'block');
  $('.splash img').each(function () {
    if (this.complete) {
      loaded.call(this);
    } else {
      $(this).on('load', loaded);
    }
  });
});
