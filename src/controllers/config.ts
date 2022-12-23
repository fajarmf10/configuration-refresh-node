import { Express, Request, Response, Router } from 'express';
import { SimpleMiddleware } from '../middlewares/simple-middleware';
import { FirstService } from '../services/first/first';
import { SnapCacheManager } from '../services/second/second';

interface RefreshMechanismPayload {
    bank_code: string;

    merchant_code: string;

    is_secret: boolean;
}

export class ConfigController {
    private readonly router: Router;

    private readonly app: Express;

    private _firstService: FirstService;

    private _secondService: SnapCacheManager;

    private simpleMiddleware: SimpleMiddleware;

    constructor({
        app,
        firstService,
        secondService,
        simpleMiddleware,
    }: { app: Express, firstService: FirstService, secondService: SnapCacheManager, simpleMiddleware: SimpleMiddleware }) {
        this.app = app;
        this._firstService = firstService;
        this._secondService = secondService;
        this.simpleMiddleware = simpleMiddleware;
        this.router = Router();
        this.router.post(
            '/refresh',
            this.refresh.bind(this),
        );
        this.router.post(
            '/payment/:bankCode',
            this.simpleMiddleware.validateSomething(),
            this.assumePayment.bind(this),
        );
    }

    assumePayment = (req: Request, res: Response) => {
        return res.status(200).json({ message: 'payment completed!' });
    };

    refresh = async (req: Request, res: Response) => {
        const requestBody: RefreshMechanismPayload  = req.body;
        const cacheKey = `${requestBody.bank_code}-${requestBody.merchant_code}`;
        const secretKey = await this._secondService.refreshSnapSecret(cacheKey);
        return res.status(200).json({ value: secretKey });
    };

    getRouter() {
        return this.router;
    }
}
