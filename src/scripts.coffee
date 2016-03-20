$('html').addClass('js')

# pp = console.log.bind console

$ ($) ->
  $window = $(window)
  $body = $('body')
  $screen = $('<div>').addClass('screen').appendTo($body)

  resizeFitFontSize = ($target, maxWidth, maxHeight) ->
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
    return unless sizerWidth && sizerHeight
    while sizerWidth < maxWidth && sizerHeight < maxHeight
      scaleW = maxWidth / sizerWidth
      scaleH = maxHeight / sizerHeight
      break if scaleW <= 1 && scaleW <= 1
      scaleW = scaleH if scaleW <= 1
      scaleH = scaleW if scaleH <= 1
      fontSize *= Math.min(scaleW, scaleH)
      fontSize = Math.ceil(fontSize)
      $sizer.css('fontSize', fontSize + 'px')
      sizerWidth = $sizer.outerWidth()
      sizerHeight = $sizer.outerHeight()
    while sizerWidth >= maxWidth || sizerHeight >= maxHeight
      scaleW = maxWidth / sizerWidth
      scaleH = maxHeight / sizerHeight
      scaleW = scaleH if scaleW < 1
      scaleH = scaleW if scaleH < 1
      fontSize -= Math.max(Math.round(fontSize * (1 - Math.min(scaleW, scaleH))), 1)
      $sizer.css('fontSize', fontSize + 'px')
      sizerWidth = $sizer.outerWidth()
      sizerHeight = $sizer.outerHeight()
    $sizer.remove()
    $target.css('fontSize', fontSize + 'px')
    $target.css(
      marginTop: -($target.outerHeight() / 2)
      marginLeft: -($target.outerWidth() / 2)
    )

  fitScreen = ->
    resizeFitFontSize(
      $screen
      $window.width() - parseInt($body.css('marginLeft'), 10) - parseInt($body.css('marginRight'), 10)
      $window.height() - parseInt($body.css('marginTop'), 10) - parseInt($body.css('marginBottom'), 10)
    )
    return

  $window.resize(fitScreen)
  fitScreen()

  inputs = []
  do ->
    keyTable =
      'ん': ['ｎ']
      'きょ': ['ｋ', 'ｋｙ', 'きょ']
      'きゅ': ['ｋ', 'ｋｙ', 'きゅ']
      'しょ': ['ｓ', 'ｓｙ', 'しょ']
      'しゅ': ['ｓ', 'ｓｙ', 'しゅ']
      'じゅ': ['ｊ', 'じゅ']
    keyTableData =
      'ｋ': 'かきくけこ'
      'ｇ': 'がぎぐげご'
      'ｓ': 'さしすせそ'
      'ｚ': 'ざじずぜぞ'
      'ｔ': 'たちつてと'
      'ｄ': 'だぢづでど'
      'ｎ': 'なにぬねの'
      'ｈ': 'はまやらわ'
      'ｂ': 'ばびぶべぼ'
      'ｐ': 'ぱぴぷぺぽ'
      'ｍ': 'まみむめも'
      'ｙ': 'やゆよ'
      'ｒ': 'らりるれろ'
      'ｗ': 'わを'
    for k1 of keyTableData
      for k2 in keyTableData[k1].split('')
        keyTable[k2] = [k1, k2]
    bunfreeURL = 'http://bunfree.net/?tokyo_bun22'
    placeURL = 'https://www.google.co.jp/maps/place/%E6%9D%B1%E4%BA%AC%E6%B5%81%E9%80%9A%E3%82%BB%E3%83%B3%E3%82%BF%E3%83%BC%E7%AC%AC%E4%B8%80%E5%B1%95%E7%A4%BA%E5%A0%B4/@35.5808419,139.7483595,15z/data=!4m2!3m1!1s0x0:0x3c65b91947c29bba'
    htmlsGroup = [
      [
        ['span', 'ぜんきゅう', '全球']
        ['span', 'せいえい', '精鋭']
      ]
      [1000, 300]
      [
        ['span', 'ぐろーばる', 'グローバル']
        ['span', 'えりーと', 'エリート']
        ['br']
        ['span', '２０１６ねん', '二〇一六年']
        ['span', 'ごがつ', '五月']
        ['span', 'ついたち', '一日']
        ['br']
        ['a href="'+bunfreeURL+'"', 'だいにじゅうにかい', '第二十二回']
        ['br']
        ['a href="'+bunfreeURL+'"', 'ぶんがく', '文学']
        ['a href="'+bunfreeURL+'"', 'ふりま', 'フリマ']
        ['a href="'+bunfreeURL+'"', 'とうきょう', '東京']
        ['br']
        ['a href="'+placeURL+'"', 'とうきょう', '東京']
        ['a href="'+placeURL+'"', 'りゅうつう', '流通']
        ['a href="'+placeURL+'"', 'せんたー', 'センター']
        ['br']
        ['a href="'+placeURL+'"', 'だいいち', '第一']
        ['a href="'+placeURL+'"', 'てんじじょう', '展示場']
      ]
      [1500, 300]
      [
        ['a href="https://c.bunfree.net/c/tokyo22/!/%E3%82%A8/34"', 'え', 'エ']
        ['a href="https://c.bunfree.net/c/tokyo22/!/%E3%82%A8/34"', '-34']
      ]
      [1500, 300]
      [
        ['span', 'どうじん', '同人']
        ['span', ' SF ']
        ['span', 'しょうせつ', '小説']
        ['span', 'あんそろじー', 'アンソロジー']
        ['br']
        ['span', 'WORK ']
        ['span', 'せりえんと', 'セリエント']
        ['span', '（かり）', '（仮）']
        ['br']
        ['span', '１０００えん', '1000円']
        ['span', '〜', '〜']
        ['span', '１５００えん', '1500円']
        ['span', 'で', 'で']
        ['span', 'はんぷ', '頒布']
        ['span', 'よてい', '予定']
      ]
      [500, 300]
      [
        ['span', 'とうはんしゃせん', '登坂車線']
        ['br']
        ['span', 'くれーたー', 'クレーター']
        ['br']
        ['span', 'せりえんと', 'セリエント']
        ['br']
        ['span', 'Lovely Fairy With me']
        ['br']
        ['span', 'たくと', 'タクト']
        ['span', 'くん', 'くん']
        ['br']
        ['span', 'を', 'を']
        ['span', 'しゅうろく', '収録']
        ['span', 'よてい', '予定']
      ]
      [1000, 500]
      [
        ['span', 'おれたちは', 'おれたちは']
        ['br']
        ['span', '\u201Cやすまない\u201D', '\u201C休まない\u201D']
      ]
      [2000, 1000]
    ]

    for htmls in htmlsGroup
      if typeof htmls[0] == 'number'
        lastInput = inputs[inputs.length - 1]
        continue unless lastInput
        inputs.push([htmls[0], lastInput[1]])
        inputed = lastInput[1]
        while true
          t = inputed.replace(/[^<>](<\/\w+>)$/, '$1')
          unless inputed == t
            inputs.push([30, inputed = t])
            continue
          t = inputed.replace(/<(\w+)[^<>]*\/?>$/, '')
          unless inputed == t
            inputs.push([30, inputed = t])
            continue
          t = inputed.replace(/<(\w+)[^<>]*><\/\1>$/, '')
          unless inputed == t
            inputed = t
            continue
          break
        inputs.push([htmls[1], ''])
      else
        inputed = ''
        for d in htmls
          if d.length == 1
            inputs.push([50, inputed += "<#{d[0]}/>"])
            continue

          closetag = "</#{d[0].match(/^\w+/)[0]}>"
          if d.length == 2
            inputing = "<#{d[0]} class=\"f\">"
            for k in d[1].split('')
              k = '&nbsp;' if k == ' '
              inputs.push([50, inputed + inputing + k + closetag])
              inputing += k
            inputs.push([100, inputed += "<#{d[0]} class=\"f\">#{d[1]}#{closetag}"])
          else
            inputing = "<#{d[0]} class=\"i\">"
            for char in d[1].match(/っ.|.[ゃゅょ]|./g)
              inputs.push([50, inputed + inputing + k + closetag]) for k in keyTable[char] || [char]
              inputing += if k == 'ｎ' then 'ん' else k
            inputs.push([50, inputed + "<#{d[0]} class=\"i\">#{d[2]}#{closetag}"])
            inputs.push([(if d[1] == d[2] then 50 else 100), inputed += "<#{d[0]} class=\"f\">#{d[2]}#{closetag}"])
    return

  index = 0
  typing = ->
    input = inputs[index]
    $screen.html(input[1] + '<span class="c">|</span>')
    fitScreen()
    ++index
    index %= inputs.length
    setTimeout(typing, input[0])
  typing()
