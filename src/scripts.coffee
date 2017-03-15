$ ($) ->
  $('main article').each ->
    $this = $(this)
    $dl = $this.find('dl')
    return unless $dl.length
    $h2 = $this.find('h2')
    $dl.prepend(
      $('<dt>').text('タイトル')
      $('<dd>').text($h2.text())
    )
    $h2.remove()
    $dl.find('dt').filter(-> $(this).text() == '電子版').each ->
      $this.find('figure').append($(this).next('dd').find('ul').clone())
      return
    return

$ ($) ->
  return unless window.Audio
  $('.bgm').show()
  $bgmActionIcon = $('.bgm>.bgm-action>i.fa').attr('class', 'fa fa-play')
  audio = $('audio')[0]
  audio.addEventListener 'play', ->
    $bgmActionIcon.attr('class', 'fa fa-pause')
    return
  audio.addEventListener 'pause', ->
    $bgmActionIcon.attr('class', 'fa fa-play')
    return
  window.runBgm = ->
    audio[if audio.paused then 'play' else 'pause']()
    return
  audio.autoplay = true

  return unless window.AudioContext
  audioCtx = new AudioContext
  analyser = audioCtx.createAnalyser()
  analyser.fftSize = 32
  analyser.connect(audioCtx.destination)
  source = audioCtx.createMediaElementSource(audio)
  source.connect(analyser)

  $header = $('.splash h2')
  $span = $header.wrapInner('<span>').find('span')

  render = ->
    spectrums = new Uint8Array(analyser.frequencyBinCount)
    analyser.getByteFrequencyData(spectrums)
    $span.css('fontSize', '')
    maxSize = $header.width() / $span.width() - 0.2
    if maxSize > 1
      ratio = Math.pow(2, 1 / (spectrums.length - 1))
      baseVol = 1
      maxVol = 0
      vol = 0
      for sp in spectrums
        vol += (sp / 255) * baseVol
        maxVol += baseVol
        baseVol *= ratio
      baseSize = 1
      size = (maxSize - baseSize) * vol / maxVol * 1.2 + baseSize
      $span.css('fontSize', "#{size * 100}%")
    requestAnimationFrame(render)
    return

  requestAnimationFrame(render)
  return

$('html').addClass('js')
