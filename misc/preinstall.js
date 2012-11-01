if (process.env.npm_config_global !== '') {
  if (process.env.npm_config_global === 'true') {
    console.error('###################################################################\n');
    console.error('Please use `npm install -g grunt-cli` to install the grunt command.');
    console.error('Grunt itself must be defined as a local dependency of your project.');
    console.error('For more information, read this: http://bit.ly/fyW0Fo\n');
    console.error('###################################################################\n');
    process.exit(1);
  }
}
