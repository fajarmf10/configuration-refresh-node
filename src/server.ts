import { createApp } from './app';
import gracefulShutdown from 'http-graceful-shutdown';

const logAndExitProcess = (exitCode: number) => {
    console.info(
        {
            exit_code_number: exitCode,
        },
        'Exiting process',
    );
    process.exit(exitCode);
};

const setupProcessEventListeners = () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    process.on('unhandledRejection', (reason: any) => {
        console.warn({ reason_object: reason }, 'encountered unhandled rejection');
        logAndExitProcess(1);
    });

    process.on('uncaughtException', (err: Error) => {
        console.error(err, 'encountered uncaught exception');
        logAndExitProcess(1);
    });

    process.on('warning', (warning: Error) => {
        console.warn(
            {
                warning_object: warning,
            },
            'encountered warning',
        );
    });
};

void (async () => {
    try {
        const { app } = await createApp();
        const server = app.listen(app.get('port'), () => {
            console.info(
                {
                    port_number: app.get('port'),
                    env_string: app.get('env'),
                },
                'Started express server',
            );
        });
        setupProcessEventListeners();
        server.keepAliveTimeout = 181 * 1000;
        gracefulShutdown(server);
    } catch (err) {
        console.error(err, 'error caught in server.ts');
    }
})();
