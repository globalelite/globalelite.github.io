do ->
  $window = $(window)
  $document = $(document)
  $h1 = $('h1')

  fitFontSize = ($target, maxWidth, maxHeight) ->
    fontSize = 10
    $sizer = $target
      .clone()
      .css(
        fontSize: fontSize + 'px'
        color: 'transparent'
        whiteSpace: 'nowrap'
        position: 'absolute'
        top: '-999px'
        left: '-999px'
      ).insertAfter($target)
    sizerWidth = $sizer.outerWidth()
    sizerHeight = $sizer.outerHeight()
    while sizerWidth < maxWidth && sizerHeight < maxHeight
      fontSize *= if sizerWidth < maxWidth then maxWidth / sizerWidth else maxHeight / sizerHeight
      $sizer.css('fontSize', fontSize + 'px')
      sizerWidth = $sizer.outerWidth()
      sizerHeight = $sizer.outerHeight()
    while sizerWidth >= maxWidth || sizerHeight >= maxHeight
      fontSize -= Math.min((fontSize * (1 - (if sizerWidth >= maxWidth then maxWidth / sizerWidth else maxHeight / sizerHeight))) || 1, 1)
      $sizer.css('fontSize', fontSize + 'px')
      sizerWidth = $sizer.outerWidth()
      sizerHeight = $sizer.outerHeight()
    $sizer.remove()
    $target.css('fontSize', fontSize + 'px')
    $target.css(
      marginTop: (-$target.outerHeight() / 2) + 'px'
      marginLeft: (-$target.outerWidth() / 2) + 'px'
    )

  fade = (fn) ->
    return $h1 unless fn
    $h1.fadeIn 1500, ->
      $h1.fadeOut 1500, fn
      return
    return

  fit = (html, fn) ->
    $h1.html(html) if html
    fitFontSize($h1, $window.width() - 20, $window.height() - 20)
    fade(fn)
    return

  countdown = (tmpl, deadline) ->
    diff = (deadline - Date.now()) / 1000 | 0
    return null if diff <= 0
    pat = {}
    res = {}
    reg = /\((.*?){([dhis])}(.*?)\)/g
    pat[m[2]] = true while m = reg.exec(tmpl)
    [['d', 86400], ['h', 3600], ['i', 60]].forEach (pair) ->
      if pat[pair[0]] && diff > pair[1]
        res[pair[0]] = (diff / pair[1] | 0)
        diff %= pair[1]
      return
    res.s = diff
    tmpl.replace(reg, (x, y, z, w) -> if res[z] then y + res[z] + w else '')

  reload = ->
    deadlines = [
      +(new Date(2016, 1, 13))
      +(new Date(2016, 1, 13, 7, 26))
      +(new Date(2016, 1, 13, 10, 15))
      +(new Date(2016, 1, 15, 19))
      +(new Date(2016, 2, 1))
    ]
    messages = [
      '<span><small>〆切まで</small><br>(<big>{d}</big>日)(<big>{h}</big>時間)(<big>{i}</big>分)(<big>{s}</big>秒)</span>'
      '<span class="mgold"><small>東京駅出発まで</small><br>({h}時間)({i}分)({s}秒)</span>'
      '<span class="mgold"><small>名古屋到着まで</small><br>({h}時間)({i}分)({s}秒)</span>'
      '<span class="mgold">絶対作文合宿</span>'
      '<span class="mred"><small>初稿〆切まで</small><br>(<big>{d}</big>日)(<big>{h}</big>時間)(<big>{i}</big>分)(<big>{s}</big>秒)</span>'
    ]
    index = 0

    fit 'グローバルエリート', ->
      fit '全球精英', ->
        fit 'おれたちは<br>\u201C休まない\u201D', ->
          $h1.addClass('illust').css(marginTop: 0, marginLeft: 0).html('<img src="top.jpg">')
          fade ->
            $h1.removeClass('illust')
            tid = setInterval ->
              while index < deadlines.length
                text = countdown(messages[index], deadlines[index])
                if text
                  $h1.is(':hidden') && $h1.fadeIn(1500)
                  fit(text)
                  return
                ++index
              clearInterval(tid)
              $h1.is(':hidden') || $h1.fadeOut(1500)
              fit '五月一日', ->
                fit('文学フリマ東京', reload)
                return
              return
            , 500
            return
          return
        return
      return

    $window.resize ->
      fit()
      return
    return
  (new Image).src = 'top.jpg'
  $window.load(reload)
  return
