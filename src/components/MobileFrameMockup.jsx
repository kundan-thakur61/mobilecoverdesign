import React, { useState, useRef, useCallback } from 'react';

const MobileFrameMockup = ({ selectedModel, onDesignComplete }) => {
  const [userImage, setUserImage] = useState(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  // Keep the preview responsive while preserving the frame's intrinsic aspect ratio.
  const [frameAspect, setFrameAspect] = useState(300 / 600);

  // Screen rectangle is stored as fractions of the frame (0..1) so it scales with responsive preview sizing.
  const [screenRect, setScreenRect] = useState({ left: 0.1, top: 100 / 600, width: 0.8, height: 400 / 600 });

  const calculateScreenRect = (frameWidth = 300, frameHeight = 600) => {
    // These values are approximations - adjust based on actual frame dimensions
    const width = frameWidth * 0.88; // 88% of frame width
    const height = frameHeight * 0.72; // 72% of frame height
    const left = (frameWidth - width) / 2;
    const top = (frameHeight - height) / 2;

    return { left, top, width, height };
  };

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  const getScreenRectPx = useCallback(() => {
    const el = canvasRef.current;
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    return {
      left: rect.width * screenRect.left,
      top: rect.height * screenRect.top,
      width: rect.width * screenRect.width,
      height: rect.height * screenRect.height,
    };
  }, [screenRect]);

  const handleImageUpload = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please upload a valid image file.');
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        alert('Image must be under 8MB.');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setUserImage(e.target.result);
        setTransform({ x: 0, y: 0, scale: 1 });
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handlePointerDown = useCallback((e) => {
    if (!userImage) return;
    const rectPx = getScreenRectPx();
    if (!rectPx) return;

    e.preventDefault();
    setIsDragging(true);
    try {
      e.currentTarget.setPointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }

    setDragStart({
      x: e.clientX - (transform.x * rectPx.width),
      y: e.clientY - (transform.y * rectPx.height),
    });
  }, [userImage, transform, getScreenRectPx]);

  const handlePointerMove = useCallback((e) => {
    if (!isDragging || !userImage) return;
    const rectPx = getScreenRectPx();
    if (!rectPx) return;

    const newX = (e.clientX - dragStart.x) / rectPx.width;
    const newY = (e.clientY - dragStart.y) / rectPx.height;
    setTransform(prev => ({
      ...prev,
      x: clamp(newX, -2, 2),
      y: clamp(newY, -2, 2),
    }));
  }, [isDragging, dragStart, userImage, getScreenRectPx]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const zoomIn = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: Math.min(prev.scale * 1.2, 5) }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform(prev => ({ ...prev, scale: Math.max(prev.scale / 1.2, 0.1) }));
  }, []);

  const resetPosition = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  const exportAsPNG = useCallback(() => {
    if (!selectedModel || !userImage) return;

    // Create a temporary canvas for the mockup
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size based on the selected model's first frame
    const frameImage = new Image();
    frameImage.crossOrigin = 'anonymous';
    frameImage.onload = () => {
      canvas.width = frameImage.width;
      canvas.height = frameImage.height;
      
      // Draw the frame
      ctx.drawImage(frameImage, 0, 0);
      
      // Calculate position for the user image within the screen area
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const rectAbs = {
          left: screenRect.left * canvas.width,
          top: screenRect.top * canvas.height,
          width: screenRect.width * canvas.width,
          height: screenRect.height * canvas.height,
        };

        // Calculate scaled image dimensions to maintain aspect ratio
        const aspectRatio = img.width / img.height;
        let drawWidth = rectAbs.width * transform.scale;
        let drawHeight = drawWidth / aspectRatio;
        
        if (drawHeight > rectAbs.height * transform.scale) {
          drawHeight = rectAbs.height * transform.scale;
          drawWidth = drawHeight * aspectRatio;
        }
        
        // Calculate position to center the image and apply transforms
        const x = rectAbs.left + (rectAbs.width - drawWidth) / 2 + transform.x * rectAbs.width;
        const y = rectAbs.top + (rectAbs.height - drawHeight) / 2 + transform.y * rectAbs.height;
        
        // Draw the user image
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        
        // Download the combined image
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${selectedModel.name.replace(/\s+/g, '_')}_mockup.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      };
      img.src = userImage;
    };
    
    // Use the first frame of the model as the base
    if (selectedModel.images && selectedModel.images.length > 0) {
      frameImage.src = selectedModel.images[0].url;
    } else {
      // Fallback to a generic frame if no specific frames are available
      canvas.width = 300;
      canvas.height = 600;
      
      // Draw a simple frame
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, 300, 600);
      
      // Draw a screen area
      ctx.fillStyle = '#ccc';
      ctx.fillRect(30, 100, 240, 400);
      
      // Draw the user image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const rectAbs = {
          left: screenRect.left * canvas.width,
          top: screenRect.top * canvas.height,
          width: screenRect.width * canvas.width,
          height: screenRect.height * canvas.height,
        };

        // Calculate scaled image dimensions to maintain aspect ratio
        const aspectRatio = img.width / img.height;
        let drawWidth = rectAbs.width * transform.scale;
        let drawHeight = drawWidth / aspectRatio;
        
        if (drawHeight > rectAbs.height * transform.scale) {
          drawHeight = rectAbs.height * transform.scale;
          drawWidth = drawHeight * aspectRatio;
        }
        
        // Calculate position to center the image and apply transforms
        const x = rectAbs.left + (rectAbs.width - drawWidth) / 2 + transform.x * rectAbs.width;
        const y = rectAbs.top + (rectAbs.height - drawHeight) / 2 + transform.y * rectAbs.height;
        
        // Draw the user image
        ctx.drawImage(img, x, y, drawWidth, drawHeight);
        
        // Download the combined image
        canvas.toBlob((blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${selectedModel.name.replace(/\s+/g, '_')}_mockup.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        });
      };
      img.src = userImage;
      return;
    }
  }, [selectedModel, userImage, transform, screenRect]);

  const handleSaveDesign = useCallback(() => {
    if (!userImage || !selectedModel) {
      alert('Please upload an image and select a model first');
      return;
    }

    // Prepare the design data
    const designData = {
      model: selectedModel,
      image: userImage,
      transform,
      timestamp: new Date().toISOString()
    };

    // Call the callback to handle the completed design
    onDesignComplete && onDesignComplete(designData);
  }, [userImage, selectedModel, transform, onDesignComplete]);

  if (!selectedModel) {
    return <div className="text-center p-8">Please select a phone model first</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Customize Your {selectedModel.company?.name} {selectedModel.name} Cover
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Canvas Preview */}
        <div className="flex justify-center">
          <div
            ref={canvasRef}
            className="relative w-full max-w-[320px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[480px] bg-gray-100 border-2 border-gray-300 select-none touch-none cursor-grab active:cursor-grabbing"
            style={{ aspectRatio: `${frameAspect}`, maxHeight: '70vh' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
            onPointerLeave={handlePointerUp}
          >
            {/* Phone Frame Overlay - use the first frame from the model */}
            {selectedModel.images && selectedModel.images.length > 0 ? (
              <img
                src={selectedModel.images[0].url}
                alt={`${selectedModel.name} frame`}
                className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                style={{ zIndex: 1 }}
                onLoad={(e) => {
                  const img = e.target;
                  if (img?.naturalWidth && img?.naturalHeight) {
                    setFrameAspect(img.naturalWidth / img.naturalHeight);
                    const newScreenRectAbs = calculateScreenRect(img.naturalWidth, img.naturalHeight);
                    setScreenRect({
                      left: newScreenRectAbs.left / img.naturalWidth,
                      top: newScreenRectAbs.top / img.naturalHeight,
                      width: newScreenRectAbs.width / img.naturalWidth,
                      height: newScreenRectAbs.height / img.naturalHeight,
                    });
                  }
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-[32px]">
                <div className="text-center">
                  <div className="mx-auto bg-gray-300 rounded-[24px] w-64 aspect-[9/19] flex items-center justify-center">
                    <span className="text-gray-500">Frame not available</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600">Contact admin to add frames for this model</p>
                </div>
              </div>
            )}

            {/* User Image positioned within the screen area */}
            {userImage && selectedModel.images && selectedModel.images.length > 0 && (
              <div 
                className="absolute pointer-events-none"
                style={{
                  left: `${screenRect.left * 100}%`,
                  top: `${screenRect.top * 100}%`,
                  width: `${screenRect.width * 100}%`,
                  height: `${screenRect.height * 100}%`,
                  overflow: 'hidden',
                  zIndex: 2
                }}
              >
                <img
                  src={userImage}
                  alt="User design"
                  className="absolute"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) scale(${transform.scale}) translate(${transform.x * 100}%, ${transform.y * 100}%)`,
                    transformOrigin: 'center center',
                    maxWidth: 'none',
                    maxHeight: 'none',
                    pointerEvents: 'none',
                  }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <div className="border-2 border-dashed border-gray-300 p-6 text-center cursor-pointer hover:border-gray-400 transition-colors rounded-lg">
                <div className="text-4xl mb-2">📷</div>
                <p className="text-gray-600">
                  {userImage ? 'Replace Image' : 'Click to upload your image'}
                </p>
                <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 8MB</p>
              </div>
            </label>
          </div>

          {/* Transform Controls */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Adjust Image</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
              <button
                onClick={zoomIn}
                className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 min-h-[44px]"
              >
                Zoom In
              </button>
              <button
                onClick={zoomOut}
                className="p-3 bg-blue-500 text-white rounded hover:bg-blue-600 min-h-[44px]"
              >
                Zoom Out
              </button>
              <button
                onClick={resetPosition}
                className="p-3 bg-gray-500 text-white rounded hover:bg-gray-600 min-h-[44px]"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Actions */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Actions</h3>
            <div className="space-y-2">
              <button
                onClick={exportAsPNG}
                disabled={!userImage}
                className={`w-full p-3 rounded ${
                  userImage 
                    ? 'bg-green-500 text-white hover:bg-green-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } min-h-[44px]`}
              >
                Download Mockup
              </button>
              <button
                onClick={handleSaveDesign}
                disabled={!userImage}
                className={`w-full p-3 rounded ${
                  userImage 
                    ? 'bg-purple-500 text-white hover:bg-purple-600' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                } min-h-[44px]`}
              >
                Save Design
              </button>
            </div>
          </div>

          {/* Model Info */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">Selected Model:</h4>
            <p className="text-sm text-gray-700">
              <span className="font-medium">{selectedModel.company?.name || 'Unknown'}</span> - {selectedModel.name}
            </p>
            {selectedModel.images && selectedModel.images.length > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                Available frames: {selectedModel.images.length}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFrameMockup;