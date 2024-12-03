export function formatMessageTime(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (diff < 60000) return "Now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < oneDay) return `${Math.floor(diff / 3600000)}h`;

    return timestamp.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}
