/**
 * useApi Hook - Generic API data fetching hook
 * 
 * Provides React hooks for API data fetching with:
 * - Loading state management
 * - Error handling
 * - Automatic refetching
 * - Request cancellation
 */

'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ApiError, RequestState, createInitialRequestState } from '@/lib/api';

// ============================================================================
// useApi - Single request hook
// ============================================================================

interface UseApiOptions<T> {
    /** Whether to fetch immediately on mount */
    immediate?: boolean;
    /** Dependencies that trigger refetch */
    dependencies?: unknown[];
    /** Initial data value */
    initialData?: T;
    /** Callback on success */
    onSuccess?: (data: T) => void;
    /** Callback on error */
    onError?: (error: ApiError) => void;
}

/**
 * Generic hook for API requests
 * 
 * @example
 * ```tsx
 * const { data, isLoading, error, execute } = useApi(
 *   () => coursesService.getCourses(),
 *   { immediate: true }
 * );
 * ```
 */
export function useApi<T>(
    fetcher: () => Promise<T>,
    options: UseApiOptions<T> = {}
): RequestState<T> & {
    execute: () => Promise<T | null>;
    reset: () => void;
} {
    const {
        immediate = false,
        dependencies = [],
        initialData = null,
        onSuccess,
        onError,
    } = options;

    const [state, setState] = useState<RequestState<T>>({
        ...createInitialRequestState<T>(),
        data: initialData as T | null,
    });

    const isMountedRef = useRef(true);
    const abortControllerRef = useRef<AbortController | null>(null);

    const execute = useCallback(async (): Promise<T | null> => {
        // Cancel any in-flight request
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        setState(prev => ({
            ...prev,
            isLoading: true,
            error: null,
        }));

        try {
            const data = await fetcher();

            if (isMountedRef.current) {
                setState({
                    data,
                    isLoading: false,
                    error: null,
                    isSuccess: true,
                    isError: false,
                });
                onSuccess?.(data);
            }

            return data;
        } catch (error) {
            const apiError = error instanceof ApiError
                ? error
                : new ApiError(
                    error instanceof Error ? error.message : 'Unknown error',
                    500
                );

            if (isMountedRef.current) {
                setState({
                    data: null,
                    isLoading: false,
                    error: apiError,
                    isSuccess: false,
                    isError: true,
                });
                onError?.(apiError);
            }

            return null;
        }
    }, [fetcher, onSuccess, onError]);

    const reset = useCallback(() => {
        setState({
            ...createInitialRequestState<T>(),
            data: initialData as T | null,
        });
    }, [initialData]);

    // Fetch on mount if immediate
    useEffect(() => {
        if (immediate) {
            execute();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [immediate, ...dependencies]);

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            abortControllerRef.current?.abort();
        };
    }, []);

    return { ...state, execute, reset };
}

// ============================================================================
// useMutation - For POST/PUT/DELETE operations
// ============================================================================

interface UseMutationOptions<T, V> {
    /** Callback on success */
    onSuccess?: (data: T, variables: V) => void;
    /** Callback on error */
    onError?: (error: ApiError, variables: V) => void;
    /** Callback when mutation completes (success or error) */
    onSettled?: (data: T | null, error: ApiError | null, variables: V) => void;
}

interface MutationState<T> {
    data: T | null;
    isLoading: boolean;
    error: ApiError | null;
    isSuccess: boolean;
    isError: boolean;
}

/**
 * Hook for mutating data (POST, PUT, DELETE)
 * 
 * @example
 * ```tsx
 * const { mutate, isLoading } = useMutation(
 *   (data) => authService.login(data.email, data.password),
 *   { onSuccess: (data) => router.push('/dashboard') }
 * );
 * 
 * // Later: mutate({ email, password })
 * ```
 */
