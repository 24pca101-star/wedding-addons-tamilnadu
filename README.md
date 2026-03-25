# Wedding Add-ons Studio

**Wedding Add-ons Studio** is a premium, interactive design platform tailored for creating personalized wedding stationary and ceremony decor. It empowers users to customize templates with professional-grade tools and visualize them in realistic environments.

## Core Features

- **🚀 Interactive Canvas Editor**: A high-performance editor based on Fabric.js allowing for seamless text manipulation, image uploads, and layer management.
- **🎨 Advanced Drawing Suite**: Professional pen tools with customizable colors and thickness, including a true transparency-based eraser for precise editing.
- **📁 PSD Template Engine**: Native support for loading complex Adobe Photoshop (.psd) files, preserving layer structures and transparency.
- **🖥️ 3D Real-time Mockups**: Visualize your designs instantly on 3D models of products like traditional umbrellas, sign boards, and apparel.
- **📸 High-Quality Exports**: Export your completed designs as print-ready PNG or PDF files with high resolution.

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```powershell
   ./start_system.ps1
   ```
   *Note: This script initializes both the frontend and the necessary backend services.*

Open [http://localhost:3000](http://localhost:3000) with your browser to start designing.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), React 19, Tailwind CSS
- **Canvas Engine**: Fabric.js 7.x
- **PSD Parsing**: ag-psd
- **Icons**: Lucide React
- **3D Visualization**: Custom WebGL/Three.js integration

---
*Created for premium wedding experiences.*
