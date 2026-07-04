import { useEffect, useState, useRef } from 'react';
import { Sparkles, X, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { useUiStore } from '@/stores/uiStore';

export function OnboardingTour() {
  const {
    isOnboardingActive,
    onboardingStep,
    onboardingSteps,
    nextOnboardingStep,
    prevOnboardingStep,
    completeOnboarding,
  } = useUiStore();

  const [coords, setCoords] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const activeStep = onboardingSteps[onboardingStep];
  const resizeTimer = useRef<ReturnType<typeof setTimeout>>();

  // Update coords based on target element selector
  const updateStepPosition = () => {
    if (!isOnboardingActive || !activeStep) return;
    const element = document.querySelector(activeStep.targetSelector);
    if (element) {
      const rect = element.getBoundingClientRect();
      setCoords({
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
        height: rect.height,
      });
      // Scroll target into view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      setCoords(null);
    }
  };

  useEffect(() => {
    updateStepPosition();
    // Setup resize listeners to keep tooltip aligned
    const handleResize = () => {
      clearTimeout(resizeTimer.current);
      resizeTimer.current = setTimeout(updateStepPosition, 100);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleResize);
    };
  }, [isOnboardingActive, onboardingStep]);

  if (!isOnboardingActive || !activeStep || !coords) return null;

  const isLast = onboardingStep === onboardingSteps.length - 1;

  // Determine tooltip style coordinates
  const getTooltipStyle = (): React.CSSProperties => {
    const space = 12;
    const tooltipWidth = 320;
    const tooltipHeight = 180; // Estimated

    switch (activeStep.placement) {
      case 'right':
        return {
          top: coords.top + coords.height / 2 - tooltipHeight / 2,
          left: coords.left + coords.width + space,
        };
      case 'left':
        return {
          top: coords.top + coords.height / 2 - tooltipHeight / 2,
          left: coords.left - tooltipWidth - space,
        };
      case 'bottom':
        return {
          top: coords.top + coords.height + space,
          left: coords.left + coords.width / 2 - tooltipWidth / 2,
        };
      case 'top':
      default:
        return {
          top: coords.top - tooltipHeight - space,
          left: coords.left + coords.width / 2 - tooltipWidth / 2,
        };
    }
  };

  return (
    <div className="absolute inset-0 z-[999] pointer-events-none">
      {/* Target Focus Border Highlight */}
      <div
        className="absolute border-2 border-plum rounded-2xl shadow-pulse transition-all duration-300 pointer-events-auto"
        style={{
          top: coords.top - 4,
          left: coords.left - 4,
          width: coords.width + 8,
          height: coords.height + 8,
        }}
      />

      {/* Floating Tooltip Box */}
      <div
        className="absolute bg-surface rounded-2xl border border-border shadow-modal p-5 space-y-4 pointer-events-auto animate-fade-in w-80 z-[1000] border-l-4 border-l-plum"
        style={getTooltipStyle()}
      >
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-plum animate-pulse" />
            <h4 className="text-xs font-bold text-text-primary uppercase tracking-wider">{activeStep.title}</h4>
          </div>
          <button
            onClick={completeOnboarding}
            className="p-1 rounded-lg hover:bg-background text-text-secondary hover:text-text-primary transition-colors"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content */}
        <p className="text-xs text-text-secondary leading-relaxed">
          {activeStep.content}
        </p>

        {/* Footer controls */}
        <div className="flex justify-between items-center pt-2">
          {/* Progress dots */}
          <div className="flex gap-1">
            {onboardingSteps.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  i === onboardingStep ? 'bg-plum w-3' : 'bg-border'
                }`}
              />
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex gap-2">
            {onboardingStep > 0 && (
              <button
                onClick={prevOnboardingStep}
                className="btn-ghost p-1.5 rounded-lg text-text-secondary hover:text-text-primary"
                title="Previous"
              >
                <ChevronLeft size={16} />
              </button>
            )}
            <button
              onClick={isLast ? completeOnboarding : nextOnboardingStep}
              className="btn-primary text-xs py-1.5 px-3 rounded-lg font-bold flex items-center gap-1 text-white bg-plum hover:bg-plum/90 shadow-sm shadow-plum-150"
            >
              {isLast ? (
                <>
                  <Check size={13} />
                  Finish
                </>
              ) : (
                <>
                  Next
                  <ChevronRight size={13} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
