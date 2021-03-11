import {useState, useEffect} from 'react';

export interface FetchResult<ResponseType> {
    data: ResponseType | null,
    loading: boolean,
    error: string | null,
}

interface FetchDataParams<ResponseType> {
    url: string,
    setData: (data: ResponseType | null) => void,
    setError: (error: string | null) => void,
    setLoading: (boolean) => void,
    fetchOptions?: any,
}

async function fetchData<ResponseType>({url, setData, setError, setLoading, fetchOptions}: FetchDataParams<ResponseType>) {
    if (!url) {
        return;
    }
    setLoading(true);
    setError(null);
    try {
    const response = await fetch(url);
    if (response.status >= 200 && response.status < 400) {
        const json = await response.json();
        setData(json);
        setError(null);
        setLoading(false);
    }
    else {
        setError(response.statusText ?? 'http error ' + response.status);
        setLoading(false);
    }
    } catch(error) {
        setData(null);
        setLoading(false);
        setError(error);
    }
}

export function useFetch<ResponseType>(url: string): FetchResult<ResponseType> {
    const [data, setData] = useState<ResponseType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {fetchData({url, setData, setLoading, setError})}, [url]);
    return {data, loading, error};
}
