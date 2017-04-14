Dot[] dots = new Dot[100];
int speed = 12;

void setup() {
  frameRate(10);
  size(640, 180);
  background(0);
  strokeWeight(1);
  smooth();

  for (int i = 0; i < dots.length; i++) {
    dots[i] = new Dot(); // after set width
  }
}

void draw() {
  int skipCount = 10;
  int outCount = 0;

  for (int i = 0; i < dots.length; i++) {
    Dot dot = dots[i];

    if (dot.x < 0 || width < dot.x || dot.y < 0 || height < dot.y) {
      outCount++;
    }

    if ((frameCount % skipCount) != (i % skipCount)) {
      continue;
    }

    stroke(random(1, 135), random(1, 140), 219, 100);
    if (dot.prevX >= 0 || dot.prevY >= 0) {
      line(dot.prevX, dot.prevY, dot.x, dot.y); // draw line
    }

    if (1 > random(2.5)) {
      dot.translate(random(-speed, speed), 0); // horizontal move
    } else {
      dot.translate(0, random(0, speed)); // vertical move
    }
  }

  if (outCount == dots.length) {
    exit();
  }
}

class Dot {
  int x;
  int y;
  int prevX;
  int prevY;

  Dot() {
    x = prevX = random(speed * 2, width - speed * 2);
    y = prevY = 0;
  }

  void translate(int dx, int dy) {
    prevX = x;
    prevY = y;
    x += dx;
    y += dy;
  }
}
