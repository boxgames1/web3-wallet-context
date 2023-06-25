module.exports = function (api) {
    let babelEnvOptions;

    if (api.env('test')) {
        babelEnvOptions = { targets: { node: 'current' } };
    } else {
        babelEnvOptions = { modules: false };
    }

    return {
        overrides: [
            // This configuration object applies to MFE's written in TS
            {
                include: ['**/*.ts', '**/*.tsx'],
                presets: [
                    ['@babel/preset-env', { ...babelEnvOptions, useBuiltIns: 'usage', corejs: 3 }],
                    ['@babel/preset-react'],
                    '@babel/preset-typescript',
                ],
                plugins: [
                    '@babel/plugin-proposal-class-properties',
                    '@babel/plugin-proposal-object-rest-spread',
                    '@babel/plugin-proposal-optional-chaining',
                    '@babel/plugin-proposal-nullish-coalescing-operator',
                ],
            },
        ],
    };
};
