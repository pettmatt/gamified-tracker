export const addItemToLocalStorage = (key: string, value: string) => {
    localStorage.setItem(key, value)
}

export const getItemFromLocalStorage = (key: string): string | null => {
    return localStorage.getItem(key)
}