ARCHIVED - actions now live in their respective repositories (e.g. [backend](https://github.com/stampedeapp/backend) or [web](https://github.com/stampedeapp/web))

# Github Actions

Repository for storing re-usable github actions. These should be generic and publically usable.

## Release versioning

Release versions using tags (e.g.) `git tag v1 && git push origin --tags`

Publish a general tag (e.g. `v1`) for a global LTS (where every action is stable and working).

Publish individual changes with semver, e.g. `codedeploy-v1.0.0`.

When referring to these actions, call them like `stampedeapp/actions/codedeploy@codedeploy-v1.0.0`.

You can also use individual commit SHAs if working between versions - don't create a tag for untested releases!
