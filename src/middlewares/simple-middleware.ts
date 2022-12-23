import { NextFunction, Request, RequestHandler, Response } from 'express';
import { SnapCacheManager } from '../services/second/second';

interface SimpleRequestBody {
    partnerServiceId: string;
    secretKey: string;
}

export class SimpleMiddleware {
    private _secondService: SnapCacheManager;

    constructor(secondService: SnapCacheManager) {
        this._secondService = secondService;
    }

    public validateSomething = (): RequestHandler =>
        async (req: Request, res: Response, next: NextFunction) => {
            console.log('Request incoming. Mock as it is receiving inquiry or payment');
            const { params } = req;

            const bankCode = params.bankCode.toUpperCase();
            const requestBody: SimpleRequestBody = req.body;
            const partnerServiceId = requestBody.partnerServiceId;

            const cacheKey = `${bankCode}-${partnerServiceId}`;
            const secretKey = await this.getFromCacheOrFetch(cacheKey);

            console.log(`Secret Key for Bank ${bankCode} and Merchant Code ${partnerServiceId}: ${secretKey}`);
            if (!secretKey) {
                console.log(`ERROR! Unsupported bank code ${bankCode} and merchantId ${partnerServiceId}. Not found any secret key!`);
                next();
                return;
            }

            if (requestBody.secretKey !== secretKey) {
                console.log(`ERROR! Client Secret isn't the same in the request! Received: ${requestBody.secretKey} Our record: ${secretKey}`);
                next();
                return;
            }
            console.log('Secret is same. Congrats!');
            next();
        };

    async getFromCacheOrFetch(cacheKey:string) {
        console.log(`Getting From Cache or Fetching ${cacheKey}`);
        return this._secondService.fetchSnapSecret(cacheKey);
    }

    getSnapHeader = (req: Request) => {
        return {
            xTimestamp: req.header('X-Timestamp'),
            xPartnerId: req.header('X-Partner-Id'),
            channelId: req.header('Channel-Id'),
            xExternalId: req.header('X-External-Id'),
        };
    };

}

//
// export const validateSomething = (): RequestHandler => {
//     return (req: Request, res: Response, next: NextFunction) => {
//         const { params } = req;
//
//         const bankCode = params.bankCode.toUpperCase();
//         const requestBody: SimpleRequestBody = req.body;
//
//         const clientSecretEnvironment:string = clientSecrets[bankCode];
//         console.log('clientSecretEnvironment', clientSecretEnvironment);
//         if (!clientSecretEnvironment) {
//             console.log('unsupported bank code');
//             throw new Error('unsupported bank code');
//         }
//
//         if (requestBody.clientSecret !== clientSecretEnvironment) {
//             console.log('Client Secret isn\'t the same!');
//         }
//         return next();
//     };
// };
