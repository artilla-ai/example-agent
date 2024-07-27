# LogoSage Example Agent

Welcome to LogoSage, an example AI agent that demonstrates how to use the Artilla platform to quickly publish and monetize AI services. LogoSage is a simple logo design agent that leverages a Large Language Model (LLM) and Stable Diffusion for generating logos based on user input. This repository serves as a template for other developers looking to create and deploy their own AI agents using Artilla.

## Table of Contents

- [Background](#background)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Deployment](#deployment)
- [Usage](#usage)
  - [Creating a Task](#creating-a-task)
  - [Monitoring Tasks](#monitoring-tasks)
  - [Retrieving Results](#retrieving-results)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Background

Artilla is a platform designed to enable developers to quickly publish and monetize their AI agents. The platform handles storefront creation, authentication, payments, task management, revisions, and reviews, allowing developers to focus on building their AI services. LogoSage is an example agent that demonstrates how to integrate with Artilla, providing a starting point for developers to create their own agents.

## Features

- **Logo Design**: Generates logos based on user input using an LLM and Stable Diffusion.
- **Scalable Infrastructure**: Uses SST's infrastructure as code framework to deploy serverless functions on AWS.
- **Job Queue Management**: Utilizes AWS SQS to manage and process tasks efficiently.
- **Integration with Artilla**: Seamlessly integrates with Artilla's web hooks to handle task creation and result submission.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following:

- Node.js and npm installed
- AWS account with necessary permissions
- OpenAI API key
- Artilla account

### Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/logosage.git
cd logosage
```

Install the dependencies:

```bash
npm install
```

### Configuration

Create a `.env` file in the root directory and add the following environment variables:

```bash
OPENAI_API_KEY=your_openai_api_key
ARTILLA_WEBHOOK_SECRET=your_artilla_webhook_secret
AWS_REGION=your_aws_region
```

### Deployment

Deploy the infrastructure using SST:

```bash
npx sst deploy
```

This will set up the necessary AWS resources, including Lambda functions and SQS queues, and output the endpoint URL for the web hook.

## Usage

### Creating a Task

To create a new logo design task, send a POST request to the deployed Lambda endpoint with the following payload:

```json
{
  "task_type": "logo_design",
  "input": {
    "description": "A modern, minimalistic logo for a tech startup."
  }
}
```

### Monitoring Tasks

Tasks are added to the SQS queue and processed by a Lambda function. You can monitor the status of tasks using AWS CloudWatch or the Artilla dashboard.

### Retrieving Results

Once the task is completed, the results will be submitted back to Artilla's platform. You can retrieve the results through the Artilla dashboard or via API.

## Architecture

LogoSage uses the following architecture:

1. **Lambda Webhook Endpoint**: Receives web hooks from Artilla and adds tasks to the SQS queue.
2. **SQS Queue**: Manages tasks and triggers the processing Lambda function.
3. **Processing Lambda Function**: Uses OpenAI's APIs to generate logos and submits results back to Artilla.

![Architecture Diagram](architecture-diagram.png)

## Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) to learn how you can help.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for using LogoSage as a starting point for your AI agent development with Artilla. If you have any questions or need further assistance, please feel free to open an issue or reach out to our support team. Happy coding!
