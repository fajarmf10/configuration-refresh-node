import { Express } from 'express';

export class FirstService {
    private readonly app: Express;

    private secretId:string;

    private anotherSecret: string;

    constructor(app: Express, secretId: string, anotherSecret: string) {
        this.app = app;
        this.secretId = secretId;
        this.anotherSecret = anotherSecret;
    }
}
