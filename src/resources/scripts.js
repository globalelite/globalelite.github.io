(($) => {
  const fetchSvgImage = (svgText) => {
    const dfr = $.Deferred();
    const img = new Image();
    img.onload = () => {
      dfr.resolve(img);
    };
    img.onerror = () => {
      dfr.reject(img);
    };
    img.src = 'data:image/svg+xml;,' + encodeURIComponent(svgText);
    return dfr.promise();
  };

  const calcMarginRatio = (img) => 1 - img.width / img.height / 1.618;

  const expandMargin = (...margins) => {
    switch (margins.length) {
      case 4:
        return margins;
      case 3:
        return margins.concat(margins[1]);
      case 2:
        return margins.concat(margins);
      default: {
        const margin = margins[0] || 0;
        return [margin, margin, margin, margin];
      }
    }
  };

  const getCenteringPosition = (img, x, y, w, h) => {
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

  const getDrawingPosition = (canvas, img, ...args) => {
    const [marginTop, marginRight, marginBottom, marginLeft] = expandMargin(...(args || []));
    const pos = getCenteringPosition(
      img,
      marginLeft,
      marginTop,
      canvas.width - marginLeft - marginRight,
      canvas.height - marginTop - marginBottom
    );
    return { ...pos, marginTop, marginRight, marginBottom, marginLeft };
  };

  const createDrawArgsFromPos = (canvas, img, pos) => {
    if (!canvas.width) {
      canvas.width = pos.w + pos.marginLeft + pos.marginRight;
    }
    return [img, pos.x, pos.y, pos.w, pos.h];
  };

  const createDrawArgs = (canvas, img, ...args) => {
    const pos = getDrawingPosition(canvas, img, ...args);
    return createDrawArgsFromPos(canvas, img, pos);
  };

  const drawResource = (canvas, imgs, type, fgColor, bgColor, withMargin) => {
    const emblemImg = imgs[`${fgColor}Emblem`];
    const emblemGeImg = imgs[`${fgColor}EmblemGe`];
    const logoImg = imgs[`${fgColor}Logo`];
    const baseGapSize = (canvas.height * calcMarginRatio(emblemImg)) / 2;
    const baseMargin = withMargin ? baseGapSize : 0;
    const argsSet = [];

    switch (type) {
      case 'emblem':
        if (withMargin) {
          canvas.width = canvas.height;
        }
        argsSet.push(createDrawArgs(canvas, emblemImg, baseMargin));
        break;
      case 'logo':
        argsSet.push(createDrawArgs(canvas, logoImg, baseMargin));
        break;
      case 'emblem-ge': {
        if (withMargin) {
          canvas.width = canvas.height;
        }
        const margin = withMargin ? (canvas.height * calcMarginRatio(emblemGeImg)) / 4 : 0;
        argsSet.push(createDrawArgs(canvas, emblemGeImg, margin));
        break;
      }
      case 'horizontal': {
        const emblemPos = getDrawingPosition(canvas, emblemImg, baseMargin);
        argsSet.push(createDrawArgsFromPos(canvas, emblemImg, emblemPos));
        canvas.width = 0;
        const logoHeight = (emblemPos.h * 2) / 3;
        const logoMarginX = (canvas.height - logoHeight) / 2;
        argsSet.push(
          createDrawArgs(
            canvas,
            logoImg,
            logoMarginX,
            baseMargin,
            logoMarginX,
            emblemPos.x + emblemPos.w + baseGapSize
          )
        );
        break;
      }
      case 'vertical': {
        const margin = baseMargin / 2;
        const logoPos = getCenteringPosition(logoImg, margin, 0, canvas.height - margin * 2, 0);
        canvas.width = logoPos.w + margin * 2;
        const gapSize = (emblemImg.height * logoPos.scale - logoPos.h) / 2;
        const emblemPos = getDrawingPosition(
          canvas,
          emblemImg,
          margin,
          0,
          margin + gapSize + logoPos.h
        );
        argsSet.push(createDrawArgsFromPos(canvas, emblemImg, emblemPos));
        argsSet.push([
          logoImg,
          logoPos.x,
          emblemPos.y + emblemPos.h + gapSize,
          logoPos.w,
          logoPos.h,
        ]);
        break;
      }
    }

    const ctx = canvas.getContext('2d');
    if (bgColor) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    argsSet.forEach((args) => {
      ctx.drawImage(...(args || []));
    });
  };

  $.when(
    $.get({ url: require('../emblem.svg'), dataType: 'text' }),
    $.get({ url: require('../emblem-ge.svg'), dataType: 'text' }),
    $.get({ url: require('../logo.svg'), dataType: 'text' })
  ).then(([emblemText], [emblemGeText], [logoText]) => {
    $.when(
      fetchSvgImage(emblemText),
      fetchSvgImage(emblemGeText),
      fetchSvgImage(logoText),
      fetchSvgImage(emblemText.replace(/#fff/g, '#000')),
      fetchSvgImage(emblemGeText.replace(/#fff/g, '#000')),
      fetchSvgImage(logoText.replace(/#fff/g, '#000'))
    ).then((whiteEmblem, whiteEmblemGe, whiteLogo, blackEmblem, blackEmblemGe, blackLogo) => {
      $(() => {
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
        const generate = () => {
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
        generate();
      });
    });
  });
})($);
