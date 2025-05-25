declare namespace google {
  namespace maps {
    class Size {
      constructor(width: number, height: number);
    }

    class Point {
      constructor(x: number, y: number);
    }

    interface Icon {
      url: string;
      scaledSize?: google.maps.Size;
      origin?: google.maps.Point;
      anchor?: google.maps.Point;
    }
  }
}
