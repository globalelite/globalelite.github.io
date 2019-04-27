$ ($) ->
  loaded = ->
    $this = $(this)
    $div = $('<div>')
      .addClass('glitch-codrops-images')
      .css(
        width: "#{@width}px"
        height: "#{@height}px"
      )
      .insertBefore(this)
    for [0...5]
      $('<div>')
        .addClass('glitch-codrops-image')
        .css(
          backgroundImage: "url(#{@src})"
          backgroundSize: "#{@width}px #{@height}px"
        )
        .appendTo($div)
    $this.remove()
    return

  $('.splash').css('display', 'block')
  $('.splash img').each ->
    if @complete
      loaded.call(this)
    else
      $(this).on('load', loaded)
    return
  return
