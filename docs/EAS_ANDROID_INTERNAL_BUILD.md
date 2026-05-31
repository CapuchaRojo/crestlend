# EAS Android Internal Build

This guide prepares CrestLend for an Expo EAS Android internal distribution build. It is for sandbox testing only. Do not publish this build to Google Play and do not use it for real lending.

## Current Build Boundary

CrestLend remains a sandbox lending app:

- No real lender matching
- No auth
- No real loan applications
- No sensitive data collection
- No document uploads
- No bank connections
- No credit bureau connections
- Synthetic offers only
- No approval or denial decisions

## Required Tools

- Node.js and npm
- Project dependencies installed with `npm ci`
- Expo account
- EAS CLI

Install EAS CLI globally:

```sh
npm install --global eas-cli
```

Check the CLI:

```sh
eas --version
```

## Login

Log in to your Expo account:

```sh
eas login
```

Confirm the active account:

```sh
eas whoami
```

## Configure Project If Needed

This repo includes `eas.json`, `app.json`, and the Android package name:

```txt
com.creditcrest.crestlend
```

If this project has not yet been linked to an Expo project, run:

```sh
eas build:configure
```

Review any generated project ID changes before committing them.

## Build Profiles

The repo includes these EAS profiles:

- `development`: internal Android APK for sandbox development/testing.
- `preview`: internal Android APK for testers and stakeholder review.
- `production`: app-bundle profile kept for future readiness only. It is not ready for Google Play release.

For internal tester distribution, use `preview`.

## Internal Android Build Command

From the CrestLend repo root:

```sh
npm run eas:android:preview
```

Equivalent direct EAS command:

```sh
eas build --platform android --profile preview
```

This should produce an Android APK suitable for internal distribution.

## Download And Install

After the build completes:

1. Open the EAS build URL shown in the terminal.
2. Download the Android APK artifact.
3. Share the EAS install link or APK with internal testers.
4. On Android, allow installation from the browser or file source if prompted.
5. Install and run CrestLend.

This is not a Google Play release, and testers may see Android warnings for apps installed outside the Play Store.

## Local Validation Before Build

Run:

```sh
npm ci
npm run lint
npm run typecheck
npm test
```

Optionally inspect Expo config locally:

```sh
npx expo config --type public
```

Validate EAS config syntax without starting a build:

```sh
npx eas-cli config
```

Some EAS commands may require Expo login.

## Troubleshooting

- If `eas` is not found, install it with `npm install --global eas-cli`.
- If the build asks to create Android credentials, allow EAS to manage credentials for internal sandbox builds unless your team has a dedicated keystore process.
- If the project is not linked, run `eas build:configure` and review the generated project metadata.
- If Android install is blocked, enable install from unknown sources for the browser or file manager used by the tester.
- If dependency install fails locally, stop any running Expo/Metro process and rerun `npm ci`.
- If the build produces an AAB instead of an APK, confirm the `preview` profile has `"distribution": "internal"` and `"android": { "buildType": "apk" }`.

## Release Reminder

Do not submit CrestLend to Google Play from this pass. A production release would require final privacy policy, Google Play data safety form, financial features declaration, personal-loan policy review, partner/compliance approval, security review, and removal or rewording of any non-production placeholders.
