$(($) => {
  const $typing = $('.splash-contents-text [data-jatyping]').html('&nbsp;');
  $('.splash').css('display', 'block');
  if ($typing.length) $('.splash-contents-text').jatyping();
});
