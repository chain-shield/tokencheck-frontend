// Mock the toast hook
export const toast = jest.fn();

// Mock the useToast hook
export const useToast = () => ({
  toast,
});
