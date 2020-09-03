/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
(function ($) {
  const createSvgImg = function (svgText) {
    const dfr = $.Deferred();
    const img = new Image();
    img.onload = function () {
      dfr.resolve(img);
    };
    img.onerror = function () {
      dfr.reject(img);
    };
    img.src = 'data:image/svg+xml;,' + encodeURIComponent(svgText);
    return dfr.promise();
  };

  const calcMarginRatio = (img) => 1 - img.width / img.height / 1.618;

  const expandMargin = function (...margins) {
    switch (margins.length) {
      case 4:
        return margins;
      case 3:
        return margins.concat(margins[1]);
      case 2:
        return margins.concat(margins);
      default:
        var margin = margins[0] || 0;
        return [margin, margin, margin, margin];
    }
  };

  const getCenteringPosition = function (img, x, y, w, h) {
    const scale = Math.min(
      w > 0 ? w / img.width : Number.MAX_VALUE,
      h > 0 ? h / img.height : Number.MAX_VALUE
    );
    const imgW = img.width * scale;
    const imgH = img.height * scale;
    const imgX = Math.max(0, (w - imgW) / 2);
    const imgY = Math.max(0, (h - imgH) / 2);
    return { x: x + imgX, y: y + imgY, w: imgW, h: imgH, scale };
  };

  const createDrawData = function (canvas, img, ...args) {
    const margins = expandMargin(...Array.from(args || []));
    const [marginTop, marginRight, marginBottom, marginLeft] = Array.from(margins);
    const pos = getCenteringPosition(
      img,
      marginLeft,
      marginTop,
      canvas.width - marginLeft - marginRight,
      canvas.height - marginTop - marginBottom
    );
    if (!canvas.width) {
      canvas.width = pos.w + marginLeft + marginRight;
    }
    return { args: [img, pos.x, pos.y, pos.w, pos.h], pos, margins };
  };

  const drawResource = function (canvas, imgs, type, fgColor, bgColor, withMargin) {
    const emblemImg = imgs[`${fgColor}Emblem`];
    const logoImg = imgs[`${fgColor}Logo`];
    const baseGapSize = (canvas.height * calcMarginRatio(emblemImg)) / 2;
    let baseMargin = withMargin ? baseGapSize : 0;

    const argsSet = [];
    switch (type) {
      case 'emblem':
        if (withMargin) {
          canvas.width = canvas.height;
        }
        argsSet.push(createDrawData(canvas, emblemImg, baseMargin).args);
        break;
      case 'logo':
        argsSet.push(createDrawData(canvas, logoImg, baseMargin).args);
        break;
      case 'emblem-ge':
        if (withMargin) {
          canvas.width = canvas.height;
        }
        var img = imgs[`${fgColor}EmblemGe`];
        var margin = withMargin ? (canvas.height * calcMarginRatio(img)) / 4 : 0;
        argsSet.push(createDrawData(canvas, img, margin).args);
        break;
      case 'horizontal':
        var { args: emblemArgs, pos: emblemPos } = createDrawData(canvas, emblemImg, baseMargin);
        argsSet.push(emblemArgs);
        canvas.width = 0;
        var logoMarginX = (canvas.height - logoImg.height * emblemPos.scale) / 2;
        argsSet.push(
          createDrawData(
            canvas,
            logoImg,
            logoMarginX,
            baseMargin,
            logoMarginX,
            emblemPos.x + emblemPos.w + baseGapSize
          ).args
        );
        break;
      case 'vertical':
        baseMargin /= 2;
        var logoPos = getCenteringPosition(
          logoImg,
          baseMargin,
          0,
          canvas.height - baseMargin * 2,
          0
        );
        canvas.width = logoPos.w + baseMargin * 2;
        var gapSize = (emblemImg.height * logoPos.scale - logoPos.h) / 2;
        ({ args: emblemArgs, pos: emblemPos } = createDrawData(
          canvas,
          emblemImg,
          baseMargin,
          0,
          baseMargin + gapSize + logoPos.h
        ));
        argsSet.push(emblemArgs);
        argsSet.push([
          logoImg,
          logoPos.x,
          emblemPos.y + emblemPos.h + gapSize,
          logoPos.w,
          logoPos.h,
        ]);
        break;
    }

    const ctx = canvas.getContext('2d');
    if (bgColor) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    for (let args of argsSet) {
      ctx.drawImage(...Array.from(args || []));
    }
  };

  $.when(
    $.get({ url: require('/emblem.svg'), dataType: 'text' }),
    $.get({ url: require('/emblem-ge.svg'), dataType: 'text' }),
    $.get({ url: require('/logo.svg'), dataType: 'text' })
  ).then(function (emblemArgs, emblemGeArgs, logoArgs) {
    $.when(
      createSvgImg(emblemArgs[0]),
      createSvgImg(emblemGeArgs[0]),
      createSvgImg(logoArgs[0]),
      createSvgImg(emblemArgs[0].replace(/#fff/g, '#000')),
      createSvgImg(emblemGeArgs[0].replace(/#fff/g, '#000')),
      createSvgImg(logoArgs[0].replace(/#fff/g, '#000'))
    ).then(function (whiteEmblem, whiteEmblemGe, whiteLogo, blackEmblem, blackEmblemGe, blackLogo) {
      $(function () {
        const imgNodes = {
          whiteEmblem,
          whiteEmblemGe,
          whiteLogo,
          blackEmblem,
          blackEmblemGe,
          blackLogo,
        };
        const canvasNode = $('<canvas>').appendTo('#resource')[0];
        const formNode = $('#config').submit(() => false)[0];
        const generate = function () {
          canvasNode.width = 0;
          canvasNode.height = parseInt(formNode.size.value, 10);
          const [fgColor, bgColor] = Array.from(formNode.color.value.split('-on-'));
          drawResource(
            canvasNode,
            imgNodes,
            formNode.type.value,
            fgColor,
            bgColor,
            formNode.margin.checked
          );
          return false;
        };
        $('input').change(generate);
        return generate();
      });
    });
  });
})($);
