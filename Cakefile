{exec} = require 'child_process'

task 'build', 'Build project from src/coffee/*.coffee to public/js/*.js', ->
  exec 'coffee --compile --output public/js/ src/coffee/', (err, stdout, stderr) ->
    throw err if err
    console.log 'Done.'

task 'less', 'Compile less files down into ghost.css', ->
  exec 'lessc src/less/bootstrap.less public/css/ghost.css', (err, stdout, stderr) ->
    throw err if err
    console.log 'Done.'
