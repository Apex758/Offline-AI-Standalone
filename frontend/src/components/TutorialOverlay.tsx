import React, { useState, useEffect, useRef } from 'react';
import { HelpCircle, X, ChevronLeft, ChevronRight } from 'lucide-react';

export interface TutorialStep {
  target: string;
  title: string;
  description: string;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
  interactive?: boolean;
  waitForAction?: string;
  actionHint?: string;
  clickTarget?: string;
  className?: string;
}

interface TutorialOverlayProps {
  steps: TutorialStep[];
  onComplete?: () => void;
  autoStart?: boolean;
  onStepChange?: (step: number) => void;
  showFloatingButton?: boolean;
  isSplitViewActive?: boolean;
}


export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  steps,
  onComplete,
  autoStart = false,
  onStepChange,
  showFloatingButton = true,
  isSplitViewActive = false
}) => {


  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(autoStart);
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<React.CSSProperties>({});
  const [waitingForAction, setWaitingForAction] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const highlightedElementRef = useRef<Element | null>(null);

  useEffect(() => {
    if (!isActive || !steps[currentStep]) return;

    const updateHighlight = () => {
      const element = document.querySelector(steps[currentStep].target);
      if (element) {
        highlightedElementRef.current = element;
        const rect = element.getBoundingClientRect();
        setHighlightRect(rect);
        
        // Set up action listeners if this step requires user interaction
        const step = steps[currentStep];
        if (step.interactive && step.waitForAction) {
          setWaitingForAction(true);
          
          if (step.waitForAction === 'click') {
            const clickHandler = () => {
              setTimeout(() => {
                updateHighlight();
              }, 100);
              
              setTimeout(() => {
                setWaitingForAction(false);
                handleNext();
              }, 300);
            };
            element.addEventListener('click', clickHandler, { once: true });
            
            return () => element.removeEventListener('click', clickHandler);
          }
        }
        
        // Find the scrollable parent container
        const getScrollParent = (node: HTMLElement | null): HTMLElement | null => {
          if (!node) return null;
          
          const overflowY = window.getComputedStyle(node).overflowY;
          const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';
          
          if (isScrollable && node.scrollHeight > node.clientHeight) {
            return node;
          }
          
          return getScrollParent(node.parentElement);
        };
        
        const scrollParent = getScrollParent(element as HTMLElement);
        
        // Check if element is fully visible within its scroll container
        if (scrollParent) {
          const scrollParentRect = scrollParent.getBoundingClientRect();
          const isInView = 
            rect.top >= scrollParentRect.top + 80 &&
            rect.bottom <= scrollParentRect.bottom - 80;
          
          if (!isInView) {
            // Scroll within the container only
            const elementTop = (element as HTMLElement).offsetTop;
            const scrollParentHeight = scrollParent.clientHeight;
            const elementHeight = (element as HTMLElement).offsetHeight;
            
            const centerPosition = elementTop - (scrollParentHeight / 2) + (elementHeight / 2);
            
            scrollParent.scrollTo({
              top: centerPosition,
              behavior: 'smooth'
            });
          }
        }
      }
    };

    const debouncedUpdate = () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      updateTimeoutRef.current = setTimeout(updateHighlight, 150);
    };

    // Initial update (immediate)
    updateHighlight();
    
    // Delayed update for animations
    setTimeout(updateHighlight, 350);
    
    // Use ResizeObserver to detect layout changes (debounced)
    const resizeObserver = new ResizeObserver(debouncedUpdate);
    resizeObserver.observe(document.body);
    
    // Traditional event listeners (debounced)
    window.addEventListener('resize', debouncedUpdate);
    
    // Listen to scroll events only on scrollable containers, not window
    const scrollableContainers = document.querySelectorAll('[class*="overflow-y-auto"]');
    scrollableContainers.forEach(container => {
      container.addEventListener('scroll', debouncedUpdate);
    });

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      resizeObserver.disconnect();
      window.removeEventListener('resize', debouncedUpdate);
      scrollableContainers.forEach(container => {
        container.removeEventListener('scroll', debouncedUpdate);
      });
    };
  }, [currentStep, isActive, steps]);

  // Helper function to calculate optimal tooltip position
  const calculateOptimalPosition = (
    highlightRect: DOMRect,
    tooltipWidth: number,
    tooltipHeight: number
  ): { position: string; style: React.CSSProperties } => {
    const step = steps[currentStep];

    // ⬇️ HARD OVERRIDE: center tooltip on the spotlight cutout
    if (step.position === 'center') {
      return {
        position: 'center',
        style: {
          top: `${highlightRect.top + highlightRect.height / 2}px`,
          left: `${highlightRect.left + highlightRect.width / 2}px`,
          transform: 'translate(-50%, -50%)',
        },
      };
    }

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const spacing = 24; // Consistent spacing from highlighted element
    const margin = 20; // Minimum margin from viewport edges

    // Calculate available space in all directions
    const spaceRight = viewportWidth - highlightRect.right - margin;
    const spaceLeft = highlightRect.left - margin;
    const spaceBottom = viewportHeight - highlightRect.bottom - margin;
    const spaceTop = highlightRect.top - margin;

    // Calculate center points for alignment
    const highlightCenterX = highlightRect.left + highlightRect.width / 2;
    const highlightCenterY = highlightRect.top + highlightRect.height / 2;

    // Try positions in priority order: right → bottom → left → top
    const positions = [
      {
        name: 'right',
        fits: spaceRight >= tooltipWidth + spacing,
        style: {
          left: `${highlightRect.right + spacing}px`,
          top: `${Math.max(margin, Math.min(highlightCenterY - tooltipHeight / 2, viewportHeight - tooltipHeight - margin))}px`,
        }
      },
      {
        name: 'bottom',
        fits: spaceBottom >= tooltipHeight + spacing,
        style: {
          top: `${highlightRect.bottom + spacing}px`,
          left: `${Math.max(margin, Math.min(highlightCenterX - tooltipWidth / 2, viewportWidth - tooltipWidth - margin))}px`,
        }
      },
      {
        name: 'left',
        fits: spaceLeft >= tooltipWidth + spacing,
        style: {
          right: `${viewportWidth - highlightRect.left + spacing}px`,
          top: `${Math.max(margin, Math.min(highlightCenterY - tooltipHeight / 2, viewportHeight - tooltipHeight - margin))}px`,
        }
      },
      {
        name: 'top',
        fits: spaceTop >= tooltipHeight + spacing,
        style: {
          bottom: `${viewportHeight - highlightRect.top + spacing}px`,
          left: `${Math.max(margin, Math.min(highlightCenterX - tooltipWidth / 2, viewportWidth - tooltipWidth - margin))}px`,
        }
      }
    ];

    // Check if preferred position from step configuration fits
    const preferredPosition = step.position || 'bottom';
    const preferred = positions.find(p => p.name === preferredPosition);
    
    if (preferred && preferred.fits) {
      return { position: preferred.name, style: preferred.style };
    }

    // Otherwise, find first position that fits
    const bestFit = positions.find(p => p.fits);
    if (bestFit) {
      return { position: bestFit.name, style: bestFit.style };
    }

    // Fallback: use position with most space, constrained to viewport
    const spacesWithNames = [
      { name: 'right', space: spaceRight },
      { name: 'bottom', space: spaceBottom },
      { name: 'left', space: spaceLeft },
      { name: 'top', space: spaceTop }
    ];
    const maxSpace = spacesWithNames.reduce((max, current) =>
      current.space > max.space ? current : max
    );
    
    const fallback = positions.find(p => p.name === maxSpace.name)!;
    return { position: fallback.name, style: fallback.style };
  };

  // Separate effect for tooltip positioning to avoid jitter
  useEffect(() => {
    if (!tooltipRef.current) return;

    // ✅ CENTER TOOLTIP WHEN SPLIT VIEW IS ACTIVE
    if (isSplitViewActive) {
      setTooltipPosition({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      });
      return;
    }

    if (!highlightRect) return;

    const calculatePosition = () => {
      const tooltip = tooltipRef.current;
      if (!tooltip) return;

      const tooltipRect = tooltip.getBoundingClientRect();
      const { style } = calculateOptimalPosition(
        highlightRect,
        tooltipRect.width,
        tooltipRect.height
      );

      setTooltipPosition(style);
    };

    calculatePosition();
    const timeoutId = setTimeout(calculatePosition, 100);
    return () => clearTimeout(timeoutId);
  }, [highlightRect, currentStep, steps, isSplitViewActive]);


  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      // Check if current step has a clickTarget to trigger before moving
      const step = steps[currentStep];
      if (step.clickTarget) {
        const targetElement = document.querySelector(step.clickTarget);
        targetElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      }

      setHighlightRect(null);
      setTooltipPosition({});
      setWaitingForAction(false);
      setTimeout(() => {
        const nextStep = currentStep + 1;
        setCurrentStep(nextStep);
        onStepChange?.(nextStep);
      }, 100);
    } else {
      handleClose();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setHighlightRect(null);
      setWaitingForAction(false);
      setTimeout(() => {
        const prevStep = currentStep - 1;
        setCurrentStep(prevStep);
        onStepChange?.(prevStep); // Add this
      }, 100);
    }
  };

  const handleClose = () => {
    setIsActive(false);
    setCurrentStep(0);
    setTooltipPosition({});
    setWaitingForAction(false);
    
    // Scroll back to top of the scrollable container
    const scrollableContainers = document.querySelectorAll('[class*="overflow-y-auto"]');
    scrollableContainers.forEach(container => {
      if (container.scrollTop > 0) {
        container.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
      }
    });
    
    onComplete?.();
  };

  if (!isActive) {
    if (!showFloatingButton) {
      return null;
    }
    return (
      <button
        onClick={() => setIsActive(true)}
        data-tutorial="help-button" 
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-110 flex items-center justify-center z-[9998] group animate-bounce"
        title="Start Tutorial"
        style={{ animationDuration: '2s' }}
      >
        <HelpCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Dark overlay with spotlight cutout */}
      <div className={`absolute inset-0 ${steps[currentStep]?.interactive ? 'pointer-events-none' : ''}`}>
        <svg width="100%" height="100%" className="absolute inset-0">
          <defs>
            <mask id="spotlight-mask">
              <rect x="0" y="0" width="100%" height="100%" fill="white" />
              {highlightRect && !isSplitViewActive && (
                <rect
                  x={highlightRect.left - 8}
                  y={highlightRect.top - 8}
                  width={highlightRect.width + 16}
                  height={highlightRect.height + 16}
                  rx="8"
                  fill="black"
                />
              )}

            </mask>
          </defs>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="rgba(0, 0, 0, 0.75)"
            mask="url(#spotlight-mask)"
          />
        </svg>
      </div>

      {/* Highlighted element border with pulsing animation */}
      {highlightRect && (
        <>
          <div
            className={`absolute border-4 border-blue-500 rounded-lg pointer-events-none transition-all duration-300 ${
              waitingForAction ? 'animate-pulse' : ''
            }`}
            style={{
              left: `${highlightRect.left - 8}px`,
              top: `${highlightRect.top - 8}px`,
              width: `${highlightRect.width + 16}px`,
              height: `${highlightRect.height + 16}px`,
            }}
          />
          
          {/* Interactive click area - only render when NO specific clickTarget */}
          {steps[currentStep]?.interactive && !steps[currentStep]?.clickTarget && (
            <div
              className="absolute cursor-pointer z-[10000]"
              style={{
                left: `${highlightRect.left - 8}px`,
                top: `${highlightRect.top - 8}px`,
                width: `${highlightRect.width + 16}px`,
                height: `${highlightRect.height + 16}px`,
              }}
              onClick={() => {
                const step = steps[currentStep];
                if (step.waitForAction === 'click') {
                  let clickElement = highlightedElementRef.current;

                  if (step.clickTarget) {
                    const specificTarget = document.querySelector(step.clickTarget);
                    if (specificTarget) {
                      clickElement = specificTarget;
                    }
                  }

                  clickElement?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
                }
              }}
            />
          )}
        </>
      )}

      {/* Action hint for interactive steps */}
      {waitingForAction && steps[currentStep]?.actionHint && highlightRect && (
        <div
          className="absolute bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium animate-bounce shadow-lg z-[10001]"
          style={{
            left: `${highlightRect.left + highlightRect.width / 2}px`,
            top: `${highlightRect.top - 50}px`,
            transform: 'translateX(-50%)',
          }}
        >
          {steps[currentStep].actionHint}
        </div>
      )}

      {/* Tooltip */}
      {highlightRect && (
      <div
        ref={tooltipRef}
        className={`absolute bg-white rounded-xl shadow-2xl p-6 max-w-md w-full sm:w-96 z-[10002] transition-all duration-200 max-h-[80vh] overflow-y-auto animate-fadeIn ${steps[currentStep]?.className || ''}`}
        style={tooltipPosition}
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <div className="pr-8">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {steps[currentStep].title}
            </h3>
            <p className="text-gray-600 mb-4">{steps[currentStep].description}</p>

            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Step {currentStep + 1} of {steps.length}
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={currentStep === 0 }
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </button>
                <button
                  onClick={handleNext}
                  disabled={waitingForAction}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {currentStep === steps.length - 1 ? 'Finish' : waitingForAction ? 'Waiting...' : 'Next'}
                  {currentStep < steps.length - 1 && !waitingForAction && <ChevronRight className="w-4 h-4 ml-1" />}
                </button>
              </div>
            </div>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1 mt-4 justify-center">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentStep
                    ? 'bg-blue-600 w-6'
                    : index < currentStep
                    ? 'bg-blue-400'
                    : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TutorialOverlay;

// Analytics Dashboard Tutorial Steps
export const analyticsDashboardSteps: TutorialStep[] = [
  {
    target: '[data-tutorial="welcome-header"]',
    title: 'Welcome to Your Dashboard! 👋',
    description: 'This is your teaching resource hub where you can see all your created content and quick stats at a glance.',
    position: 'bottom',
  },
  {
    target: '[data-tutorial="stat-cards"]',
    title: 'Resource Statistics',
    description: 'Here you can see the total count of all your teaching resources including lesson plans, rubrics, and quizzes.',
    position: 'bottom',
  },
  {
    target: '[data-tutorial="lesson-breakdown"]',
    title: 'Lesson Plan Breakdown',
    description: 'This chart shows the distribution of your different lesson plan types - Standard, Kindergarten, Multigrade, and Cross-Curricular.',
    position: 'right',
  },
  {
    target: '[data-tutorial="quick-stats"]',
    title: 'Quick Summary',
    description: 'View your resource summary and total creation statistics all in one place.',
    position: 'left',
  },
  {
    target: '[data-tutorial="curriculum-access"]',
    title: 'Quick Curriculum Access',
    description: 'Jump directly to any grade level curriculum with these quick access buttons.',
    position: 'top',
  },
  {
    target: '[data-tutorial="action-cards"]',
    title: 'Quick Actions',
    description: 'Use these cards to quickly create new resources or browse the curriculum. Click any card to get started!',
    position: 'top',
  },
];

// Main Dashboard Tutorial Steps (First-time user experience)
export const dashboardWalkthroughSteps: TutorialStep[] = [
  {
    target: '[data-tutorial="main-sidebar"]',
    title: 'Welcome to OECS Learning Hub! 🎓',
    description: 'This is your AI-powered teaching assistant sidebar. Here you\'ll find all the tools to create lesson plans, quizzes, rubrics, and more. The sidebar auto-collapses when you hover away to give you more workspace.',
    position: 'right',
  },
  {
    target: '[data-tutorial="tool-analytics"]',
    title: 'Dashboard Overview',
    description: 'Start here to see your teaching resources, statistics, and quick access to curriculum content. Click it now to open your first tab!',
    position: 'right',
    interactive: true,
    waitForAction: 'click',
    actionHint: '👆 Click here!',
  },
  {
    target: '[data-tutorial="tab-bar"]',
    title: 'Tab Management 📑',
    description: 'Great! You opened your first tab. Your open tools appear here. You can have up to 3 tabs of each type open simultaneously.',
    position: 'bottom',
  },
  {
    target: '[data-tutorial="single-tab-demo"]',
    title: 'Working with Tabs',
    description: 'Each tab shows your active tool. You can click the X to close a tab, or right-click to split it side-by-side with another tool.',
    position: 'bottom',
  },
  {
    target: '[data-tutorial="tool-chat"]',
    title: 'AI Chat Assistant',
    description: 'Let\'s open another tool! Chat with your AI teaching assistant for help, ideas, or to discuss your lesson plans. Go ahead and click to open it!',
    position: 'right',
    interactive: true,
    waitForAction: 'click',
    actionHint: '👆 Click to open!',
  },
  {
    target: '[data-tutorial="tab-bar"]',
    title: 'Multiple Different Tabs 📑',
    description: 'Excellent! Now you have two different tools open. Notice how each tab type has its own color. Let\'s explore what happens when you open multiple tabs of the SAME type...',
    position: 'bottom',
  },
  {
    target: '[data-tutorial="tool-chat"]',
    title: 'Open Another Chat Tab',
    description: 'Click the Chat tool again to open a second chat tab. This will demonstrate tab grouping!',
    position: 'right',
    interactive: true,
    waitForAction: 'click',
    actionHint: '👆 Click again!',
  },
  {
    target: '[data-tutorial="tab-groups"]',
    title: 'Tab Groups 📚',
    description: 'See how the two Chat tabs automatically grouped together? The dropdown arrow lets you collapse/expand the group. The group header shows which tool type it is.',
    position: 'bottom',
  },
  {
    target: '[data-tutorial="tab-groups"][data-group-type="chat"]',
    title: 'Collapse Groups',
    description: 'Click the dropdown arrow on the Chat group to collapse it and save tab bar space. Try it now!',
    position: 'bottom',
    interactive: true,
    waitForAction: 'click',
    actionHint: '👆 Click to collapse!',
    clickTarget: '[data-tutorial="tab-groups"][data-group-type="chat"] button',
  },
  {
    target: '[data-tutorial="tab-groups"][data-group-type="chat"]',
    title: 'Expand Groups',
    description: 'Perfect! Now click the arrow again to expand the group and see all your Chat tabs.',
    position: 'bottom',
    interactive: true,
    waitForAction: 'click',
    actionHint: '👆 Click to expand!',
    clickTarget: '[data-tutorial="tab-groups"][data-group-type="chat"] button',
  },
  {
    target: '[data-tab-type="analytics"]',
    title: 'Switch Between Tabs',
    description: 'You can click any tab to switch to it. Let\'s click back to the Dashboard tab to learn about split view.',
    position: 'bottom',
    interactive: true,
    waitForAction: 'click',
    actionHint: '👆 Click Dashboard!',
    clickTarget: '[data-tab-type="analytics"]', 
  },
  {
    target: '[data-tutorial="split-toggle"]',
    title: 'Split View 🔀',
    description:
      'Click this Split View button to work with two tools side-by-side. This is perfect for referencing content while creating lessons.',
    position: 'bottom',
    interactive: true,
    waitForAction: 'click',
    actionHint: '👆 Click Split View',
  },
  {
  target: '[data-tutorial="split-view-demo"]',
  title: 'Split View in Action 🎉',
  description:
    'Great! You are now in Split View. Each panel shows a different tool so you can work side-by-side.',
  position: 'center',
  },
  {
    target: '[data-tutorial="lesson-planners-group"]',
    title: 'Lesson Planner Tools 📚',
    description: 'Click this dropdown to expand and see different types of lesson planners: Standard, Kindergarten, Multigrade, and Cross-Curricular.',
    position: 'right',
    interactive: true,
    waitForAction: 'click',
    actionHint: '👆 Click to expand!',
    clickTarget: '[data-tutorial-click="lesson-planners-group"]',
  },
  {
    target: '[data-tutorial="tool-quiz"]',
    title: 'Quiz Generator',
    description: 'Quickly generate customized quizzes with multiple question types and cognitive levels.',
    position: 'right',
  },
  {
    target: '[data-tutorial="tool-rubric"]',
    title: 'Rubric Generator',
    description: 'Create detailed grading rubrics for any assignment with performance levels and criteria.',
    position: 'right',
  },
  {
    target: '[data-tutorial="close-all-tabs"]',
    title: 'Close All Tabs',
    description: 'Click this red X button to close all open tabs at once and start fresh. Give it a try!',
    position: 'bottom',
    interactive: true,
    waitForAction: 'click',
    className: 'p-4',
  },
  {
    target: '[data-tutorial="main-content"]',
    title: 'Your Workspace',
    description: 'This is your main workspace where your active tool or split view will appear. You\'re all set to create amazing teaching resources!',
    position: 'center',
  },

];