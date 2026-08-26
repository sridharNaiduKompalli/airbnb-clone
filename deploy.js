import { execSync } from 'child_process';
import readline from 'readline';
import fs from 'fs';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve));

console.clear();
console.log("==================================================");
console.log("🚀 Airbnb Clone - DevOps Cloud Deployment Helper   ");
console.log("==================================================");
console.log("This script will guide you through setting up your");
console.log("free cloud database (Neon) and deploying the app");
console.log("using GitOps (Continuous Deployment via Render).");
console.log("==================================================\n");

async function main() {
  // Step 1: Check Git
  console.log("🔍 Checking Git status...");
  try {
    execSync('git --version', { stdio: 'ignore' });
    console.log("✅ Git is installed.");
  } catch (error) {
    console.error("❌ Git is not installed or not in your PATH. Please install Git first.");
    rl.close();
    return;
  }

  // Step 2: Initialize Git Repo if not already done
  if (!fs.existsSync('.git')) {
    console.log("📦 Git repository not found. Initializing Git...");
    try {
      execSync('git init', { stdio: 'inherit' });
      execSync('git add .', { stdio: 'inherit' });
      execSync('git commit -m "initial commit: full-stack airbnb clone devops project"', { stdio: 'inherit' });
      console.log("✅ Git repository initialized and initial commit created!");
    } catch (error) {
      console.error("❌ Failed to initialize Git repository.", error);
    }
  } else {
    console.log("✅ Git repository already initialized.");
  }

  console.log("\n--------------------------------------------------");
  console.log("🌐 STEP 1: Create a Free PostgreSQL Database (Neon)");
  console.log("--------------------------------------------------");
  console.log("1. Go to Neon DB: https://neon.tech/");
  console.log("2. Sign up for a FREE account (no credit card required).");
  console.log("3. Create a project and database named 'airbnb'.");
  console.log("4. Copy the connection string (starting with 'postgres://...')");
  
  const dbUrl = await askQuestion("\nEnter your Neon Database URL (or press Enter to skip for now): ");
  if (dbUrl && dbUrl.trim().startsWith('postgres://')) {
    // Write connection string to backend .env for testing
    fs.writeFileSync('backend/.env', `DATABASE_URL="${dbUrl.trim()}"\nNODE_ENV="development"\nPORT=5000\n`);
    console.log("✅ Saved Neon Database URL to backend/.env");
  } else {
    console.log("⚠️ Skipped saving Database URL (will fallback to mock database).");
  }

  console.log("\n--------------------------------------------------");
  console.log("💻 STEP 2: Create a GitHub Repository (GitOps CD)");
  console.log("--------------------------------------------------");
  console.log("In DevOps, we deploy using Continuous Deployment (CD).");
  console.log("To do this, we need to push your local folder to GitHub:");
  console.log("1. Go to https://github.com/new and create a repository (e.g. 'airbnb-clone-devops').");
  console.log("2. Run the following commands in your terminal to link and push your code:");
  console.log("   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git");
  console.log("   git branch -M main");
  console.log("   git push -u origin main");

  console.log("\n--------------------------------------------------");
  console.log("🚀 STEP 3: Deploy Backend Container to Render (Free Web Service)");
  console.log("--------------------------------------------------");
  console.log("Render will build and run your backend Docker image for free:");
  console.log("1. Go to Render: https://render.com/");
  console.log("2. Click 'New +' and select 'Web Service'.");
  console.log("3. Connect your GitHub repository.");
  console.log("4. Set the following parameters:");
  console.log("   - Name: airbnb-backend");
  console.log("   - Root Directory: backend");
  console.log("   - Runtime: Docker");
  console.log("   - Plan: Free");
  console.log("5. Click 'Advanced' and add the following Environment Variables:");
  console.log(`   - DATABASE_URL: ${dbUrl ? dbUrl.trim() : "(Your Neon Database URL)"}`);
  console.log("   - PORT: 5000");
  console.log("   - NODE_ENV: production");
  console.log("6. Click 'Create Web Service'. Render will trigger a build from your Dockerfile!");

  console.log("\n--------------------------------------------------");
  console.log("🖥️ STEP 4: Deploy Frontend Container to Render (Free Static Site)");
  console.log("--------------------------------------------------");
  console.log("Once the backend is building, deploy the frontend React app:");
  console.log("1. In Render Dashboard, click 'New +' and select 'Static Site'.");
  console.log("2. Connect your GitHub repository.");
  console.log("3. Set the following parameters:");
  console.log("   - Name: airbnb-frontend");
  console.log("   - Root Directory: frontend");
  console.log("   - Build Command: npm run build");
  console.log("   - Publish Directory: dist");
  console.log("   - Plan: Free");
  console.log("4. Under Environment Variables, add:");
  console.log("   - VITE_API_URL: (The URL of your deployed Backend Web Service, e.g. https://airbnb-backend.onrender.com)");
  console.log("5. Click 'Create Static Site'. Render will compile your Vite project and serve it.");

  console.log("\n==================================================");
  console.log("🎉 GitOps Deployment Pipeline Configured!");
  console.log("Every time you run 'git push', Render will automatically");
  console.log("rebuild and redeploy your live website!");
  console.log("==================================================");

  rl.close();
}

main();
