import { create } from 'zustand';

interface ModalState {
  open: boolean;
  type: 'delete' | 'logout' | 'unsaved' | 'timeout' | 'success' | 'warning' | 'info' | 'error' | null;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface OnboardingStep {
  targetSelector: string;
  title: string;
  content: string;
  placement: 'top' | 'bottom' | 'left' | 'right';
}

interface UiState {
  // Drawers
  isNotificationDrawerOpen: boolean;
  isProfileDrawerOpen: boolean;
  setNotificationDrawer: (open: boolean) => void;
  setProfileDrawer: (open: boolean) => void;

  // Modals
  modal: ModalState;
  showModal: (modal: Omit<ModalState, 'open'>) => void;
  closeModal: () => void;

  // Help Overlay
  isHelpOverlayOpen: boolean;
  setHelpOverlay: (open: boolean) => void;
  isBugReportOpen: boolean;
  setBugReport: (open: boolean) => void;

  // Onboarding
  isOnboardingActive: boolean;
  onboardingStep: number;
  onboardingSteps: OnboardingStep[];
  startOnboarding: () => void;
  nextOnboardingStep: () => void;
  prevOnboardingStep: () => void;
  completeOnboarding: () => void;

  // Connection & Server Status
  isOffline: boolean;
  setOffline: (offline: boolean) => void;
  hasNetworkError: boolean;
  setNetworkError: (error: boolean) => void;
  isMaintenanceMode: boolean;
  setMaintenanceMode: (maintenance: boolean) => void;
}

export const useUiStore = create<UiState>((set, get) => ({
  // Drawers
  isNotificationDrawerOpen: false,
  isProfileDrawerOpen: false,
  setNotificationDrawer: (open) => set({ isNotificationDrawerOpen: open }),
  setProfileDrawer: (open) => set({ isProfileDrawerOpen: open }),

  // Modals
  modal: {
    open: false,
    type: null,
    title: '',
    description: '',
  },
  showModal: (modalConfig) => set({
    modal: {
      ...modalConfig,
      open: true,
    },
  }),
  closeModal: () => set((state) => ({
    modal: {
      ...state.modal,
      open: false,
    },
  })),

  // Help & Bug
  isHelpOverlayOpen: false,
  setHelpOverlay: (open) => set({ isHelpOverlayOpen: open }),
  isBugReportOpen: false,
  setBugReport: (open) => set({ isBugReportOpen: open }),

  // Onboarding
  isOnboardingActive: false,
  onboardingStep: 0,
  onboardingSteps: [
    {
      targetSelector: '[aria-label="Open sidebar"], aside',
      title: 'Welcome to PeopleFlow!',
      content: 'Let\'s take a 1-minute tour. This is your sidebar containing all navigation tools and HR management sections.',
      placement: 'right',
    },
    {
      targetSelector: 'header button:nth-child(2), [placeholder*="Search"]',
      title: 'Universal Command Search',
      content: 'Need to jump somewhere fast? Press Ctrl+K or Cmd+K to launch search. You can search employees, logs, leaves, or trigger quick actions.',
      placement: 'bottom',
    },
    {
      targetSelector: '[aria-label="Notifications"]',
      title: 'Notifications Drawer',
      content: 'Click the bell to slide out your real-time notification drawer. Keep track of approvals, payroll generation, and audit logs.',
      placement: 'bottom',
    },
    {
      targetSelector: 'header .relative:last-child button',
      title: 'Quick Profile & Options',
      content: 'Click your avatar to open Settings, view your personal profile details, or access the Quick Profile drawer.',
      placement: 'bottom',
    },
  ],
  startOnboarding: () => set({ isOnboardingActive: true, onboardingStep: 0 }),
  nextOnboardingStep: () => {
    const { onboardingStep, onboardingSteps } = get();
    if (onboardingStep < onboardingSteps.length - 1) {
      set({ onboardingStep: onboardingStep + 1 });
    } else {
      get().completeOnboarding();
    }
  },
  prevOnboardingStep: () => {
    const { onboardingStep } = get();
    if (onboardingStep > 0) {
      set({ onboardingStep: onboardingStep - 1 });
    }
  },
  completeOnboarding: () => {
    localStorage.setItem('peopleflow-onboarded', 'true');
    set({ isOnboardingActive: false, onboardingStep: 0 });
  },

  // Connection status
  isOffline: !navigator.onLine,
  setOffline: (offline) => set({ isOffline: offline }),
  hasNetworkError: false,
  setNetworkError: (error) => set({ hasNetworkError: error }),
  isMaintenanceMode: false,
  setMaintenanceMode: (maintenance) => set({ isMaintenanceMode: maintenance }),
}));
