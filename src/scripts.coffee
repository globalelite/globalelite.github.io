$ ($) ->
  $('main>article').each ->
    $this = $(this)
    $dl = $this.find('dl')
    return unless $dl.length
    $h2 = $this.find('h2')
    $dl.prepend(
      $('<dt>').text('タイトル')
      $('<dd>').text($h2.text())
    )
    $h2.remove()
    $dl.find('dt').filter(-> $(this).text() == '電子版').find('+dd>ul').clone().appendTo($this.find('figure'))
    return

$ ($) ->
  $('.splash').css('display', 'block')
  # setTimeout ->
  #   $('.splash p').removeClass('huge')
  #   return
  # , 500

  # child = (node) ->
  #   $node = $(node)
  #   $a = $node.find('a')
  #   if $a.length then $a else $node
  # $p = $('.splash p')
  # $p.each ->
  #   child(this).html('&nbsp;')
  #   return
  # $('.splash').css('display', 'block')

  # inputs = [
  #   [
  #     [
  #       ['われわれは']
  #       [
  #         ['我々は']
  #       ]
  #     ]
  #     [
  #       ['ふたつのせいちょうをする']
  #       [
  #         ['二つの']
  #         ['成長を']
  #         ['刷る', 'する']
  #       ]
  #     ]
  #   ]
  #   [
  #     [
  #       ['ぶんがくふりま', 'ぶんふり']
  #       [
  #         ['文フリ']
  #       ]
  #     ]
  #     [
  #       ['とうきょう']
  #       [
  #         ['東京']
  #       ]
  #     ]
  #     [' ']
  #     [
  #       ['す']
  #       [
  #         ['ス']
  #       ]
  #     ]
  #     ['-46']
  #   ]
  #   [
  #     ['TASK ']
  #     [
  #       ['れいわじだい']
  #       [
  #         ['礼和', '例話', '例羽', '令和']
  #         ['時代']
  #       ]
  #     ]
  #   ]
  #   [
  #     [
  #       ['”おれたちはやすまない”']
  #       [
  #         ['“']
  #         ['おれたちは']
  #         ['休まない']
  #         ['”']
  #       ]
  #     ]
  #   ]
  # ]
  # typing = (i) ->
  #   if inputs[i]
  #     child($p.eq(i)).empty().jatyping(
  #       inputs[i]
  #       ->
  #         $(this).find('.jatyping-caret').css('visibility', 'hidden')
  #         typing(i + 1)
  #         return
  #     )
  #   return
  # typing(0)
  return
