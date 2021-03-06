import helper = require('../test_helper');

import TypeScriptParser = require('../../src/typescript_parser');
import Symbol = require('../../src/symbol');

describe('TypeScriptParser', () => {
  var instance: TypeScriptParser;

  var definitionPath = 'test/fixtures/typings/definitions.d.ts';
  var colorPath = 'test/fixtures/typings/color/color.d.ts';

  var config = helper.createConfig();

  beforeEach(() => {
    instance = new TypeScriptParser([definitionPath], config);
  });

  describe('#sourceFiles', () => {
    beforeEach(() => {
      instance.parse();
    });

    it('should return loaded instances of ts.SourceFile', () => {
      var expected = [colorPath, definitionPath];
      assert.deepEqual(instance.sourceFiles.map(d => d.filename), expected);
    });
  });

  describe('#parse', () => {
    context('when *.d.ts files as non external modules are given', () => {
      beforeEach(() => {
        instance.parse();
      });

      it('should parse types', () => {
        var expected = [
          // Array
          'Line[]',
          'number[]',
          'string[]', // FIXME: Strange to say, this type is created by UnionType declaration.
          // Tuple
          'NumberAndNumberTuple',
          // UnionType
          'NumberAndDateUnionType',
          // Function
          'Rpc.Get.getRange', 'Rpc.Post.setOptions', 'Type.ColoredSquareSetColorCallbackFunction',
          'Type.LineSetColorCallbackFunction', 'emitLog',
          // ObjectType
          'Rpc.Get.GetRangeObject', 'Rpc.Post.SetOptionsOptionsObject',
          // Enum
          'Type.Color',
          // Interface
          'Type.ColoredSquare', 'Type.Point', 'Type.Range', 'Type.RangeOfNumber',
          'Type.Square', 'Type.SquareDictionary', 'Type.Transformer', 'Type.Time',
          // Class
          'Type.Line', 'Type.LineDrawer',
          // TypeParameter
          'Type.T', 'Type.T',
          // PrimitiveType
          'boolean', 'number', 'string', 'void', 'any', 'integer'
        ].sort().join('\n');
        assert(instance.types.map(t => t.fullName).join('\n') === expected);
      });

      it('should parse modules', () => {
        var expected = ['Global', 'Rpc.Get', 'Rpc.Post', 'Rpc', 'Type'].sort().join('\n');
        assert(instance.modules.map(t => t.fullName).join('\n') === expected);
      });
    });

    context('when *.d.ts files as external modules are given', () => {
      var definitionPath = 'test/fixtures/typings/externals/foo.d.ts';

      beforeEach(() => {
        instance = new TypeScriptParser([definitionPath], config);
        instance.parse();
      });

      it('should parse types', () => {
        var expected = ['externals/foo.A.Foo', 'externals/bar.Bar'].sort().join('\n');
        assert(instance.types.map(t => t.fullName).join('\n') === expected);
      });

      it('should parse modules', () => {
        var expected = ['externals/foo', 'externals/foo.A', 'externals/bar'].sort().join('\n');
        assert(instance.modules.map(t => t.fullName).join('\n') === expected);
      });
    });

    context('when *.ts files are given', () => {
      var definitionPath = 'test/fixtures/typings/ts_files/foo.ts';

      beforeEach(() => {
        instance = new TypeScriptParser([definitionPath], config);
        instance.parse();
      });

      it('should parse types', () => {
        var expected = ['ts_files/foo.A.Foo', 'ts_files/bar.Bar', 'void', 'string'].sort().join('\n');
        assert(instance.types.map(t => t.fullName).join('\n') === expected);
      });

      it('should parse modules', () => {
        var expected = ['ts_files/foo', 'ts_files/foo.A', 'ts_files/bar'].sort().join('\n');
        assert(instance.modules.map(t => t.fullName).join('\n') === expected);
      });
    });
  });

  describe('#validate', () => {
    beforeEach(() => {
      instance.parse();
    });

    afterEach(() => {
      config.plugin.disallow = {};
    });

    context('in general', () => {
      it('should not throw an error', () => {
        assert.doesNotThrow(() => instance.validate());
      });
    });

    context('when dissalow#any is true', () => {
      beforeEach(() => {
        config.plugin.disallow.any = true;
      });
      it('should throw an error', () => {
        assert.throws(() => instance.validate(), /any type/);
      });
    });

    context('when dissalow#tuple is true', () => {
      beforeEach(() => {
        config.plugin.disallow.tuple = true;
      });
      it('should throw an error', () => {
        assert.throws(() => instance.validate(), /tuple type/);
      });
    });

    context('when dissalow#unionType is true', () => {
      beforeEach(() => {
        config.plugin.disallow.unionType = true;
      });
      it('should throw an error', () => {
        assert.throws(() => instance.validate(), /union type/);
      });
    });

    context('when dissalow#generics is true', () => {
      beforeEach(() => {
        config.plugin.disallow.generics = true;
      });
      it('should throw an error', () => {
        assert.throws(() => instance.validate(), /generics/);
      });
    });

    context('when dissalow#overload is true', () => {
      beforeEach(() => {
        config.plugin.disallow.overload = true;
      });
      it('should throw an error', () => {
        assert.throws(() => instance.validate(), /overload/);
      });
    });

    context('when dissalow#anonymousFunction is true', () => {
      beforeEach(() => {
        config.plugin.disallow.anonymousFunction = true;
      });
      it('should throw an error', () => {
        assert.throws(() => instance.validate(), /anonymous function/);
      });
    });

    context('when dissalow#anonymousObject is true', () => {
      beforeEach(() => {
        config.plugin.disallow.anonymousObject = true;
      });
      it('should throw an error', () => {
        assert.throws(() => instance.validate(), /anonymous object/);
      });
    });
  });
});
