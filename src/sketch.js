/*
グロエリHP用アニメ
https://globalelite.black/
ユニテイル~のイメージを流用
 
*/
let c;

function setup() {
  c = createCanvas(500, 500, WEBGL);
  c.parent('p5canvas');

  // noLoop();
  pixelDensity();
  colorMode(HSB, 360, 100, 100, 100);
  blendMode(DIFFERENCE);
  // backround(210, 10, 100);
  background(0, 0, 0, 10);
}

function draw() {
  background(0, 0, 0, 20);
  // if (frameCount < 460) {
  ambientLight(200);
  pointLight(180, 90, 90, -100, -100, 400);
  specularMaterial(80);
  ambientMaterial(random(180, 230), random(60, 90), 0);
  strokeWeight(1);
  stroke(0, 0, 90);

  push();
  {
    rotateY(frameCount / 60.0);
    push();
    translate(width * 0.06, -height * 0.05, 0);
    rotateX(cos(frameCount * 0.06));
    rotateY(sin(frameCount * 0.05));
    rotateZ(sin(frameCount * 0.06));
    box(height * 0.165);
    // sphere(height * 0.165);
    gameBox();
    pop();
  }
  pop();
  // }
}

function gameBox() {
  let xDiff;
  strokeWeight(1);
  if (random() > 0.9) {
    for (let x = -width * 0.2; x < width * 0.2; x += 40) {
      stroke(0, 0, 100, 50);
      line(x, -height * 0.2 + random(-55, 55), x, height * 0.2 + random(-155, 155));

      stroke(0, 100, 100, 50);
      xDiff = random(-12, 12);
      line(
        x + xDiff,
        -height * 0.2 + random(-155, 155),
        x + xDiff,
        height * 0.2 + random(-155, 155),
      );

      stroke(190, 100, 100, 50);
      xDiff = random(-8, 8);
      line(
        x + xDiff,
        -height * 0.2 + random(-155, 155),
        x + xDiff,
        height * 0.2 + random(-155, 155),
      );
    }
  }

  if (random() > 0.9) {
    for (let y = -height * 0.2; y < height * 0.2; y += 60) {
      stroke(0, 0, 100, 50);
      line(-width * 0.2 + +random(-155, 155), y, width * 0.2 + +random(-155, 155), y);

      stroke(0, 100, 100, 50);
      line(
        -width * 0.2 + random(-155, 155),
        y + random(-8, 8),
        width * 0.2 + random(-155, 155),
        y + random(-8, 8),
      );

      stroke(190, 100, 100, 50);
      line(
        -width * 0.2 + random(-155, 155),
        y + random(-8, 8),
        width * 0.2 + random(-155, 155),
        y + random(-8, 8),
      );
    }
  }
}
