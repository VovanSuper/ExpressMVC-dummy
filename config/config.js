module.exports = {
    sessions: {
        secret: 'k9yb0ard c2t'
    },
    env: {
        port: 8080
    },
    db: {
        connectionString: 'mongodb://localhost:27017/expressAuth',
        host: 'localhost',
        creds: {
            username: '',
            password: ''
        }
    },
    jwtSecret: 'jwt$9cr9t', 
    facebook: {
        FACEBOOK_APP_ID: 'APP_ID',
        FACEBOOK_APP_SECRET: 'APP_SEC',
        callbackUrl: 'http://localhost:8080/facebook/callback'
    },
    redis: {
        db: 5,
        host: 'localhost',
        port: 6379,
        pass: '',
        prefix: 'app_sess_id',
        logErrors: true
        , retry_strategy: function(options) {
            if (options.error && options.error.code === 'ECONNREFUSED') {
                // End reconnecting on a specific error and flush all commands with a individual error
                throw new Error('The REDIS server refused the connection');
            }
            if (options.total_retry_time > 1000 * 60 * 60) {
                // End reconnecting after a specific timeout and flush all commands with a individual error
                throw new Error('Retry time exhausted');
            }
            if (options.attempt > 10) {
                // End reconnecting with built in error
                return undefined;
            }
            // reconnect after
            return Math.min(options.attempt * 100, 3000);
        }
    }
}
