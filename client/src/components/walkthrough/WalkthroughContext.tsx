import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { driver, Driver } from 'driver.js';
import 'driver.js/dist/driver.css';
import confetti from 'canvas-confetti';
import { useLocation } from 'wouter';
import { tourFlows, traceabilityDetailSteps, TourFlowType, TourStep, getFlowById } from './tourFlows';

interface WalkthroughContextType {
  isModalOpen: boolean;
  isLotSearchOpen: boolean;
  currentFlow: TourFlowType | null;
  openModal: () => void;
  closeModal: () => void;
  openLotSearch: () => void;
  closeLotSearch: () => void;
  startTour: (flowId: TourFlowType, lotId?: string) => void;
  endTour: () => void;
}

const WalkthroughContext = createContext<WalkthroughContextType | null>(null);

export function useWalkthrough() {
  const context = useContext(WalkthroughContext);
  if (!context) {
    throw new Error('useWalkthrough must be used within WalkthroughProvider');
  }
  return context;
}

interface WalkthroughProviderProps {
  children: ReactNode;
}

export function WalkthroughProvider({ children }: WalkthroughProviderProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLotSearchOpen, setIsLotSearchOpen] = useState(false);
  const [currentFlow, setCurrentFlow] = useState<TourFlowType | null>(null);
  const [driverInstance, setDriverInstance] = useState<Driver | null>(null);
  const [, navigate] = useLocation();

  const openModal = useCallback(() => setIsModalOpen(true), []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);
  const openLotSearch = useCallback(() => setIsLotSearchOpen(true), []);
  const closeLotSearch = useCallback(() => setIsLotSearchOpen(false), []);

  const triggerConfetti = useCallback(() => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'],
    });
  }, []);

  const endTour = useCallback(() => {
    if (driverInstance) {
      driverInstance.destroy();
      setDriverInstance(null);
    }
    setCurrentFlow(null);
  }, [driverInstance]);

  const startTour = useCallback(async (flowId: TourFlowType, lotId?: string) => {
    closeModal();
    closeLotSearch();
    setCurrentFlow(flowId);

    const flow = getFlowById(flowId);
    if (!flow) return;

    // Build steps, adding traceability detail steps if needed
    let steps = [...flow.steps];
    
    if (flowId === 'traceability' && lotId) {
      // Add navigation to specific lot and detail steps
      const detailSteps = traceabilityDetailSteps.map(step => ({
        ...step,
        navigateTo: step === traceabilityDetailSteps[0] ? `/trazabilidad/${lotId}` : undefined,
        delay: step === traceabilityDetailSteps[0] ? 500 : undefined,
      }));
      steps = [...steps, ...detailSteps];
    }

    // Process steps with navigation
    const processSteps = async () => {
      const driverObj = driver({
        showProgress: true,
        animate: true,
        smoothScroll: true,
        allowClose: true,
        overlayColor: 'rgba(0, 0, 0, 0.7)',
        stagePadding: 10,
        stageRadius: 8,
        popoverClass: 'walkthrough-popover',
        progressText: 'Paso {{current}} de {{total}}',
        nextBtnText: 'Siguiente',
        prevBtnText: 'Anterior',
        doneBtnText: '¡Terminado!',
        onDestroyed: () => {
          triggerConfetti();
          setCurrentFlow(null);
          setDriverInstance(null);
        },
        steps: steps.map((step, index) => ({
          element: step.element,
          popover: {
            title: step.popover.title,
            description: step.popover.description,
            side: step.popover.side,
            align: step.popover.align,
            onNextClick: async () => {
              const nextStep = steps[index + 1];
              if (nextStep?.navigateTo) {
                navigate(nextStep.navigateTo);
                // Wait for navigation and page load
                await new Promise(resolve => setTimeout(resolve, nextStep.delay || 300));
              }
              driverObj.moveNext();
            },
          },
        })),
      });

      setDriverInstance(driverObj);

      // Navigate to first step if needed
      const firstStepWithNav = steps.find(s => s.navigateTo);
      if (firstStepWithNav?.navigateTo && steps.indexOf(firstStepWithNav) === 0) {
        navigate(firstStepWithNav.navigateTo);
        await new Promise(resolve => setTimeout(resolve, firstStepWithNav.delay || 300));
      }

      driverObj.drive();
    };

    // Small delay to let modal close
    setTimeout(processSteps, 300);
  }, [closeModal, closeLotSearch, navigate, triggerConfetti]);

  return (
    <WalkthroughContext.Provider
      value={{
        isModalOpen,
        isLotSearchOpen,
        currentFlow,
        openModal,
        closeModal,
        openLotSearch,
        closeLotSearch,
        startTour,
        endTour,
      }}
    >
      {children}
    </WalkthroughContext.Provider>
  );
}

