## [3.1.2](https://github.com/horprogs/Just-validate/compare/v3.1.1...v3.1.2) (2021-12-29)


### Bug Fixes

* fix README and trigger new patch release ([90b6b1e](https://github.com/horprogs/Just-validate/commit/90b6b1e3499eaa43c4058e0c1b65a8cae818fd73))

## [3.1.1](https://github.com/horprogs/Just-validate/compare/v3.1.0...v3.1.1) (2021-12-27)


### Bug Fixes

* upgrade devDependencies ([8f5cd53](https://github.com/horprogs/Just-validate/commit/8f5cd53384ca66a038f768b4badf7accea40dad5))

# [3.1.0](https://github.com/horprogs/Just-validate/compare/v3.0.0...v3.1.0) (2021-12-27)


### Features

* [#32](https://github.com/horprogs/Just-validate/issues/32) add minFilesCount, maxFilesCount, files rules for files validation ([db956dd](https://github.com/horprogs/Just-validate/commit/db956dde812755e49ca52a5dd79da3d70e20207b))
* [#32](https://github.com/horprogs/Just-validate/issues/32) add minFilesCount, maxFilesCount, files rules for files validation ([5056975](https://github.com/horprogs/Just-validate/commit/50569753848605e3d6848b514acf9791086ce432))

# [3.0.0](https://github.com/horprogs/Just-validate/compare/v2.2.1...v3.0.0) (2021-12-27)


### Features

* [#31](https://github.com/horprogs/Just-validate/issues/31) change required logic ([c7b6c78](https://github.com/horprogs/Just-validate/commit/c7b6c7805961dffb574c8cb40978e7a2bdcc2733))


### BREAKING CHANGES

* rules for maxLength, maxNumber etc. will not raise an error if the field is empty and there is no required rule. To validate for required you should define required rule directly.

## [2.2.1](https://github.com/horprogs/Just-validate/compare/v2.2.0...v2.2.1) (2021-12-27)


### Reverts

* Revert "feat(): change required logic \n\n BREAKING CHANGE: rules for maxLength, maxNumber etc. will not raise an error if the field is empty and there is no required rule. To validate for required you should defined required rule directly." ([a1bce7e](https://github.com/horprogs/Just-validate/commit/a1bce7ed00dbeb1934ee5e3ee060ecefd0013ac6))

# [2.2.0](https://github.com/horprogs/Just-validate/compare/v2.1.0...v2.2.0) (2021-12-27)


### Features

* change required logic \n\n BREAKING CHANGE: rules for maxLength, maxNumber etc. will not raise an error if the field is empty and there is no required rule. To validate for required you should defined required rule directly. ([62561a9](https://github.com/horprogs/Just-validate/commit/62561a99d14f40ff6a4d60f89ae2e6d37041095e))

# [2.1.0](https://github.com/horprogs/Just-validate/compare/v2.0.0...v2.1.0) (2021-12-22)


### Features

* [#30](https://github.com/horprogs/Just-validate/issues/30) add removeField method ([9b09503](https://github.com/horprogs/Just-validate/commit/9b09503089686261436e9264090c99c1fd108985))

# [2.0.0](https://github.com/horprogs/Just-validate/compare/v1.5.0...v2.0.0) (2021-12-07)


### Bug Fixes

* add git plugin ([02edd67](https://github.com/horprogs/Just-validate/commit/02edd67393172396168ae4e94d2430d4d8a033eb))
* adjust semantic-release config ([ed33cd1](https://github.com/horprogs/Just-validate/commit/ed33cd1a81129802c16945e4b703ea1a83146669))
* change invalid import ([d28b4b5](https://github.com/horprogs/Just-validate/commit/d28b4b5b679ba0482e5f4bd1757a7fb6e5cda324))
* fix global config ([be01fd8](https://github.com/horprogs/Just-validate/commit/be01fd8c5d88e29b3d70a856ad2e6c05c7bfcca6))
* fix ts config and package.json ([918bbba](https://github.com/horprogs/Just-validate/commit/918bbbaae7a9b35c34ab0f1633b0c0205ccac544))
* improve switching languages, fix focus field ([b0cd51c](https://github.com/horprogs/Just-validate/commit/b0cd51c3f6322517b31564f426a2d577d6d620ab))
* improve tooltip position calculation on scroll ([2c12854](https://github.com/horprogs/Just-validate/commit/2c128546cb1a01799c632ccf86e8cc4eedcc23ae))
* make field invalid if setting is invalid, add tests ([ede7a66](https://github.com/horprogs/Just-validate/commit/ede7a66e0b397fba539a3fa92d5e37f37f2c611e))
* remove unnecessary dep ([67f5549](https://github.com/horprogs/Just-validate/commit/67f5549e70a4bfc9bba147cf3ccb59a0441c0970))
* split settings for site ([2680add](https://github.com/horprogs/Just-validate/commit/2680adda6ac3796322cd368821f0f5c5e9a220ef))
* test change release automation ([1cdcdd8](https://github.com/horprogs/Just-validate/commit/1cdcdd812f1e97d4dce7c3b16227740c61acc201))
* trigger test release ([cda3c21](https://github.com/horprogs/Just-validate/commit/cda3c215dc3ad34ec3ac3c18174c5f735b9aa384))
* trigger test release ([e9eacb9](https://github.com/horprogs/Just-validate/commit/e9eacb9634dabd55affaeb82468d13a42c78f42b))
* trigger test release ([b553205](https://github.com/horprogs/Just-validate/commit/b553205ef4e160e7935f039103567eb7a2b2dd4f))
* trigger test release ([69aedea](https://github.com/horprogs/Just-validate/commit/69aedea2cc53a7f649009dedc1ecf100dc36c01f))
* trigger test release ([ea6c855](https://github.com/horprogs/Just-validate/commit/ea6c8550cc29b3d7d42579f10008d779575f9d8d))


### Features

* add basic methods, ecosystem, basic test ([f33c1a3](https://github.com/horprogs/Just-validate/commit/f33c1a3caed020952b45f271e3f05e8c65e41991))
* add group validation, rename interfaces, render errors ([e4eea35](https://github.com/horprogs/Just-validate/commit/e4eea35ce93cb717d7384375eb9d4fc722f89164))
* add localisation, fix select ([13f70c2](https://github.com/horprogs/Just-validate/commit/13f70c20d0919dde0848206203dfea05adf5423e))
* add new tooltips ([68ab2e2](https://github.com/horprogs/Just-validate/commit/68ab2e265a383edf5ef6c08f3b79309fb021138c))
* add onFail callback ([fe79dd5](https://github.com/horprogs/Just-validate/commit/fe79dd5fb7ca79208196ec16835e595abc6f0a3e))
* add rendering, clearing errors ([64d12de](https://github.com/horprogs/Just-validate/commit/64d12de336f48d9b7c1cfb7406acccfecafd954a))


### BREAKING CHANGES

* change interfaces

# [2.0.0-beta.12](https://github.com/horprogs/Just-validate/compare/v2.0.0-beta.11...v2.0.0-beta.12) (2021-12-04)


### Bug Fixes

* trigger test release ([cda3c21](https://github.com/horprogs/Just-validate/commit/cda3c215dc3ad34ec3ac3c18174c5f735b9aa384))

# [2.0.0-beta.11](https://github.com/horprogs/Just-validate/compare/v2.0.0-beta.10...v2.0.0-beta.11) (2021-12-04)


### Bug Fixes

* trigger test release ([e9eacb9](https://github.com/horprogs/Just-validate/commit/e9eacb9634dabd55affaeb82468d13a42c78f42b))

# [2.0.0-beta.7](https://github.com/horprogs/Just-validate/compare/v2.0.0-beta.6...v2.0.0-beta.7) (2021-12-04)


### Bug Fixes

* test change release automation ([1cdcdd8](https://github.com/horprogs/Just-validate/commit/1cdcdd812f1e97d4dce7c3b16227740c61acc201))

# [2.0.0-beta.6](https://github.com/horprogs/Just-validate/compare/v2.0.0-beta.5...v2.0.0-beta.6) (2021-12-03)


### Bug Fixes

* adjust semantic-release config ([ed33cd1](https://github.com/horprogs/Just-validate/commit/ed33cd1a81129802c16945e4b703ea1a83146669))
