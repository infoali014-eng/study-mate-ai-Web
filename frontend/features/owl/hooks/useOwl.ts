import { useOwlStore } from "../store/owlStore";

export const useOwl = () => {
  const currentAnimation = useOwlStore((s) => s.currentAnimation);
  const position = useOwlStore((s) => s.position);
  const isVisible = useOwlStore((s) => s.isVisible);
  const isFlying = useOwlStore((s) => s.isFlying);

  const setCurrentAnimation = useOwlStore((s) => s.setCurrentAnimation);
  const setPosition = useOwlStore((s) => s.setPosition);
  const setIsVisible = useOwlStore((s) => s.setIsVisible);
  const setIsFlying = useOwlStore((s) => s.setIsFlying);

  const flyIn = () => {
    setCurrentAnimation("fly-in");
    setIsFlying(true);
    setIsVisible(true);
  };

  const idle = () => {
    setCurrentAnimation("idle");
    setIsFlying(false);
  };

  const hide = () => {
    setCurrentAnimation("none");
    setIsVisible(false);
    setIsFlying(false);
  };

  return {
    currentAnimation,
    position,
    isVisible,
    isFlying,
    flyIn,
    idle,
    hide,
    setPosition,
  };
};
