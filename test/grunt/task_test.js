'use strict';

var grunt = require('../../lib/grunt');

exports['task'] = {
  'normalizeMultiTaskFiles': function(test) {
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
  }
};
