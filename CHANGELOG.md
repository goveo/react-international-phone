## [1.8.1](https://github.com/goveo/react-international-phone/compare/v1.8.0...v1.8.1) (2023-01-29)


### Bug Fixes

* **build:** switch back to webpack builder ([934090c](https://github.com/goveo/react-international-phone/commit/934090cd6d58e7c203215a47b4677c297ce5c8fe))

# [1.8.0](https://github.com/goveo/react-international-phone/compare/v1.7.0...v1.8.0) (2023-01-29)


### Bug Fixes

* **CountrySelector:** omit onClick event type ([28e4e48](https://github.com/goveo/react-international-phone/commit/28e4e4817b32c3b6808ddbc9b7d9a3de6df2c625))


### Features

* **CountrySelectorDropdown:** add css variables for top and left properties ([13660bb](https://github.com/goveo/react-international-phone/commit/13660bb10e192fedd437758dd7065c638b0d2e86))

# [1.7.0](https://github.com/goveo/react-international-phone/compare/v1.6.5...v1.7.0) (2023-01-21)


### Bug Fixes

* improve auto-scrolling of the dropdown ([b17f2fa](https://github.com/goveo/react-international-phone/commit/b17f2fa10a22d1e207d9237e905e46be6024c35e))


### Features

* add accessibility for country-selector dropdown ([08e414f](https://github.com/goveo/react-international-phone/commit/08e414f16c7d02aa489ea9c9f83b0ea2dac9b100))
* **CountrySelector:** change onEscapePress callback with onClose, call it on dropdown blur ([bda69a2](https://github.com/goveo/react-international-phone/commit/bda69a2f8d5276d6aa0ac38eeed9d1771c82d18a))
* **CountrySelector:** pass rootProps to renderButtonWrapper callback ([2fabc58](https://github.com/goveo/react-international-phone/commit/2fabc582675db79b252277e625a3a9fb5291a3a4))

## [1.6.5](https://github.com/goveo/react-international-phone/compare/v1.6.4...v1.6.5) (2023-01-14)


### Bug Fixes

* **forceDialCode:** allow dial code change if a new phone has been pasted ([367f872](https://github.com/goveo/react-international-phone/commit/367f872fab6746c3c584adab962ed62de5e15bb5))

## [1.6.4](https://github.com/goveo/react-international-phone/compare/v1.6.3...v1.6.4) (2023-01-12)


### Bug Fixes

* **docs:** update url to ua flag emoji ([cab3db9](https://github.com/goveo/react-international-phone/commit/cab3db904e1e4edf23b189fcfccab3b0b7121571))
* **PhoneInput:** remove console error on phone autofill ([2b483cf](https://github.com/goveo/react-international-phone/commit/2b483cf747516eb1f74e62d376b01edf2782f703))
* prevent change of dial code when forcedDialCode is true ([7bd87f4](https://github.com/goveo/react-international-phone/commit/7bd87f4028c981b80895565f01f35e2bdabd4613))

## [1.6.3](https://github.com/goveo/react-international-phone/compare/v1.6.2...v1.6.3) (2023-01-10)


### Bug Fixes

* add type="button" in CountrySelector ([7c7040c](https://github.com/goveo/react-international-phone/commit/7c7040c32f9e702f21cdb4ed572e0826a0775c3e))

## [v1.6.2](https://github.com/goveo/react-international-phone/compare/v1.6.1...v1.6.2) (2023-01-09)


- Country flags lazy loading, update Twemoji cdn url [`#17`](https://github.com/goveo/react-international-phone/pull/17)
- fix(flag): add lazy loading, update cdn url [`667a1aa`](https://github.com/goveo/react-international-phone/commit/667a1aa304a07884aaad3face641fc51d050b28e)
- chore(release): 1.6.2 [skip ci] [`5ffee3a`](https://github.com/goveo/react-international-phone/commit/5ffee3ae46bcb3e56a2d366a0fb1f874f6442278)

## [v1.6.1](https://github.com/goveo/react-international-phone/compare/v1.6.0...v1.6.1) (2023-01-04)


- Add scrolling of the dropdown to the selected country [`#16`](https://github.com/goveo/react-international-phone/pull/16)
- imp(country-selector): scroll dropdown to guessed country [`9a808a3`](https://github.com/goveo/react-international-phone/commit/9a808a3ec464837fddd1f405a01bd003013a2822)
- fix(country-selector): fix scroll to guessed country [`dd24afe`](https://github.com/goveo/react-international-phone/commit/dd24afe4c85a70ff6bfa2015515965345f3cdde5)
- imp(country-selector): scroll dropdown to selected country on mount [`872b7d0`](https://github.com/goveo/react-international-phone/commit/872b7d0088e43c01a740bc941c5604e03b4eb259)

## [v1.6.0](https://github.com/goveo/react-international-phone/compare/v1.5.2...v1.6.0) (2022-12-30)


- Phone validation [`#15`](https://github.com/goveo/react-international-phone/pull/15)
- feat(validation): add phone validation [`1f112ff`](https://github.com/goveo/react-international-phone/commit/1f112ff84d0bf38df7d036d81015cd591f641315)
- imp(validation): add validation stories [`05a8c29`](https://github.com/goveo/react-international-phone/commit/05a8c291fe91914f17f9884fd47760a37b84b687)
- feat(country-guess): add areaCodeMatch to country guess result [`3e0e162`](https://github.com/goveo/react-international-phone/commit/3e0e1621b6e49382b848118dc501ba7ac2a96d81)

## [v1.5.2](https://github.com/goveo/react-international-phone/compare/v1.5.1...v1.5.2) (2022-12-22)


- Cursor position fixes [`#14`](https://github.com/goveo/react-international-phone/pull/14)
- imp(tests): add tests for cursor position [`d502cfb`](https://github.com/goveo/react-international-phone/commit/d502cfbeb0bac9408fdd63b2a6b93601c80a31c4)
- imp(cursor): improve cursor position on backspace and delete key removal [`974d6f8`](https://github.com/goveo/react-international-phone/commit/974d6f80e4e8c38f31a40d174ceab1fccf5eb5b3)
- fix(cursor): improve position cursor on paste [`c6716eb`](https://github.com/goveo/react-international-phone/commit/c6716eb1f9a185381f2311a63e275283fe319814)

## [v1.5.1](https://github.com/goveo/react-international-phone/compare/v1.5.0...v1.5.1) (2022-12-11)


- Fix dropdown closing, update docs [`#11`](https://github.com/goveo/react-international-phone/pull/11)
- Update issue templates [`#10`](https://github.com/goveo/react-international-phone/pull/10)
- imp(docs): add code of conduct [`d149bb5`](https://github.com/goveo/react-international-phone/commit/d149bb5864cc6fde1f3db39dff0830a202229973)
- fix(country-selector): close dropdown on click while dropdown is open [`16c49eb`](https://github.com/goveo/react-international-phone/commit/16c49ebc30dfff91630eaab91dda4944a86bf7d0)
- imp(docs): add contributing doc [`4484cda`](https://github.com/goveo/react-international-phone/commit/4484cdad9a363cb41b8a11e483f258b1e1b29ff6)

## [v1.5.0](https://github.com/goveo/react-international-phone/compare/v1.4.0...v1.5.0) (2022-12-09)


- Add renderButtonWrapper prop to CountrySelector, remove css injecting [`#9`](https://github.com/goveo/react-international-phone/pull/9)
- fix: remove lockfile from docs package [`209922a`](https://github.com/goveo/react-international-phone/commit/209922a12db2ec4e3a2d53fc133d2564d8c19570)
- feat(storybook): add example of usage with mui, chakra and antd [`c2ee11e`](https://github.com/goveo/react-international-phone/commit/c2ee11ef502f5cd3db6ae7b90b4d551c931d8f60)
- imp(docs): add docs for usage with UI libraries [`e22e2d9`](https://github.com/goveo/react-international-phone/commit/e22e2d904613884bc48f4d53db164daf529c13df)

## [v1.4.0](https://github.com/goveo/react-international-phone/compare/v1.3.0...v1.4.0) (2022-11-18)


- Make PhoneInput component controlled, small fixes [`#8`](https://github.com/goveo/react-international-phone/pull/8)
- feat: add value prop to the PhoneInput, allow component be controlled [`96eed12`](https://github.com/goveo/react-international-phone/commit/96eed122663c1ab11d5ac5c567f1b19acfa79bc4)
- fix(format): improve formatting with disabled dial code [`7df2461`](https://github.com/goveo/react-international-phone/commit/7df2461bec1a21d5d1184d0c960b73b1f726455c)
- feat(utils): add buildCountryData util [`7ad3ab2`](https://github.com/goveo/react-international-phone/commit/7ad3ab2afdb07c1375e02387358d08e4bd0704b2)

## [v1.3.0](https://github.com/goveo/react-international-phone/compare/v1.2.0...v1.3.0) (2022-11-10)


- Add docs, fix box-sizing [`#6`](https://github.com/goveo/react-international-phone/pull/6)
- feat(docs): add docs subpackage, init docusaurus project [`06c27c3`](https://github.com/goveo/react-international-phone/commit/06c27c3dc8f7a14bfd1256b74d13fc107c902b59)
- imp(docs): update features list on docs website [`eafe3d4`](https://github.com/goveo/react-international-phone/commit/eafe3d40619783f82d7e55a4ab90737aac0119d5)
- imp(docs): add usage examples to component apis [`25a26c7`](https://github.com/goveo/react-international-phone/commit/25a26c7a1d9396aa53496509e5f018a5b8cbb91c)

## [v1.2.0](https://github.com/goveo/react-international-phone/compare/v1.1.0...v1.2.0) (2022-11-02)


- Add countries property [`#4`](https://github.com/goveo/react-international-phone/pull/4)
- feat: add countries property, add ability to filter country-list [`0dc4984`](https://github.com/goveo/react-international-phone/commit/0dc4984c152c1e78cd1424c90171c3ae3c2c2bbc)
- fix: rename availableCountries prop to countries [`46cd020`](https://github.com/goveo/react-international-phone/commit/46cd0209b43e1b84847fd901ae34e7023566f597)
- imp(storybook): add OnlyBalticCountries story [`0c2b773`](https://github.com/goveo/react-international-phone/commit/0c2b7735deab8c77b20c50dcc438eedc7f6b9e38)

## [v1.1.0](https://github.com/goveo/react-international-phone/compare/v1.0.1...v1.1.0) (2022-10-30)


- Add CSS variables [`#3`](https://github.com/goveo/react-international-phone/pull/3)
- imp(styles): add css variables [`a27b9a7`](https://github.com/goveo/react-international-phone/commit/a27b9a7e9dc3e37540f92842447371541c9c3105)
- imp(docs): add css-variables to readme [`0470536`](https://github.com/goveo/react-international-phone/commit/04705369e17652c8544567b9fa3feb63af0c186e)
- fix: update stylelint-config-standard-scss dependency [`748c4bc`](https://github.com/goveo/react-international-phone/commit/748c4bc141e13c666b5878c13121c7b398a6f0c5)

## [v1.0.1](https://github.com/goveo/react-international-phone/compare/v1.0.0...v1.0.1) (2022-10-28)


- fix: add publish config to package.json [`#2`](https://github.com/goveo/react-international-phone/pull/2)
- chore(release): 1.0.1 [skip ci] [`3ee664f`](https://github.com/goveo/react-international-phone/commit/3ee664f37c31dfe08c71ee2b3643cc8f5663849b)

## v1.0.0 (2022-10-28)


- Release v1.0.0 [`#1`](https://github.com/goveo/react-international-phone/pull/1)
