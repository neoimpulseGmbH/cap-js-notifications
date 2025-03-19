# CAP JS Notifications

## Overview

CAP JS Notifications is a CDS plugin designed to provide an easy action for the notification service. It supports sending notifications to different destinations based on the environment configuration.

**Note:** This project is a copy of the [cap-js/notifications](https://github.com/cap-js/notifications) repository. Please refer to the original repository for more details.

## Features

- Send notifications to REST endpoints or console based on the environment.
- Validate and process notification types.
- Deploy notification types to the notification service.
- Customizable notification templates.

## Installation

To install the dependencies, run:

```bash
npm install
```

## Usage

### Configuration

The plugin configuration is defined in the `package.json` file under the `cds.requires.notifications` section. It includes settings for different environments, notification types, and destinations.

### Notification Types

Notification types are defined in the `srv/notification-types.json` file. Each notification type includes templates for different languages and versions.

### Running the Plugin

To run the plugin, use the following command:

```bash
cds run
```

### Building the Project

To build the project, use the following command:

```bash
cds build
```

### Releasing the Project

The release process is automated using GitHub Actions. The configuration is defined in the `.github/workflows/release.yml` file.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](./LICENSE) file for more details.

## Contributing

Contributions are welcome! Please read the [CONTRIBUTING](./CONTRIBUTING.md) guidelines before submitting a pull request.

## Contact

For any questions or issues, please contact the author at Neoimpulse GmbH.
