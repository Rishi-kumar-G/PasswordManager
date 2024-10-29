# Password Manager

A secure and user-friendly password management application built with React Native and Expo.

## Features

1. **Encryption**: Passwords are encrypted before being stored locally on the device, ensuring maximum security.
2. **Password Generation**: Users can generate strong, random passwords with just a click.
3. **Password Strength Indicator**: A visual indicator shows the strength of the password being created or stored.
4. **Password Categorization**: Passwords can be organized into categories for better management.
5. **Search and Filter**: Users can search for passwords and filter them by category.
6. **Copy to Clipboard**: Revealed passwords can be quickly copied to the clipboard.
7. **Secure Local Storage**: All password data is securely stored on the device using AsyncStorage.

## Installation

1. Make sure you have [Node.js](https://nodejs.org/) and [Expo CLI](https://docs.expo.io/get-started/installation/) installed on your machine.
2. Clone the repository:
3. Navigate to the project directory and install the dependencies:
```
cd password-manager
npm install
```
4. Start the Expo development server:

```
expo start
```

5. Follow the instructions provided in the terminal to run the app on your device or emulator.

## Usage

1. When the app opens, you'll see the main Password Manager screen.
2. Tap the "+" button in the bottom right to add a new password.
3. Fill in the required fields (Key, Password, Category) and optionally generate a strong password.
4. Tap "Add" to save the new password.
5. The saved passwords will be displayed in the list. Tap on a password to reveal its contents.
6. Use the search bar and category filters to find and manage your passwords.
7. Tap the copy icon to copy a password to your clipboard.
8. To delete a password, swipe left on the password item and tap the trash icon.

## Contributing

If you find any issues or have suggestions for improvements, feel free to open an issue or submit a pull request. Contributions are always welcome!

## License

This project is licensed under the [MIT License](LICENSE).