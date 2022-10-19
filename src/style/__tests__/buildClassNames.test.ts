import { buildClassNames, classPrefix } from '../buildClassNames';

describe('buildClassNames', () => {
  test('should append prefix to passed classes', () => {
    expect(buildClassNames('test', 'some-test')).toBe(
      `${classPrefix}test ${classPrefix}some-test`,
    );
  });

  test('should remove boolean and undefined values form result', () => {
    expect(
      buildClassNames(
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
