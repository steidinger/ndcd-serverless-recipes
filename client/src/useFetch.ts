import {useState, useEffect} from 'react';

export interface FetchResult<ResponseType> {
    data: ResponseType | null,
    loading: boolean,
    error: string | null,
}

export function useFetch<ResponseType>(url: string): FetchResult<ResponseType> {
    const [data, setData] = useState<ResponseType | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function fetchData() {
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
    useEffect(() => {fetchData()}, [url]);
    return {data, loading, error};
}
