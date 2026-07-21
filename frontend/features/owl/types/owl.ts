export type OwlAnimation = "idle" | "fly-in" | "none";

export interface OwlPosition {
  x: number;
  y: number;
}

export interface OwlState {
  currentAnimation: OwlAnimation;
  position: OwlPosition;
  isVisible: boolean;
  isFlying: boolean;
}
