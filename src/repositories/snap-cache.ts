import NodeCache from 'node-cache';

const DEFAULT_1D_TTL = 86400;

export class SnapCache {
    cache: NodeCache;

    constructor(ttl?: number) {
        this.cache = new NodeCache({ stdTTL: ttl || DEFAULT_1D_TTL });
    }

    get(key: string): any {
        return this.cache.get<string[]>(key);
    }

    set(key: string, value: string): void {
        this.cache.set(key, value);
    }
}
