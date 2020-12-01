export class StringExtensions {
    public static FirstCharToUpper(source: string): string {
        return source.charAt(0).toUpperCase() + source.slice(1);
    }
}