// Utilities for working with file paths

export function safeFileName(input: string): string {
    return input
        .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}