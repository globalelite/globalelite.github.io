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
      $sizer.css('fontSize', fontSize + 'px')
      sizerWidth = $sizer.outerWidth()
      sizerHeight = $sizer.outerHeight()
    while sizerWidth >= maxWidth || sizerHeight >= maxHeight
      scaleW = maxWidth / sizerWidth
      scaleH = maxHeight / sizerHeight
      scaleW = scaleH if scaleW < 1
      scaleH = scaleW if scaleH < 1
      fontSize -= Math.max(fontSize * (1 - Math.min(scaleW, scaleH)), 1)
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
    htmlsGroup = [
      [
        ['span', 'ぜんきゅう', '全球']
        ['span', 'せいえい', '精鋭']
      ]
      300
      [
        ['span', 'ぐろーばる', 'グローバル']
        ['span', 'えりーと', 'エリート']
        ['br']
        ['span', '２０１６ねん', '二〇一六年']
        ['span', 'ごがつ', '五月']
        ['span', 'ついたち', '一日']
        ['br']
        ['a href="http://bunfree.net/?tokyo_bun22"', 'だいにじゅうにかい', '第二十二回']
        ['a href="http://bunfree.net/?tokyo_bun22"', 'ぶんがく', '文学']
        ['a href="http://bunfree.net/?tokyo_bun22"', 'ふりま', 'フリマ']
        ['a href="http://bunfree.net/?tokyo_bun22"', 'とうきょう', '東京']
      ]
      300
      [
        ['span', 'どうじん', '同人']
        ['span', 'SF', 'SF']
        ['span', 'しょうせつ', '小説']
        ['span', 'あんそろじー', 'アンソロジー']
        ['br']
        ['span', 'WORK　', 'WORK　']
        ['span', 'せりえんと', 'セリエント']
        ['span', '（かしょう）', '（仮称）']
        ['br']
        ['span', '１０００えん', '１０００円']
        ['span', 'で', 'で']
        ['span', 'はんぷよてい', '頒布予定']
      ]
      500
      [
        ['span', 'とうはんしゃせん', '登坂車線']
        ['br']
        ['span', 'くれーたー', 'クレーター']
        ['br']
        ['span', 'せりえんと', 'セリエント']
        ['br']
        ['span', 'Lovely Fairy With me', 'Lovely Fairy With me']
        ['br']
        ['span', 'たくと', 'タクト']
        ['span', 'くん', 'くん']
        ['br']
        ['br']
        ['span', 'を', 'を']
        ['span', 'しゅうろく', '収録']
        ['span', 'よてい', '予定']
      ]
      500
      [
        ['span', 'おれたちは', 'おれたちは']
        ['br']
        ['span', '\u201Cやすまない\u201D', '\u201C休まない\u201D']
      ]
      1000
    ]

    for htmls in htmlsGroup
      if typeof htmls == 'number'
        lastInput = inputs[inputs.length - 1]
        continue unless lastInput
        inputed = lastInput[1]
        while true
          t = inputed.replace(/[^<>](<\/\w+>)$/, '$1')
          unless inputed == t
            inputs.push([25, inputed = t])
            continue
          t = inputed.replace(/<(\w+)[^<>]*\/?>$/, '')
          unless inputed == t
            inputs.push([25, inputed = t])
            continue
          t = inputed.replace(/<(\w+)[^<>]*><\/\1>$/, '')
          unless inputed == t
            inputed = t
            continue
          break
        inputs.push([htmls, ''])
      else
        inputed = ''
        for d in htmls
          if d.length == 1
            inputs.push([50, inputed += "<#{d[0]}/>"])
          else
            inputing = "<#{d[0]} class=\"i\">"
            closetag = "</#{d[0].match(/^\w+/)[0]}>"
            for char in d[1].match(/っ.|.[ゃゅょ]|./g)
              inputs.push([60, inputed + inputing + k + closetag]) for k in keyTable[char] || [char]
              inputing += if k == 'ｎ' then 'ん' else k
            inputs.push([50, inputed + "<#{d[0]} class=\"i\">#{d[2]}#{closetag}"])
            inputs.push([200, inputed += "<#{d[0]} class=\"f\">#{d[2]}#{closetag}"])
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
