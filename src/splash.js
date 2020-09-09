$(($) => {
  const $ps = $('.splash-contents-text [data-jatyping-inputs]');
  $ps.html('&nbsp;');
  $('.splash').css('display', 'block');

  const typing = (i) => {
    const p = $ps.eq(i);
    if (p) {
      const $p = $(p);
      $p.empty().jatyping($p.data('jatyping-inputs'), function () {
        $(this).find('.jatyping-caret').css('visibility', 'hidden');
        typing(i + 1);
      });
    }
  };
  typing(0);
});
