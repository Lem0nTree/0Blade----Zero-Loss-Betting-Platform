import { DependencyList, useCallback, useEffect, useState } from "react";

export default function useApi<T>(asyncFn: () => Promise<T>) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<T>();

  useEffect(() => {
    let status = { cancelled: false };
    setIsLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await asyncFn();
        if (!status.cancelled) {
          setData(data);
        }
      } catch (e) {
        if (!status.cancelled) {
          setError(e);
        }
      }
      if (!status.cancelled) {
        setIsLoading(false);
      }
    })();
    return () => {
      status.cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [asyncFn]);

  const loadUI = useCallback(
    (loadingUI, activeUI, errorUI) => {
      if (isLoading) {
        return loadingUI;
      }
      if (error) {
        return errorUI;
      }
      return activeUI;
    },
    [error, isLoading]
  );

  return {
    isLoading,
    error,
    data,
    loadUI,
  };
}

export function useDataApi<T>(asyncFn: () => Promise<T>, deps: DependencyList) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<T>();

  useEffect(() => {
    let status = { cancelled: false };
    setIsLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await asyncFn();
        if (!status.cancelled) {
          setData(data);
        }
      } catch (e) {
        if (!status.cancelled) {
          setError(e);
        }
      }
      if (!status.cancelled) {
        setIsLoading(false);
      }
    })();
    return () => {
      status.cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || [])]);

  const render = useCallback(
    (loadingUI, activeUI: (data: T) => JSX.Element, errorUI?: (err) => JSX.Element) => {
      if (isLoading) {
        return loadingUI;
      }
      if (error && errorUI) {
        return errorUI(error);
      }
      if (data !== undefined) {
        return activeUI(data);
      }
      return null;
    },
    [data, error, isLoading]
  );

  return {
    isLoading,
    data,
    render,
  };
}

export function useAsyncRender<T>(asyncFn: () => Promise<T>, deps: DependencyList) {
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [data, setData] = useState<T>();

  useEffect(() => {
    let status = { cancelled: false };
    setIsLoading(true);
    setError(null);
    (async () => {
      try {
        const data = await asyncFn();
        if (!status.cancelled) {
          setData(data);
        }
      } catch (e) {
        if (!status.cancelled) {
          setError(e);
        }
      }
      if (!status.cancelled) {
        setIsLoading(false);
      }
    })();
    return () => {
      status.cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...(deps || [])]);

  return useCallback(
    (loadingUI, activeUI: (data: T) => JSX.Element, errorUI?: (err) => JSX.Element) => {
      if (isLoading) {
        return loadingUI;
      }
      if (error && errorUI) {
        return errorUI(error);
      }
      if (data !== undefined) {
        return activeUI(data);
      }
      return null;
    },
    [data, error, isLoading]
  );
}
