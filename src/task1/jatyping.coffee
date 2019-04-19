do ($ = jQuery) ->
  typingTable = do ->
    table =
      'ん': ['ｎ']
    gyous =
      'ｋ': 'かきくけこ'
      'ｇ': 'がぎぐげご'
      'ｓ': 'さしすせそ'
      'ｚ': 'ざじずぜぞ'
      'ｔ': 'たちつてと'
      'ｄ': 'だぢづでど'
      'ｎ': 'なにぬねの'
      'ｈ': 'はひふへほ'
      'ｂ': 'ばびぶべぼ'
      'ｐ': 'ぱぴぷぺぽ'
      'ｍ': 'まみむめも'
      'ｙ': 'やゆよ'
      'ｒ': 'らりるれろ'
      'ｗ': 'わを'
    yoons = ['ゃ', 'ゅ', 'ょ']
    for k1 of gyous
      gyouChars = gyous[k1].split('')
      for k2 in gyouChars
        table[k2] = [k1, k2]
      if gyouChars.length == 5
        ion = gyouChars[1]
        for yoon in yoons
          ionYoon = "#{ion}#{yoon}"
          table[ionYoon] =
            if ion == 'じ'
              ['ｊ', ionYoon]
            else
              [k1, "#{k1}ｙ", ionYoon]
    table

  toTypings = (text) ->
    ss = text.match(/.[ゃゅょ]|./g)
    typings = []
    lastTyping = ''
    for s, index in ss
      keys =
        if s == 'っ' && typingTable[ss[index + 1]]
          [typingTable[ss[index + 1]][0]]
        else
          typingTable[s] || [s]
      for key in keys
        typings.push("#{lastTyping}#{key}")
      lastTyping += s
    unless typings[typings.length - 1] == lastTyping
      typings.push(lastTyping)
    typings

  delay = (ms, fn, that) ->
    ->
      if fn
        setTimeout(->
          fn.call(that || this)
          return
        , ms || 0)
      return

  $newNode = (options, name) ->
    tagName = options["#{name}TagName"]
    className = options["#{name}ClassName"]
    $("<#{tagName}>").addClass(className)

  runInputAs = (name, inputs, options, $base, updated, fn) ->
    $node = $newNode(options, 'input').addClass(options["#{name}ClassName"]).appendTo($base)
    run = (i) ->
      unless inputs[i]
        fn && fn()
        return

      lastInput = inputs[i - 1] || ''
      input = inputs[i]

      prefix = ''
      for c, j in input
        break unless c == lastInput[j]
        prefix += c

      typings = toTypings(input.slice(prefix.length)).map((t) -> prefix + t)
      if lastInput
        for n in [prefix.length..lastInput.length] by 1
          typings.unshift(lastInput.slice(0, n))

      update = (k) ->
        $node.text(typings[k])
        updated && updated()
        if typings[k + 1]
          delay(options.typeSpeed, ->
            update(k + 1)
            return
          )()
        else
          run(i + 1)
        return

      delay(options.typeStartSpeed, ->
        update(0)
        return
      )()
      return
    run(0)
    return

  runConvert = (convsSet, options, $base, updated, fn) ->
    $base.empty()
    $newNode(options, 'input').text(convs[0]).appendTo($base) for convs in convsSet
    $convs = $base.find(">.#{options.inputClassName}")
    $convs.addClass(options.typingClassName)
    $convs.eq(0).addClass(options.convertClassName)
    updated && updated()
    update = (i, j) ->
      if convsSet[i][j]
        $convs.removeClass(options.convertClassName)
        $convs.eq(i).addClass(options.convertClassName).text(convsSet[i][j])
        updated && updated()
        delay(options.convertSpeed, ->
          update(i, j + 1)
          return
        )()
        return
      for k in [i+1...convsSet.length] by 1
        if convsSet[k].length > 1
          delay(options.convertJumpSpeed, ->
            update(i + 1, 0)
            return
          )()
          return
      fn && fn()
      return
    delay(options.convertJumpSpeed, ->
      update(0, 1)
      return
    )()
    return

  runComplete = (options, $base, updated) ->
    $base
      .find(">.#{options.inputClassName}")
      .removeClass("#{options.typingClassName} #{options.convertClassName}")
    updated && updated()
    return

  appendInputs = (index, options, $caret, updated, comp) ->
    unless options.inputs[index]
      comp && comp()
      return

    runComp = ->
      runComplete(options, $base, updated)
      delay(options.typeStartSpeed, ->
        appendInputs(index + 1, options, $caret, updated, comp)
        return
      )()
      return
    $base = $newNode(options, 'base').insertBefore($caret)

    if Array.isArray(options.inputs[index][0])
      runInputAs('typing', options.inputs[index][0], options, $base, updated, ->
        if options.inputs[index][1]
          runConvert(options.inputs[index][1], options, $base, updated, delay(options.convertJumpSpeed, runComp))
        else
          runComp()
        return
      )
    else
      runInputAs('input', options.inputs[index], options, $base, updated, runComp)
    return

  removeInputsBefore = ($caret, options, updated, comp) ->
    caret = $caret[0]
    removeFromLast = (node, fn) ->
      unless node.nodeType == 3
        removeFromLast(node.lastChild, ->
          node.parentNode.removeChild(node) unless node.lastChild
          updated && updated()
          fn && fn()
          return
        )
        return

      removeText = (i) ->
        if i >= 0
          delay(options.removeSpeed, ->
            node.nodeValue = node.nodeValue.slice(0, i)
            updated && updated()
            removeText(i - 1)
            return
          )()
          return
        else
          node.parentNode.removeChild(node)
          updated && updated()
          fn && fn()
          return
      removeText(node.nodeValue.length - 1)
      return

    removeAll = ->
      if caret.previousSibling
        removeFromLast(caret.previousSibling, removeAll)
      else
        comp && comp()
      return
    removeAll()
    return

  parseArguments = (args, types...) ->
    options = {}
    for arg in args
      if $.isPlainObject(arg)
        $.extend(options, arg)
        break
      for [k, type], i in types
        if $.isFunction(type) && type(arg) || typeof arg == type
          options[k] = arg
          types.splice(i, 1)
          break
    options

  $.fn.jatyping = ->
    options = $.extend(
      {}
      $.fn.jatyping.defaults
      parseArguments(
        arguments
        ['inputs', Array.isArray]
        ['complete', $.isFunction]
        ['completeDelay', 'number']
      )
    )
    $.fn.jatyping.assertOptions(options)

    @each ->
      that = this
      if options.complete
        comp = delay(options.completeDelay, options.complete, that)
      if options.update
        updated = ->
          options.update.call(that)
          return
      $caret = $(this).find(">.#{options.caretClassName}")
      $caret = $newNode(options, 'caret').appendTo(this) unless $caret.length
      if options.inputs
        appendInputs(0, options, $caret, updated, comp)
      else
        removeInputsBefore($caret, options, updated, comp)
      return

  $.fn.jatyping.assertOptions = (options) ->
    for k, v of @defaults
      if !v || /[^a-z0-9_-]/i.test(v)
        throw new Error("invalid options.#{k}: #{v}")
    return

  $.fn.jatyping.defaults =
    baseTagName: 'span'
    baseClassName: 'jatyping'
    caretTagName: 'span'
    caretClassName: 'jatyping-caret'
    inputTagName: 'span'
    inputClassName: 'jatyping-input'
    typingClassName: 'jatyping-typing'
    convertClassName: 'jatyping-convert'
    removeSpeed: 25
    typeSpeed: 80
    typeStartSpeed: 150
    convertSpeed: 150
    convertJumpSpeed: 200
  return
