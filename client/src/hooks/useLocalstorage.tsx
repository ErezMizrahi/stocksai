const useLocalstorage = () => {

    const setItem = (item: any) => {
        localStorage.setItem('accessToken', JSON.stringify(item));
    }

    const getItem = (): string | null => localStorage.getItem('accessToken');

    return { getItem, setItem };
}

export default useLocalstorage