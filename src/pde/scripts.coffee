$ ($) ->
  $canvas = $('.art canvas')
  $textarea = $('.editor textarea')
  instance = null

  $('#btnRun').click ->
    instance?.exit()
    instance = new Processing($canvas[0], $textarea.val())
    false

  $('#btnPlay').click ->
    instance?.loop()
    false

  $('#btnStop').click ->
    instance?.noLoop()
    false

  $.get '../reboot.pde', (source) ->
    $textarea.val(source)
    $('#btnRun').click()
    return
  return
