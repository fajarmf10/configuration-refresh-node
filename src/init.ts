import { Pool } from 'pg';

import { HealthcheckController } from './controllers/healthcheck';
import { ConfigController } from './controllers/config';
import { FirstService } from './services/first/first';
import { SnapCacheManager } from './services/second/second';
import { PostgresConfigs } from './configs/postgres-configs';
import express from 'express';
import { SnapCache } from './repositories/snap-cache';
import { SimpleMiddleware } from './middlewares/simple-middleware';

export async function init() {
    const app = express();
    const pool: Pool = new Pool({
        host: PostgresConfigs.host,
        user: PostgresConfigs.username,
        password: PostgresConfigs.password,
        database: PostgresConfigs.database,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
    });
    await pool.connect();

    const snapCaches = {
        bankMerchantCodeSecretKeyCache: new SnapCache(),
        bankMerchantCodePublicKeyCache: new SnapCache(),
    };

    app.locals.pool = pool;
    const firstService: FirstService = new FirstService(app, 'predefined startup secretId', 'another predefined');
    const secondService: SnapCacheManager = new SnapCacheManager(app, snapCaches);
    console.log('Fetching all SNAP secrets and Pub Keys while initializing the server');
    await secondService.fetchAllSnapSecrets();

    const simpleMiddleware = new SimpleMiddleware(secondService);

    const healthcheckController = new HealthcheckController();
    const configController = new ConfigController({ app, firstService, secondService, simpleMiddleware });

    return {
        healthcheckController,
        configController,
        pool,
        app,
    };
}
