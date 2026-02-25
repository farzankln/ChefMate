import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`);
    }
    return res.json();
  });

export function useSavedPosts() {
  const { data, error, isLoading, mutate } = useSWR(
    "/api/saved-posts",
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnMount: true,
      revalidateOnReconnect: true,
    },
  );

  return {
    savedPosts: data || [],
    isLoading,
    isError: error,
    mutate,
  };
}
