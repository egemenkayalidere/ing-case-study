# ING Employee Management Application

This project is a modern Employee Management Application developed using Lit Element as part of the ING Case Study. The application provides an interactive web interface that can list, add, edit, and delete employee records.

## Installation

Run the following commands to install the project:

```bash
# Install dependencies
npm install
```

## Development

To start the development server:

```bash
npm start
```

This command will run the application in development mode and automatically open it in your browser. Changes made to the code are automatically refreshed.

## Build

To build the project:

```bash
npm run build
```

This command will compile the application to the `/dist` folder.

## Running the Built Application

To run the built application:

```bash
npm run serve
```

## Test

To run unit tests:

```bash
npm test
```

## Technologies

- **Lit Element**: For creating web components
- **Vaadin Router**: For page routing
- **LocalStorage**: For data storage
- **Modern JavaScript (ES6+)**: Arrow functions, destructuring, template literals, etc.
- **CSS Custom Properties**: For theme and style management

## Features

- **List Employee Records**: Table and list view, pagination, search
- **Add New Employee Record**: Create new records with form validation
- **Edit Existing Employee Record**: Update existing records
- **Delete Employee Record**: Delete with confirmation dialog
- **Multi-language Support**: Turkish and English language options
- **Responsive Design**: Mobile and desktop compatible interface
- **LocalStorage**: Data storage in browser memory

## Project Structure

```
lit-element-project/
├── src/                  # Source code
│   ├── components/       # Web components
│   │   ├── employee/     # Employee-related components
│   │   │   ├── employee-form.js  # Employee add/edit form
│   │   │   └── employee-list.js  # Employee list
│   │   ├── shared/       # Shared components
│   │   │   └── confirm-dialog.js # Confirmation dialog
│   │   ├── app-root.js   # Main application component
│   │   └── nav-bar.js    # Navigation bar
│   ├── services/         # Services
│   │   └── employee-service.js # Employee data service
│   ├── i18n/             # Language support
│   │   ├── i18n-service.js # Language service
│   │   └── translations.js # Translations
│   ├── utils/            # Helper modules
│   │   └── router.js     # Page routing
│   ├── assets/           # Images and other assets
│   ├── styles/           # Style files
│   ├── index.html        # Main HTML file
│   ├── index.js          # Application entry point
│   └── styles.css        # Global styles
├── public/               # Static files
├── test/                 # Test files
├── package.json          # Project dependencies and commands
├── rollup.config.js      # Rollup configuration
└── web-dev-server.config.js # Development server configuration
```
