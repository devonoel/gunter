var should = require('should');
var variables = require('../../../lib/helpers/variables');

describe('variables', function(){
  var task = {
    remote: "localhost",
    cwd: "../test",
    commands: [
      "echo {{cool}}!"
    ]
  }

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
  });
});