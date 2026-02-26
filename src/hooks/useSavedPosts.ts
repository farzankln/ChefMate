import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useSavedPosts() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/saved-posts",
    fetcher
  );

  return {
    savedPosts: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
