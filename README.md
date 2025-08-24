# Sentiment Analyzer Frontend

A modern Next.js application for sentiment analysis with authentication, batch uploads, and real-time analysis capabilities.

## 🚀 Features

- **Single Sentiment Analysis** - Analyze individual reviews
- **Batch Upload Analysis** - Upload CSV files for bulk sentiment analysis
- **User Authentication** - Secure login/signup system
- **Modern UI** - Built with shadcn/ui components
- **Responsive Design** - Works on desktop and mobile
- **Environment Variables** - Configurable API endpoints

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Authentication**: JWT-based
- **Package Manager**: pnpm

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/Prudhvi2702/sentiment-analyzer-frontend.git
cd sentiment-analyzer-frontend

# Install dependencies
npm install
# or
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API endpoints

# Run development server
npm run dev
# or
pnpm dev
```

## 🌍 Environment Variables

Create a `.env.local` file with the following variables:

```bash
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://your-api-gateway-url.amazonaws.com/prod
NEXT_PUBLIC_ENVIRONMENT=development
```

## 🚀 Deployment

### AWS Amplify

1. **Connect Repository**: Link your GitHub repository to AWS Amplify
2. **Set Environment Variables**:
   - `NEXT_PUBLIC_API_BASE_URL`: Your API Gateway URL
   - `NEXT_PUBLIC_ENVIRONMENT`: `production`
3. **Build Settings**: Use the provided `amplify.yml` configuration
4. **Deploy**: Amplify will automatically build and deploy your app

### Build Commands

```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Start production server
npm start
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── batch-uploads/     # Batch analysis page
│   ├── login/            # Authentication pages
│   ├── sentiment-analysis/ # Single analysis page
│   └── ...
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── ...
├── lib/                  # Utility functions and API
├── hooks/                # Custom React hooks
└── public/               # Static assets
```

## 🔧 Configuration

### API Endpoints

The application expects the following API endpoints:

- `POST /api/auth/login` - User authentication
- `POST /api/auth/signup` - User registration
- `POST /api/sentiment` - Single sentiment analysis
- `POST /api/batch` - Batch sentiment analysis

### Sentiment Analysis

The application supports three sentiment classifications:
- **Positive** - High confidence positive sentiment
- **Negative** - High confidence negative sentiment  
- **Neutral** - Low confidence or ambiguous sentiment

## 🐛 Troubleshooting

### Common Issues

1. **Build Fails**: Check environment variables are set correctly
2. **API Errors**: Verify API endpoints are accessible
3. **Authentication Issues**: Ensure JWT tokens are properly configured

### Amplify Deployment Issues

If deployment fails after successful build:
1. Check the `amplify.yml` configuration
2. Verify environment variables are set in Amplify console
3. Ensure all dependencies are in `package.json`

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For support, please open an issue in the GitHub repository.
