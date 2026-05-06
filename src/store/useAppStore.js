import { create } from 'zustand'

/**
 * Central app state — scroll progress, loader, active phase.
 * Keeps the scroll value in a store so any component can read it
 * without prop-drilling or context churn.
 */
const useAppStore = create((set) => ({
  // ── Loader
  loaderDone: false,
  setLoaderDone: () => set({ loaderDone: true }),

  // ── Hero scroll progress  (0 → 1)
  rawProg:    0,
  smoothProg: 0,
  setRawProg: (v)    => set({ rawProg: v }),
  setSmoothProg: (v) => set({ smoothProg: v }),

  // ── Active scroll phase (0 = intro, 1 = about, 2 = metrics)
  activePhase: 0,
  setActivePhase: (p) => set({ activePhase: p }),

  // ── Modal
  modalOpen:    false,
  modalProject: null,
  openModal:  (project) => set({ modalOpen: true,  modalProject: project }),
  closeModal: ()        => set({ modalOpen: false, modalProject: null }),

  // ── Navbar
  navScrolled: false,
  setNavScrolled: (v) => set({ navScrolled: v }),
}))

export default useAppStore
