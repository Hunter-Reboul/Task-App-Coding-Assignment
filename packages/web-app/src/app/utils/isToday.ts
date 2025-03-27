export function isToday(dateString: string): boolean {
    const today = new Date();
    const date = new Date(dateString);
    return (date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate());
}