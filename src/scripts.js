/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
$(($) =>
  $('main>article').each(function () {
    const $this = $(this);
    const $dl = $this.find('dl');
    if (!$dl.length) {
      return;
    }
    const $h2 = $this.find('h2');
    $dl.prepend($('<dt>').text('タイトル'), $('<dd>').text($h2.text()));
    $h2.remove();
    $dl
      .find('dt')
      .filter(function () {
        return $(this).text() === '電子版';
      })
      .find('+dd>ul')
      .clone()
      .appendTo($this.find('figure'));
  })
);

$(function ($) {
  $('.splash').css('display', 'block');
  // setTimeout ->
  //   $('.splash p').removeClass('huge')
  //   return
  // , 500

  const child = function (node) {
    const $node = $(node);
    const $a = $node.find('a');
    if ($a.length) {
      return $a;
    } else {
      return $node;
    }
  };
  const $p = $('.splash p');
  $p.each(function () {
    child(this).html('&nbsp;');
  });
  $('.splash').css('display', 'block');

  const inputs = [
    [
      [['とうきょうが'], [['東京が']]],
      [['ちゅうしになって'], [['中止に'], ['なって']]],
      [['よんかげつ・・・・・・'], [['4ヶ月', '四ヶ月'], ['……']]],
    ],
    [
      [['おれたちは'], [['俺たちは']]],
      [['おおさかに'], [['大阪に']]],
      [['やってきた'], [['やってきた']]],
      [['で！'], [['で！']]],
    ],
    [['COVID-19', 'C-19']],
    [[['”おれたちはやすまない”'], [['“'], ['おれたちは'], ['休まない'], ['”']]]],
  ];
  var typing = function (i) {
    if (inputs[i]) {
      child($p.eq(i))
        .empty()
        .jatyping(inputs[i], function () {
          $(this).find('.jatyping-caret').css('visibility', 'hidden');
          typing(i + 1);
        });
    }
  };
  typing(0);
});
