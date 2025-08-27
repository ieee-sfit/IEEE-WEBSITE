import { useEffect, useRef, useState } from 'react';

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  delay?: number;
}

export const useScrollAnimation = ({
  threshold = 0.1,
  rootMargin = '0px 0px -50px 0px',
  triggerOnce = true,
  delay = 0
}: UseScrollAnimationOptions = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (delay > 0) {
            setTimeout(() => setIsVisible(true), delay);
          } else {
            setIsVisible(true);
          }
          
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, delay]);

  return { ref, isVisible };
};

// Hook for staggered animations
export const useStaggeredAnimation = (
  itemCount: number,
  staggerDelay: number = 100
) => {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Trigger items one by one with stagger delay
          Array.from({ length: itemCount }).forEach((_, index) => {
            setTimeout(() => {
              setVisibleItems(prev => {
                const newVisible = [...prev];
                newVisible[index] = true;
                return newVisible;
              });
            }, index * staggerDelay);
          });
          
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [itemCount, staggerDelay]);

  return { ref, visibleItems };
};

// Hook for counter animations
export const useCounterAnimation = (
  endValue: number,
  duration: number = 2000,
  startValue: number = 0
) => {
  const [count, setCount] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const ref = useRef<HTMLElement>(null);

  const startAnimation = () => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    const increment = (endValue - startValue) / (duration / 16); // 60fps
    let currentValue = startValue;

    const timer = setInterval(() => {
      currentValue += increment;
      if (currentValue >= endValue) {
        setCount(endValue);
        clearInterval(timer);
        setIsAnimating(false);
      } else {
        setCount(Math.floor(currentValue));
      }
    }, 16);

    return () => clearInterval(timer);
  };

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startAnimation();
          observer.unobserve(element);
        }
      },
      {
        threshold: 0.5,
        rootMargin: '0px',
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [endValue, duration, startValue]);

  return { ref, count, isAnimating };
};

// Hook for scroll-triggered class toggling
export const useScrollClass = (className: string, options?: UseScrollAnimationOptions) => {
  const { ref, isVisible } = useScrollAnimation(options);
  
  useEffect(() => {
    if (ref.current) {
      if (isVisible) {
        ref.current.classList.add(className);
      } else {
        ref.current.classList.remove(className);
      }
    }
  }, [isVisible, className]);

  return ref;
};
