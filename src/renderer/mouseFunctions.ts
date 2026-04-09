import type { Vector2d } from "../vector";

export function screenToCanvasSpace(
  ctx: CanvasRenderingContext2D,
  vector: Vector2d,
): Vector2d {
  return {
    x:
      (vector.x - ctx.canvas.offsetLeft) *
      (ctx.canvas.width / ctx.canvas.offsetWidth),
    y:
      (vector.y - ctx.canvas.offsetTop) *
      (ctx.canvas.height / ctx.canvas.offsetHeight),
  };
}

export function withinCircle(
  point: Vector2d,
  circleCenter: Vector2d,
  circleRadius: number,
) {
  return (
    (point.x - circleCenter.x) ** 2 + (point.y - circleCenter.y) ** 2 <=
    circleRadius ** 2
  );
}