export function useMutation<T, V = void>(
    mutationFn: (variables: V) => Promise<T>,
    options: UseMutationOptions<T, V> = {}
): MutationState<T> & {
    mutate: (variables: V) => Promise<T | null>;
    mutateAsync: (variables: V) => Promise<T>;
    reset: () => void;
} {
    const { onSuccess, onError, onSettled } = options;

    const [state, setState] = useState<MutationState<T>>({
        data: null,
        isLoading: false,
        error: null,
        isSuccess: false,
        isError: false,
    });

    const isMountedRef = useRef(true);

    const mutateAsync = useCallback(async (variables: V): Promise<T> => {
        setState(prev => ({
            ...prev,
            isLoading: true,
            error: null,
        }));

        try {
            const data = await mutationFn(variables);

            if (isMountedRef.current) {
                setState({
                    data,
                    isLoading: false,
                    error: null,
                    isSuccess: true,
                    isError: false,
                });
                onSuccess?.(data, variables);
                onSettled?.(data, null, variables);
            }

            return data;
        } catch (error) {
            const apiError = error instanceof ApiError
                ? error
                : new ApiError(
                    error instanceof Error ? error.message : 'Unknown error',
                    500
                );

            if (isMountedRef.current) {
                setState({
                    data: null,
                    isLoading: false,
                    error: apiError,
                    isSuccess: false,
                    isError: true,
                });
                onError?.(apiError, variables);
                onSettled?.(null, apiError, variables);
            }

            throw apiError;
        }
    }, [mutationFn, onSuccess, onError, onSettled]);

    const mutate = useCallback(async (variables: V): Promise<T | null> => {
        try {
            return await mutateAsync(variables);
        } catch {
            return null;
        }
    }, [mutateAsync]);

    const reset = useCallback(() => {
        setState({
            data: null,
            isLoading: false,
            error: null,
            isSuccess: false,
            isError: false,
        });
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return { ...state, mutate, mutateAsync, reset };
}

// ============================================================================
// useInfiniteScroll - For paginated data
// ============================================================================

interface UseInfiniteScrollOptions<T> {
    /** Initial page number */
    initialPage?: number;
    /** Items per page */
    pageSize?: number;
    /** Whether to fetch immediately */
    immediate?: boolean;
    /** Callback when data is fetched */
    onSuccess?: (data: T[]) => void;
}

interface InfiniteScrollState<T> {
    items: T[];
    isLoading: boolean;
    isLoadingMore: boolean;
    error: ApiError | null;
    hasNextPage: boolean;
    page: number;
}

/**
 * Hook for infinite scroll pagination
 * 
 * @example
 * ```tsx
 * const { items, isLoading, loadMore, hasNextPage } = useInfiniteScroll(
 *   (page) => coursesService.getCourses({ page: String(page) }),
 *   { pageSize: 10 }
 * );
 * ```
 */
export function useInfiniteScroll<T>(
    fetcher: (page: number) => Promise<{ items: T[]; total: number }>,
    options: UseInfiniteScrollOptions<T> = {}
): InfiniteScrollState<T> & {
    loadMore: () => Promise<void>;
    reset: () => void;
    refresh: () => Promise<void>;
} {
    const {
        initialPage = 1,
        pageSize = 10,
        immediate = true,
        onSuccess,
    } = options;

    const [state, setState] = useState<InfiniteScrollState<T>>({
        items: [],
        isLoading: false,
        isLoadingMore: false,
        error: null,
        hasNextPage: true,
        page: initialPage,
    });

    const isMountedRef = useRef(true);

    const fetchPage = useCallback(async (page: number, append: boolean = false) => {
        setState(prev => ({
            ...prev,
            isLoading: !append,
            isLoadingMore: append,
            error: null,
        }));

        try {
            const result = await fetcher(page);

            if (isMountedRef.current) {
                const newItems = append
                    ? [...state.items, ...result.items]
                    : result.items;

                setState({
                    items: newItems,
                    isLoading: false,
                    isLoadingMore: false,
                    error: null,
                    hasNextPage: newItems.length < result.total,
                    page,
                });

                onSuccess?.(result.items);
            }
        } catch (error) {
            const apiError = error instanceof ApiError
                ? error
                : new ApiError(
                    error instanceof Error ? error.message : 'Unknown error',
                    500
                );

            if (isMountedRef.current) {
                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    isLoadingMore: false,
                    error: apiError,
                }));
            }
        }
    }, [fetcher, state.items, onSuccess]);

    const loadMore = useCallback(async () => {
        if (state.hasNextPage && !state.isLoadingMore) {
            await fetchPage(state.page + 1, true);
        }
    }, [fetchPage, state.hasNextPage, state.isLoadingMore, state.page]);

    const reset = useCallback(() => {
        setState({
            items: [],
            isLoading: false,
            isLoadingMore: false,
            error: null,
            hasNextPage: true,
            page: initialPage,
        });
    }, [initialPage]);

    const refresh = useCallback(async () => {
        reset();
        await fetchPage(initialPage, false);
    }, [reset, fetchPage, initialPage]);

    // Initial fetch
    useEffect(() => {
        if (immediate) {
            fetchPage(initialPage, false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [immediate]);

    // Cleanup
    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
        };
    }, []);

    return { ...state, loadMore, reset, refresh };
}
