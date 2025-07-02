import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCookieStore = create(
  persist(
    (set) => ({
      quantities: {},

      increase: (title) =>
        set((state) => ({
          quantities: {
            ...state.quantities,
            [title]: (state.quantities[title] || 0) + 1,
          },
        })),

      decrease: (title, forceRemove = false) =>
        set((state) => {
          if (forceRemove) {
            const updatedQuantities = { ...state.quantities };
            delete updatedQuantities[title]; // fully remove from state
            return { quantities: updatedQuantities };
          }

          const current = state.quantities[title] || 0;
          const updated = current > 1 ? current - 1 : 0;

          return {
            quantities: {
              ...state.quantities,
              [title]: updated,
            },
          };
        }),

      resetQuantities: () => set({ quantities: {} }),

    }),
    {
      name: 'cookie-store', // key in localStorage
    }
  )
);

export default useCookieStore;
