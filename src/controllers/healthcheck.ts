import { Request, Response, Router } from 'express';

export class HealthcheckController {
    private readonly router: Router;

    constructor() {
        this.router = Router();
        this.router.get('/liveness', this.getHealthcheckLiveness.bind(this));
        this.router.get('/readiness', this.getHealthcheckReadiness.bind(this));
    }

    getRouter() {
        return this.router;
    }

    /**
    * GET /healthcheck/liveness
    * Check whether app is up
    **/
    private getHealthcheckLiveness(_: Request, res: Response) {
        return res.status(200).json({ status: 'OK' });
    }

    /**
     * GET /healthcheck/readiness
     * Check whether app is ready to receive traffic
     */
    private getHealthcheckReadiness(_: Request, res: Response) {
        return res.status(200).json({ status: 'OK' });
    }

    index(_: Request, res: Response) {
        return res.status(200).json({ message: 'You have successfully started the application!' });
    }
}
