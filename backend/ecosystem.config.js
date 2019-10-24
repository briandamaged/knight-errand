module.exports = {
  apps : [{
    name: 'backend',
    interpreter: './node_modules/.bin/babel-node',
    interpreter_args: ['--extensions=.js,.ts'],
    script: './src',


    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
  }],

};
