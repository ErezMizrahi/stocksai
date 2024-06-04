const useLocalstorage = () => {

    const setItem = (item: any) => {
        localStorage.setItem('presist', JSON.stringify(item));
    }

    const getItem= (): boolean => localStorage.getItem('presist') === 'true';

    return { getItem, setItem };
}

export default useLocalstorage