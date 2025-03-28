
// This file contains the main code for the AttentionMapper Figma plugin
// It handles the plugin logic and communicates with the UI

// Initialize the plugin
figma.showUI(__html__, { width: 320, height: 480 });

// Handle messages from the UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-heatmap') {
    await generateAttentionHeatmap(msg.settings);
  } else if (msg.type === 'customize-settings') {
    // Handle settings customization
    figma.notify('Settings updated');
  } else if (msg.type === 'export-analysis') {
    await exportAnalysis();
  } else if (msg.type === 'about') {
    // Show about information
    figma.notify('AttentionMapper v1.0 - AI-powered attention prediction');
  } else if (msg.type === 'cancel') {
    figma.closePlugin();
  }
};

// Function to generate attention heatmap
async function generateAttentionHeatmap(settings = {}) {
  try {
    // Get the current selection
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.notify('Please select a frame or component to analyze');
      return;
    }

    figma.notify('Analyzing design elements...');
    
    // This would be replaced with actual AI analysis in a production version
    // For now, we're simulating the heatmap generation
    const mainNode = selection[0];
    
    // Create a heatmap overlay frame
    const heatmapFrame = figma.createFrame();
    heatmapFrame.name = "Attention Heatmap";
    heatmapFrame.resize(mainNode.width, mainNode.height);
    heatmapFrame.x = mainNode.x;
    heatmapFrame.y = mainNode.y;
    
    // Add semi-transparent overlay
    const overlay = figma.createRectangle();
    overlay.resize(mainNode.width, mainNode.height);
    overlay.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.2 }];
    heatmapFrame.appendChild(overlay);
    
    // Simulate attention hotspots based on basic heuristics
    await simulateAttentionHotspots(mainNode, heatmapFrame, settings);
    
    // Move the heatmap above the selected node
    figma.currentPage.appendChild(heatmapFrame);
    
    figma.notify('Attention heatmap generated');
    
  } catch (error) {
    figma.notify('Error generating heatmap: ' + error.message);
    console.error(error);
  }
}

// Simulate attention hotspots based on design elements
async function simulateAttentionHotspots(sourceNode, targetFrame, settings) {
  // This is a simplified simulation of attention analysis
  // In a real plugin, this would use actual machine learning models

  // Recursively analyze the node and its children
  await analyzeNode(sourceNode, targetFrame, 1);
  
  function analyzeNode(node, parent, depth) {
    // Skip invisible nodes
    if (node.visible === false) return;
    
    // Different node types get different attention weights
    let attentionWeight = 0;
    
    // Analyze based on node type
    if (node.type === 'TEXT') {
      // Text nodes get attention based on size, weight, and contrast
      const fontSize = node.fontSize || 14;
      attentionWeight = Math.min(fontSize / 14, 3); // Scale by font size
      
      // Add hotspot for significant text
      if (fontSize >= 16 || (node.fontWeight && node.fontWeight >= 600)) {
        createHotspot(node, parent, Math.min(attentionWeight * 1.5, 1));
      }
    } 
    // Images usually draw significant attention
    else if (node.type === 'RECTANGLE' && node.fills && node.fills.some(fill => fill.type === 'IMAGE')) {
      attentionWeight = 0.8;
      createHotspot(node, parent, attentionWeight);
    }
    // Buttons and interactive elements
    else if (
      node.name.toLowerCase().includes('button') || 
      node.name.toLowerCase().includes('btn') ||
      (node.fills && node.fills.some(fill => fill.type === 'SOLID' && fill.color.r + fill.color.g + fill.color.b < 1.5))
    ) {
      attentionWeight = 0.9;
      createHotspot(node, parent, attentionWeight);
    }
    
    // Recursively process children
    if ('children' in node) {
      for (const child of node.children) {
        analyzeNode(child, parent, depth + 1);
      }
    }
  }
  
  // Create a visual hotspot on the heatmap
  function createHotspot(node, parent, intensity) {
    // Create a hotspot ellipse
    const hotspot = figma.createEllipse();
    
    // Set the hotspot size based on the node
    const padding = 20;
    hotspot.resize(node.width + padding * 2, node.height + padding * 2);
    
    // Position the hotspot over the node
    hotspot.x = node.absoluteTransform[0][2] - parent.absoluteTransform[0][2] - padding;
    hotspot.y = node.absoluteTransform[1][2] - parent.absoluteTransform[1][2] - padding;
    
    // Set the fill color based on intensity (red for high, blue for low)
    const r = Math.min(intensity * 2, 1);
    const b = Math.max(1 - intensity * 2, 0);
    hotspot.fills = [{ 
      type: 'SOLID', 
      color: { r, g: 0.1, b }, 
      opacity: Math.min(0.7 * intensity, 0.7) 
    }];
    
    // Add the hotspot to the parent frame
    parent.appendChild(hotspot);
  }
}

// Export the analysis as a report
async function exportAnalysis() {
  figma.notify('Export functionality will be implemented in a future version');
  // In a real plugin, this would generate a report with metrics and insights
}
