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

      decrease: (title) =>
        set((state) => {
          const current = state.quantities[title] || 0;
          const updated = current > 1 ? current - 1 : 0;

          return {
            quantities: {
              ...state.quantities,
              [title]: updated,
            },
          };
        }),
    }),
    {
      name: 'cookie-store', // key in localStorage
    }
  )
);

export default useCookieStore;
