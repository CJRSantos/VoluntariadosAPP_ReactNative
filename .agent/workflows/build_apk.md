---
description: How to build the Android APK
---

To build the Android APK for your application, follow these steps:

1.  **Install EAS CLI (if not installed):**
    Open a terminal and run:
    ```powershell
    npm install -g eas-cli
    ```

2.  **Login to Expo:**
    Run the following command and follow the prompts to log in to your Expo account:
    ```powershell
    eas login
    ```

3.  **Build the APK:**
    Run the build command using the `preview` profile we configured:
    ```powershell
    eas build -p android --profile preview
    ```

4.  **Download the APK:**
    Once the build is complete, EAS will provide a link to download your `.apk` file. You can install this file directly on your Android device.

> [!NOTE]
> The `eas.json` file has been configured with a `preview` profile specifically for generating APKs.
