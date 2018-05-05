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
