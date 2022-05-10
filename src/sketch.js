let c;
// let font;
// function preload() {
//   font = loadFont('SourceHanSansJP-Heavy.otf');
// }

function setup() {
  c = createCanvas(500, 600);
  c.parent('p5canvas');

  // noLoop();
  pixelDensity();
  smooth();
  colorMode(HSB, 360, 100, 100, 100);
  //   background(90, 5, 95);
  // background("#0A3747");
}

let x, y, baseX, baseY;
function draw() {
  if (frameCount < 500) {
    for (let i = 0; i < 30; i++) {
      // let ptColors = [color("#306C6D"), color("#5D9D87"), color("#87A090")];
      // stroke(ptColors[int(random(0, 3))]);
      strokeWeight(1);
      baseX = width * 0.2;
      baseY = height * 0.5;
      let rnd = random();
      if (rnd > 0 && rnd <= 0.2) {
        // stroke("#306C6D");
        // stroke("#E3FCEC");
        stroke('#fff');
        x = 100 * tan(frameCount * i * 0.1) + 100 * sin(tan(frameCount * i * 0.2)) + baseX;
        y = 100 * sin(frameCount * i * 0.1) * tan(cos(frameCount * i * 0.1)) + baseY;
      } else if (rnd > 0.2 && rnd <= 0.5) {
        // stroke("#A39F81");
        stroke('#fff');
        x = 100 * cos(tan(frameCount * i * 0.2)) + 100 * cos(sq(tan(frameCount * i * 0.2))) + baseX;
        y = 100 * sin(tan(frameCount * i * 0.4)) + 100 * sq(cos(tan(frameCount * i * 0.2))) + baseY;
      } else {
        // stroke("#7E90B0");
        stroke('#fff');
        x = 100 * sin(frameCount * i * 0.1) + 100 * sq(tan(frameCount * i * 0.1)) + baseX;
        y =
          100 * cos(-10 * sin(frameCount * i * 0.1)) +
          100 * cos(sq(tan(frameCount * i * 0.2))) +
          baseX;
      }

      point(x, y);
    }
  }
  if (frameCount == 500) {
    freeTitle(width * 0.1, height * 0.2);
  }
}

function freeTitle(titleX, titleY) {
  let fSize = 24;
  //   textFont(font);
  textSize(fSize);
  textAlign(LEFT);

  //title
  noStroke();
  // fill("#D39867");
  fill('#fff');
  let titleStr = 'グローバルエリート';
  text(titleStr, titleX, titleY);
  titleStr = '同人SF小説アンソロジーWORK';
  text(titleStr, titleX, titleY + 50);
  fSize = 80;
  textSize(fSize);
  titleStr = '8';
  text(titleStr, titleX, titleY + 140);

  fSize = 18;
  textSize(fSize);
  // fill("#F2FFB6");
  fill('#fff');
  titleStr = '文学フリマ東京 2022/05/29';
  text(titleStr, titleX, titleY + 340);
}

function mousePressed() {
  // // freeTitle(width * 0.1, height * 0.2)
  // let date = new Date();
  // let year = str(date.getFullYear());
  // let month = str(1 + date.getMonth());
  // let day = str(date.getDate());
  // let hour = str(date.getHours());
  // let minute = str(date.getMinutes());
  // let fileName = "ge_cover_" + year + month + day + hour + minute + ".jpg";
  // saveCanvas(c, fileName);
}
