cat > ~/Documents/Projects/Smoke/setup.sh << 'EOF'
#!/bin/bash

echo "🚀 Setting up Smoking Tracker App..."

# Remove old project if exists
rm -rf SmokingTracker

# Create new Expo project
echo "📱 Creating new Expo project..."
npx create-expo-app SmokingTracker --template blank
cd SmokingTracker

# Install dependencies
echo "📦 Installing dependencies..."
npm install @react-native-async-storage/async-storage expo-haptics expo-linear-gradient react-native-svg react-native-chart-kit react-native-reanimated expo-blur

# Create directory structure
echo "📁 Creating directory structure..."
mkdir -p src/components src/screens src/services src/utils src/theme widgets assets

# Update babel.config.js
echo "⚙️ Configuring Babel..."
cat > babel.config.js << 'BABEL'
module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: ['react-native-reanimated/plugin']
  };
};
BABEL

echo "✅ Setup complete! Now copy your source files and run: npm start"
EOF

# Make it executable
chmod +x ~/Documents/Projects/Smoke/setup.sh

# Run it
cd ~/Documents/Projects/Smoke
./setup.sh