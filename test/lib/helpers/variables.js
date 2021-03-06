var should = require('should');
var variables = require('../../../lib/helpers/variables');

describe('variables', function(){
  var task = {
    remote: "localhost",
    cwd: "../test",
    commands: [
      "echo {{cool}}!"
    ]
  };

  describe('processVars', function(){
    it('should be defined', function(){
      variables.processVars.should.exist;
    });

    it('should be a function', function(){
      variables.processVars.should.be.a.Function;
    });

    describe('when passed an Object', function(){
      it('replaces the variables with the values in var', function(){
        var result = variables.processVars(task, { cool: 'fool' });
        result.should.containEql({
          remote: "localhost",
          cwd: "../test",
          commands: [
            "echo fool!"
          ]
        });
      });

      it('does not replace the variables in the global tasklist', function(){
        global.taskList = {
          task : {
            remote: "localhost",
            cwd: "../test",
            commands: [
              "echo {{cool}}!"
            ]
          }
        };
        variables.processVars(global.taskList.task, { cool: 'fool' });
        global.taskList.task.commands[0].should.equal("echo {{cool}}!");
      });

      describe('when task does not contain any replacable vars', function(){
        var task = {
          remote: "localhost",
          cwd: "../test",
          commands: [
            "echo cool!"
          ]
        };

        it('should not throw an error', function(){
          variables.processVars.bind(null, task, { cool: 'fool' }).should.not.throw();
        });

        it('should return the task unaltered', function(){
          var result = variables.processVars(task, { cool: 'fool' });
          result.should.containEql({
            remote: "localhost",
            cwd: "../test",
            commands: [
              "echo cool!"
            ]
          });
        });
      });
    });

    describe('when passed a String', function(){
      describe('when passed a valid path', function(){
        it('replaces the variables with values in file', function(){
          var filepath = '../../test/fixtures/exec/valid-vars.json';
          var result = variables.processVars(task, filepath);

          result.should.containEql({
            remote: "localhost",
            cwd: "../test",
            commands: [
              "echo fool!"
            ]
          });
        });
      });

      describe('when passed an invalid path', function(){
        it('should throw an error', function(){
          variables.processVars.bind(null, task, 'nonsense').should.throw();
        });
      });
    });

    describe('when passed neither an Object nor a String', function(){
      it('should throw an error', function(){
        variables.processVars.bind(null, task, 2).should.throw();
      });
    });

    describe('when defaults are set in the task', function(){
      var taskDefaults = {
        remote: "localhost",
        cwd: "../test",
        commands: [
          "echo {{cool}}!"
        ],
        defaults: {
          cool: "tool"
        }
      };

      describe('when variable is defined in task, but not passed in', function(){
        it('replaces the variable with the default value', function(){
          var result = variables.processVars(taskDefaults, {});
          result.should.containEql({
            remote: "localhost",
            cwd: "../test",
            commands: [
              "echo tool!"
            ],
            defaults: {
              cool: "tool"
            }
          });
        });
      });

      describe('when vars object contains empty variables', function(){
        it('should replace the var with the default', function(){
          var result = variables.processVars(taskDefaults, { cool: '' });
          result.should.containEql({
            remote: "localhost",
            cwd: "../test",
            commands: [
              "echo tool!"
            ],
            defaults: {
              cool: "tool"
            }
          });
        });
      });

      describe('when vars object contains valid vars', function(){
        it('should replace the var with passed in var, not the default', function(){
          var result = variables.processVars(taskDefaults, { cool: 'fool' });
          result.should.containEql({
            remote: "localhost",
            cwd: "../test",
            commands: [
              "echo fool!"
            ],
            defaults: {
              cool: "tool"
            }
          });
        });
      });
    });
  });
});
