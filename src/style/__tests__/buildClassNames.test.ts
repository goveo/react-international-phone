import {
  buildClassNames,
  classNamesWithPrefix,
  classPrefix,
} from '../buildClassNames';

describe('buildClassNames', () => {
  test('should append prefix', () => {
    expect(
      buildClassNames({ addPrefix: ['test'], rawClassNames: ['some-test'] }),
    ).toBe(`${classPrefix}test some-test`);

    expect(
      buildClassNames({
        addPrefix: ['className1', 'className2'],
        rawClassNames: ['rawClass', 'rawClass2'],
      }),
    ).toBe(
      `${classPrefix}className1 ${classPrefix}className2 rawClass rawClass2`,
    );
  });

  test('should remove boolean and undefined values form result', () => {
    expect(
      buildClassNames({
        addPrefix: [
          'className',
          undefined,
          undefined && 'wrong',
          false,
          false && 'wrong',
          true && 'className2',
        ],
        rawClassNames: [
          'raw',
          undefined,
          undefined && 'wrong',
          false,
          false && 'wrong',
          true && 'raw2',
        ],
      }),
    ).toBe(`${classPrefix}className ${classPrefix}className2 raw raw2`);
  });
});

describe('classNamesWithPrefix', () => {
  test('should append prefix to passed classes', () => {
    expect(classNamesWithPrefix('test', 'some-test')).toBe(
      `${classPrefix}test ${classPrefix}some-test`,
    );
  });

  test('should remove boolean and undefined values form result', () => {
    expect(
      classNamesWithPrefix(
        'className',
        undefined,
        undefined && 'wrong',
        false,
        false && 'wrong',
        true && 'className2',
      ),
    ).toBe(`${classPrefix}className ${classPrefix}className2`);
  });
});
