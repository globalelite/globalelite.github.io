do ($) ->
  createSvgImg = (svgText) ->
    dfr = $.Deferred()
    img = new Image
    img.onload = ->
      dfr.resolve(img)
      return
    img.onerror = ->
      dfr.reject(img)
      return
    img.src = 'data:image/svg+xml;,' + encodeURIComponent(svgText)
    dfr.promise()

  calcMarginRatio = (img) -> 1 - img.width / img.height / 1.618

  expandMargin = (margins...) ->
    switch margins.length
      when 4
        margins
      when 3
        margins.concat(margins[1])
      when 2
        margins.concat(margins)
      else
        margin = margins[0] || 0
        [margin, margin, margin, margin]

  getCenteringPosition = (img, x, y, w, h) ->
    scale = Math.min(
      if w > 0 then w / img.width else Number.MAX_VALUE
      if h > 0 then h / img.height else Number.MAX_VALUE
    )
    imgW = img.width * scale
    imgH = img.height * scale
    imgX = Math.max(0, (w - imgW) / 2)
    imgY = Math.max(0, (h - imgH) / 2)
    { x: x + imgX, y: y + imgY, w: imgW, h: imgH, scale }

  createDrawData = (canvas, img, args...) ->
    margins = expandMargin(args...)
    [marginTop, marginRight, marginBottom, marginLeft] = margins
    pos = getCenteringPosition(
      img
      marginLeft
      marginTop
      canvas.width - marginLeft - marginRight
      canvas.height - marginTop - marginBottom
    )
    canvas.width ||= pos.w + marginLeft + marginRight
    { args: [img, pos.x, pos.y, pos.w, pos.h], pos, margins }

  drawResource = (canvas, imgs, type, fgColor, bgColor, withMargin) ->
    emblemImg = imgs["#{fgColor}Emblem"]
    logoImg = imgs["#{fgColor}Logo"]
    baseGapSize = canvas.height * calcMarginRatio(emblemImg) / 2
    baseMargin = if withMargin then baseGapSize else 0

    argsSet = []
    switch type
      when 'emblem'
        canvas.width = canvas.height if withMargin
        argsSet.push createDrawData(canvas, emblemImg, baseMargin).args
      when 'logo'
        argsSet.push createDrawData(canvas, logoImg, baseMargin).args
      when 'emblem-ge'
        canvas.width = canvas.height if withMargin
        img = imgs["#{fgColor}EmblemGe"]
        margin = if withMargin then canvas.height * calcMarginRatio(img) / 4 else 0
        argsSet.push createDrawData(canvas, img, margin).args
      when 'horizontal'
        { args: emblemArgs, pos: emblemPos } = createDrawData(canvas, emblemImg, baseMargin)
        argsSet.push emblemArgs
        canvas.width = 0
        logoMarginX = (canvas.height - logoImg.height * emblemPos.scale) / 2
        argsSet.push createDrawData(canvas, logoImg, logoMarginX, baseMargin, logoMarginX, emblemPos.x + emblemPos.w + baseGapSize).args
      when 'vertical'
        baseMargin /= 2
        logoPos = getCenteringPosition(logoImg, baseMargin, 0, canvas.height - baseMargin * 2, 0)
        canvas.width = logoPos.w + baseMargin * 2
        gapSize = (emblemImg.height * logoPos.scale - logoPos.h) / 2
        { args: emblemArgs, pos: emblemPos } = createDrawData(canvas, emblemImg, baseMargin, 0, baseMargin + gapSize + logoPos.h)
        argsSet.push emblemArgs
        argsSet.push [logoImg, logoPos.x, emblemPos.y + emblemPos.h + gapSize, logoPos.w, logoPos.h]

    ctx = canvas.getContext('2d')
    if bgColor
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.drawImage(args...) for args in argsSet
    return

  $.when(
    $.get(url: '/emblem.svg', dataType: 'text')
    $.get(url: '/emblem-ge.svg', dataType: 'text')
    $.get(url: '/logo.svg', dataType: 'text')
  ).then (emblemArgs, emblemGeArgs, logoArgs) ->
    $.when(
      createSvgImg(emblemArgs[0])
      createSvgImg(emblemGeArgs[0])
      createSvgImg(logoArgs[0])
      createSvgImg(emblemArgs[0].replace(/#fff/g, '#000'))
      createSvgImg(emblemGeArgs[0].replace(/#fff/g, '#000'))
      createSvgImg(logoArgs[0].replace(/#fff/g, '#000'))
    ).then (whiteEmblem, whiteEmblemGe, whiteLogo, blackEmblem, blackEmblemGe, blackLogo) ->
      $ ->
        imgNodes = { whiteEmblem, whiteEmblemGe, whiteLogo, blackEmblem, blackEmblemGe, blackLogo }
        canvasNode = $('<canvas>').appendTo('#resource')[0]
        formNode = $('#config').submit(-> false)[0]
        generate = ->
          canvasNode.width = 0
          canvasNode.height = parseInt(formNode.size.value, 10)
          [fgColor, bgColor] = formNode.color.value.split('-on-')
          drawResource(canvasNode, imgNodes, formNode.type.value, fgColor, bgColor, formNode.margin.checked)
          false
        $('input').change(generate)
        generate()
      return
    return
  return
