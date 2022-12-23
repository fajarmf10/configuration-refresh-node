import { Express } from 'express';
import { SnapCache } from '../../repositories/snap-cache';
import _ from 'lodash';

export class SnapCacheManager {
    private readonly app: Express;

    private caches: { bankMerchantCodeSecretKeyCache: SnapCache; bankMerchantCodePublicKeyCache: SnapCache };

    constructor(app: Express, caches: {
        bankMerchantCodeSecretKeyCache: SnapCache;
        bankMerchantCodePublicKeyCache: SnapCache;
    }) {
        this.app = app;
        this.caches = caches;
    }

    refreshSecretToEnv = async () => {
        const { pool } = this.app.locals;
        const res = await pool.query('SELECT * FROM api_credentials');
        const results: ApiCredentialRow[] = res.rows;
        const cache = this.caches.bankMerchantCodeSecretKeyCache;
        for (const result of results) {
            const cacheKey = `${result.provider_code}-${result.merchant_code}`;
            cache.set(cacheKey, result.secret_key);
        }
    };

    fetchAllSnapSecrets = async () => {
        const { pool } = this.app.locals;
        const [secretsQueryResults, pubKeyQueryResults] = await Promise.all([
            pool.query('SELECT * FROM api_credentials where is_snap = $1 and is_secret = $2', [true, true]),
            pool.query('SELECT * FROM api_credentials where is_snap = $1 and is_secret = $2', [true, false]),
        ]);
        const secretsResults: ApiCredentialRow[] = secretsQueryResults.rows;
        const pubKeyResults: ApiCredentialRow[] = pubKeyQueryResults.rows;
        const bankMerchantCodeSecretCache: SnapCache = this.caches.bankMerchantCodeSecretKeyCache;
        const bankMerchantCodePubKeyCache: SnapCache = this.caches.bankMerchantCodePublicKeyCache;
        console.log(`We have ${secretsResults.length} secrets`);
        console.log(`We have ${pubKeyResults.length} pub key`);
        for (const result of secretsResults) {
            const cacheKey = `${result.provider_code}-${result.merchant_code}`;
            bankMerchantCodeSecretCache.set(cacheKey, result.secret_key);
        }
        for (const result of pubKeyResults) {
            const cacheKey = `${result.provider_code}-${result.merchant_code}`;
            bankMerchantCodePubKeyCache.set(cacheKey, result.secret_key);
        }
    };

    refreshSnapSecret = async (cacheKey: string) => {
        const cacheStorage: SnapCache = this.caches.bankMerchantCodeSecretKeyCache;
        console.log(`Refreshing cache for ${cacheKey}`);
        return this.fetchSnap(cacheKey, cacheStorage);
    };

    fetchSnap = async (cacheKey: string, cacheStorage: SnapCache) => {
        const snapCacheSplits: string[] = cacheKey.split('-');
        const { pool } = this.app.locals;
        const queryResult = await pool.query(
            'SELECT * FROM api_credentials where provider_code = $1 and merchant_code = $2 and is_snap = $3 and is_secret = $4',
            [snapCacheSplits[0], snapCacheSplits[1], true, true],
        );
        const results: ApiCredentialRow[] = queryResult.rows;
        if (results.length === 0) {
            console.log(`No result for ${cacheKey}`);
            return undefined;
        }
        if (results.length > 1) {
            console.log(`More than one record found for ${cacheKey}`);
            return undefined;
        }
        const secretKey = results[0].secret_key;
        console.log(`Setting cache for ${cacheKey} with the result of ${secretKey}`);
        cacheStorage.set(cacheKey, secretKey);
        return secretKey;
    };

    fetchSnapSecret = async (cacheKey: string) => {
        const cacheStorage: SnapCache = this.caches.bankMerchantCodeSecretKeyCache;
        const cache: string = cacheStorage.get(cacheKey);
        if (_.isString(cache)) {
            console.log(`Cache found for ${cacheKey}`);
            return cache;
        }

        console.log(`Fetching for ${cacheKey}`);
        return this.fetchSnap(cacheKey, cacheStorage);
    };
}

interface ApiCredentialRow {
    id: string;
    provider_code: string;
    merchant_code: string;
    client_id: string;
    secret_key: string;
    is_active: boolean;
}
