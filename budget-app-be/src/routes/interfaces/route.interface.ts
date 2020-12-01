
export interface IRoute {
    handler(request, response): Promise<void>;
}