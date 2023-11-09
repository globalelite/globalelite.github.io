(($) => {
  const getPathData = (svgRoot) => {
    const $svg = $('svg', svgRoot);
    const path = new Path2D();
    $svg.find('path').map(function () {
      path.addPath(new Path2D($(this).attr('d')));
    });
    return {
      width: parseFloat($svg.attr('width')),
      height: parseFloat($svg.attr('height')),
      path,
    };
  };

  const createSVGMatrix = () =>
    document.createElementNS('http://www.w3.org/2000/svg', 'svg').createSVGMatrix();

  const calcMarginRatio = (img) => 1 - img.width / img.height / 1.618;

  const toSizeAll = (...sizes) => {
    if (typeof sizes === 'number') return [sizes, sizes, sizes, sizes];
    switch (sizes.length) {
      case 1:
        return [sizes[0], sizes[0], sizes[0], sizes[0]];
      case 2:
        return [sizes[0], sizes[1], sizes[0], sizes[1]];
      case 3:
        return [sizes[0], sizes[1], sizes[2], sizes[1]];
      default:
        return sizes.slice(0, 4);
    }
  };

  $.when(
    $.get({ url: require('../emblem.svg'), dataType: 'xml' }),
    $.get({ url: require('../emblem-ge.svg'), dataType: 'xml' }),
    $.get({ url: require('../logo.svg'), dataType: 'xml' }),
  ).then(([emblemNode], [emblemGeNode], [logoNode]) => {
    const emblemData = getPathData(emblemNode);
    const emblemGeData = getPathData(emblemGeNode);
    const logoData = getPathData(logoNode);
    const getData = (type) => {
      switch (type) {
        case 'emblem':
          return emblemData;

        case 'emblem-ge':
          return emblemGeData;

        case 'logo':
          return logoData;

        case 'horizontal': {
          const gapSize = (emblemData.height * calcMarginRatio(emblemData)) / 2;
          const logoHeight = (emblemData.height * 2) / 3;
          const logoScale = logoHeight / logoData.height;
          const path = new Path2D();
          path.addPath(emblemData.path);
          path.addPath(
            logoData.path,
            createSVGMatrix()
              .translate(emblemData.width + gapSize, (emblemData.height - logoHeight) / 2)
              .scale(logoScale),
          );
          return {
            width: emblemData.width + gapSize + logoData.width * logoScale,
            height: emblemData.height,
            path,
          };
        }

        case 'vertical': {
          const logoScale = emblemData.height / logoData.width;
          const logoHeight = logoData.height * logoScale;
          const gapSize = ((emblemData.height - logoData.height) * logoScale) / 2;
          const emblemHeight = emblemData.height - gapSize - logoHeight;
          const emblemScale = emblemHeight / emblemData.height;
          const path = new Path2D();
          path.addPath(
            emblemData.path,
            createSVGMatrix()
              .translate((emblemData.height - emblemData.width * emblemScale) / 2, 0)
              .scale(emblemScale),
          );
          path.addPath(
            logoData.path,
            createSVGMatrix()
              .translate(0, emblemData.height - logoHeight)
              .scale(logoScale),
          );
          return {
            width: emblemData.height,
            height: emblemData.height,
            path,
          };
        }
      }
    };

    const getAutoPadding = (type, canvasHeight) => {
      const baseSize = (canvasHeight * calcMarginRatio(emblemData)) / 2;
      switch (type) {
        case 'emblem':
          return toSizeAll(
            (canvasHeight -
              ((canvasHeight - baseSize * 2) / emblemData.width) * emblemData.height) /
              2,
            baseSize,
          );
        case 'emblem-ge': {
          const size = (canvasHeight * calcMarginRatio(emblemGeData)) / 4;
          return toSizeAll(
            (canvasHeight - ((canvasHeight - size) / emblemGeData.width) * emblemGeData.height) / 2,
            size,
          );
        }
        case 'vertical':
          return toSizeAll(baseSize / 2);
        default:
          return toSizeAll(baseSize);
      }
    };

    $(() => {
      const canvasNode = $('<canvas>').appendTo('#resource')[0];
      const formNode = $('#config').submit(() => false)[0];
      const generate = () => {
        const [fgColor, bgColor] = formNode.color.value.split('-on-');
        const data = getData(formNode.type.value);
        const canvasHeight = parseInt(formNode.height.value, 10);
        const padding = formNode.autoPadding.checked
          ? getAutoPadding(formNode.type.value, canvasHeight)
          : formNode.padding.value
          ? toSizeAll(...formNode.padding.value.split(/\s+/).map(parseFloat))
          : toSizeAll(0);
        const canvasWidth =
          (formNode.autoWidth.checked ? 0 : parseInt(formNode.width.value, 10)) ||
          Math.round(
            ((canvasHeight - padding[0] - padding[2]) / data.height) * data.width +
              (padding[1] + padding[3]),
          );

        if (formNode.autoWidth.checked) {
          formNode.width.value = '';
          formNode.width.disabled = true;
        } else if (formNode.width.disabled) {
          formNode.width.value = canvasWidth;
          formNode.width.disabled = false;
        }
        if (formNode.autoPadding.checked) {
          formNode.padding.value = '';
          formNode.padding.disabled = true;
        } else if (formNode.padding.disabled) {
          formNode.padding.value = 0;
          formNode.padding.disabled = false;
        }

        canvasNode.width = canvasWidth;
        canvasNode.height = canvasHeight;
        const scale = Math.min(
          (canvasWidth - padding[1] - padding[3]) / data.width,
          (canvasHeight - padding[0] - padding[2]) / data.height,
        );
        const ctx = canvasNode.getContext('2d');
        if (bgColor) {
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvasNode.width, canvasNode.height);
        }
        ctx.fillStyle = fgColor;
        const mtx = createSVGMatrix();
        const path = new Path2D();
        path.addPath(
          data.path,
          mtx
            .translate(
              padding[3] + (canvasNode.width - padding[1] - padding[3] - data.width * scale) / 2,
              padding[0] + (canvasNode.height - padding[0] - padding[2] - data.height * scale) / 2,
            )
            .scale(scale),
        );
        ctx.fill(path);
        return false;
      };
      $('input').change(generate);
      generate();
    });
  });
})($);
