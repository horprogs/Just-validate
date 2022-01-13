# Contributing

## Suggesting new features

If you are here to suggest a feature, first create an issue if it does not already exist. From there, we will discuss use-cases for the feature and then finally discuss how it could be implemented.

## Commit message conventions

`just-validate` is using [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines).

We have very precise rules over how our git commit messages can be formatted. This leads to **more readable messages** that are easy to follow when looking through the **project history**.

### Commit Message Format

Each commit message consists of a **type** and a **subject**:

    <type>(): <subject>

### Type

Must be one of the following:

*   **feat**: A new feature
*   **fix**: A bug fix
*   **docs**: Documentation only changes
*   **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing
    semi-colons, etc)
*   **refactor**: A code change that neither fixes a bug nor adds a feature
*   **perf**: A code change that improves performance
*   **test**: Adding missing or correcting existing tests
*   **chore**: Changes to the build process or auxiliary tools and libraries such as documentation
    generation

### Subject

The subject contains succinct description of the change:

*   use the imperative, present tense: "change" not "changed" nor "changes"
*   don't capitalize first letter
*   no dot (.) at the end

### Example

Here is an example of the release type that will be done based on a commit messages:

| Commit message                          | Release type              |
| --------------------------------------- | ------------------------- |
| `fix(): fix validation for number rule` | Patch Release             |
| `feat(): add onFail callback`           | ~~Minor~~ Feature Release |

## Pull requests

Maintainers merge pull requests by squashing all commits and editing the commit message if necessary using the GitHub user interface.

Use an appropriate commit type.

## Releases

For each new commit added to `master` with `git push` or by merging a pull request or merging from another branch, a github action is triggered and runs the `semantic-release` command to make a release if there are codebase changes since the last release that affect the package functionalities.

After the release, the link to the CDN for the new version should be changed here `site/examples/index.html`, in `README.md` and in `site/index.html`.
