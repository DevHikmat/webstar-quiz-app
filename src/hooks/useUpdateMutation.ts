import { useMutation } from '@tanstack/react-query';
import { message } from 'antd';

interface UseUpdateMutationOptions<T> {
  entityName?: string; 
  mutationFn: (id: string, updatedData: Partial<T>) => Promise<any>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function useUpdateMutation<T>(
  id: string | undefined,
  options: UseUpdateMutationOptions<T>
) {
  return useMutation({
    mutationFn: (updatedData: Partial<T>) => {
      if (!id) throw new Error('ID mavjud emas');
      return options.mutationFn(id, updatedData);
    },
    onSuccess: () => {
      message.success(
        `${options.entityName ?? 'Maʼlumot'} muvaffaqiyatli yangilandi.`
      );
      options.onSuccess?.();
    },
    onError: (error: Error) => {
      message.error(
        `${options.entityName ?? 'Maʼlumot'}ni o‘zgartirishda xatolik: ${error.message}`
      );
      options.onError?.(error);
    },
  });
}
