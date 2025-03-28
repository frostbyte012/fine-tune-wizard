
# Gemma Studio

A comprehensive UI for fine-tuning Gemma models with dataset management, hyperparameter configuration, and model export capabilities.

## Project info

**URL**: https://lovable.dev/projects/24e9a994-fea6-4dfc-a53d-d65a6adb294f

## Project Structure

```
gemma-studio/
├── public/                      # Static assets
├── src/
│   ├── components/              # React components
│   │   ├── dashboard/           # Dashboard components
│   │   │   └── WelcomeCard.tsx  # Welcome component on dashboard
│   │   ├── dataset/             # Dataset related components
│   │   │   ├── DatasetPreview.tsx  # Preview uploaded datasets
│   │   │   └── DatasetUpload.tsx   # Upload datasets UI
│   │   ├── layout/              # Layout components
│   │   │   ├── Layout.tsx       # Main layout wrapper
│   │   │   └── Navbar.tsx       # Navigation bar
│   │   ├── models/              # Model components
│   │   │   └── ModelExport.tsx  # Export trained models
│   │   ├── training/            # Training components
│   │   │   ├── HyperparameterConfig.tsx  # Configure training parameters
│   │   │   └── TrainingProgress.tsx      # Training progress visualization
│   │   └── ui/                  # shadcn/ui components
│   │       └── ...              # Various UI components (buttons, cards, etc.)
│   ├── hooks/                   # Custom React hooks
│   │   ├── use-mobile.tsx       # Hook for responsive design
│   │   └── use-toast.ts         # Toast notification hook
│   ├── lib/                     # Utility functions
│   │   ├── animations.ts        # Animation utilities
│   │   └── utils.ts             # General utilities
│   ├── pages/                   # Page components
│   │   ├── Dashboard.tsx        # Dashboard page
│   │   ├── Datasets.tsx         # Datasets management page
│   │   ├── Index.tsx            # Landing page
│   │   ├── Models.tsx           # Model export page
│   │   ├── NotFound.tsx         # 404 page
│   │   ├── Settings.tsx         # Settings page
│   │   └── Training.tsx         # Training configuration and monitoring page
│   ├── services/                # Backend service integrations
│   │   ├── datasetService.ts    # Dataset management functionality
│   │   ├── modelService.ts      # Model export functionality
│   │   └── trainingService.ts   # Training functionality
│   ├── App.css                  # App-wide styles
│   ├── App.tsx                  # Main application component with routing
│   ├── index.css                # Global styles
│   ├── main.tsx                 # Application entry point
│   └── vite-env.d.ts            # Vite environment types
├── eslint.config.js             # ESLint configuration
├── tailwind.config.ts           # Tailwind CSS configuration
├── tsconfig.json                # TypeScript configuration
└── vite.config.ts               # Vite configuration
```

## Features

- **Dashboard**: Overview of the application and quick navigation
- **Dataset Management**:
  - Upload various data formats (CSV, JSONL, text files)
  - Data validation and preview
  - Basic preprocessing options
- **Training Configuration**:
  - Hyperparameter adjustment (learning rate, batch size, epochs)
  - Model selection options
  - Training job management
- **Training Monitoring**:
  - Real-time training progress visualization
  - Loss curves and evaluation metrics
  - Training logs
- **Model Export**:
  - Download fine-tuned models in various formats
  - Model versioning and metadata

## Backend Integration

The application includes service layer integrations for:
- Dataset processing and validation
- Training job management and monitoring
- Model export and versioning

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/24e9a994-fea6-4dfc-a53d-d65a6adb294f) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Technology Stack

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- React Router
- React Query

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/24e9a994-fea6-4dfc-a53d-d65a6adb294f) and click on Share -> Publish.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
