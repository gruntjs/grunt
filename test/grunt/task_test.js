'use strict';

var grunt = require('../../lib/grunt');

exports['task.normalizeMultiTaskFiles'] = {
  'normalize': function(test) {
    test.expect(6);

    test.deepEqual(grunt.task.normalizeMultiTaskFiles('src/file1.js', 'dist/built.js'), [
      {dest: 'dist/built.js', src: 'src/file1.js'}
    ], 'should normalize destTarget: srcString.');

    test.deepEqual(grunt.task.normalizeMultiTaskFiles(['src/file1.js', 'src/file2.js'], 'dist/built.js'), [
      {dest: 'dist/built.js', src: ['src/file1.js', 'src/file2.js']}
    ], 'should normalize destTarget: srcArray.');

    test.deepEqual(grunt.task.normalizeMultiTaskFiles({
      src: ['src/file1.js', 'src/file2.js'],
      dest: 'dist/built.js'
    }, 'target'), [
      {dest: 'dist/built.js', src: ['src/file1.js', 'src/file2.js']}
    ], 'should normalize target: {src: srcStuff, dest: destStuff}.');

    test.deepEqual(grunt.task.normalizeMultiTaskFiles({
      files: {
        'dist/built-a.js': 'src/file1.js',
        'dist/built-b.js': ['src/file1.js', 'src/file2.js']
      }
    }, 'target'), [
      {dest: 'dist/built-a.js', src: 'src/file1.js'},
      {dest: 'dist/built-b.js', src: ['src/file1.js', 'src/file2.js']}
    ], 'should normalize target: {files: {destTarget: srcStuff, ...}}.');

    test.deepEqual(grunt.task.normalizeMultiTaskFiles({
      files: [
        {'dist/built-a.js': 'src/file1.js'},
        {'dist/built-b.js': ['src/file1.js', 'src/file2.js']}
      ]
    }, 'target'), [
      {dest: 'dist/built-a.js', src: 'src/file1.js'},
      {dest: 'dist/built-b.js', src: ['src/file1.js', 'src/file2.js']}
    ], 'should normalize target: {files: [{destTarget: srcStuff}, ...]}.');

    test.deepEqual(grunt.task.normalizeMultiTaskFiles({
      files: [
        {dest: 'dist/built-a.js', src: 'src/file1.js'},
        {dest: 'dist/built-b.js', src: ['src/file1.js', 'src/file2.js']}
      ]
    }, 'target'), [
      {dest: 'dist/built-a.js', src: 'src/file1.js'},
      {dest: 'dist/built-b.js', src: ['src/file1.js', 'src/file2.js']}
    ], 'should normalize target: {files: [{src: srcStuff, dest: destStuff}, ...]}.');

    test.done();
  },
  'template processing': function(test) {
    test.expect(1);

    // Processing "TEST" recursively should return "123"
    grunt.config.set(['TEST'], '<%= TEST2.PROP %>');
    grunt.config.set(['TEST2'], {
      PROP: '<%= TEST2.PROP1 %><%= TEST2.PROP2 + TEST2.PROP3 %>',
      PROP1: '1',
      PROP2: '2',
      PROP3: '3'
    });

    test.deepEqual(grunt.task.normalizeMultiTaskFiles({
      files: [
        {dest: 'dist/built-<%= TEST %>-a.js', src: 'src/file1-<%= TEST %>.js'},
        {dest: 'dist/built-<%= TEST %>-b.js', src: ['src/file1-<%= TEST %>.js', 'src/file2-<%= TEST %>.js']}
      ]
    }, 'target'), [
      {dest: 'dist/built-123-a.js', src: 'src/file1-123.js'},
      {dest: 'dist/built-123-b.js', src: ['src/file1-123.js', 'src/file2-123.js']}
    ], 'should process templates recursively.');

    test.done();
  }
};
