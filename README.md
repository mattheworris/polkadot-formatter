# Polkadot Formatter

## Overview

The Polkadot Formatter is a browser extension that enhances the user experience on the Polkadot.js UI by formatting token amount inputs. It inserts underscores as thousand separators for improved readability, making it easier for users to interpret large numbers.

## Features

- Formats numeric input fields by adding underscores as thousand separators.
- Displays formatted values in an overlay while keeping the original input transparent.
- Automatically detects relevant input fields and applies formatting.
- Supports dynamic input fields added to the UI.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/mattheworris/polkadot-formatter.git
   ```

2. Navigate to the project directory:

   ```bash
   cd polkadot-formatter
   ```

## Manual Installation (Browser Extension)

1. Open your browser and navigate to the extensions page:
   - **Chrome**: Go to `chrome://extensions/`
   - **Firefox**: Go to `about:addons` [Untested]

2. Enable "Developer mode" (Chrome) or "Debug Add-ons" (Firefox).

3. Click "Load unpacked" (Chrome) or "Load Temporary Add-on" (Firefox).

4. Select the project directory (the folder containing your `manifest.json` and `contentScript.js`).

5. The extension should now be loaded and active.

6. Navigate to the Polkadot.js UI to see it in action.

## Usage

- Load the extension in your browser's developer mode.
- Navigate to the Polkadot.js UI.
- Start typing in the token amount input fields to see the formatting in action.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the Apache-2.0 License. See the LICENSE file for details.
