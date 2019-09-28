module.exports = {
  apps : [{
    name: 'backend',
    interpreter: './node_modules/.bin/babel-node',
    script: './src/index.js',


    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }],

};
