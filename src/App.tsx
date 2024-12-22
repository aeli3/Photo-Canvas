import React, { useState } from 'react';
import { useCamera } from './hooks/useCamera';
import { useCanvas } from './hooks/useCanvas';
import { useDrawing } from './hooks/useDrawing';
import ColorPicker from './components/ColorPicker';
import Button from './components/Button';
import { Undo, Save, Eraser, SquareX } from 'lucide-react';

const App: React.FC = () => {
  const { videoRef, isWebcamActive, startWebcam, stopWebcam } = useCamera();
  const { setMode, getDrawingSettings, drawLine, setLineColor } = useDrawing();
  const [canvasImage, setCanvasImage] = useState('')
  const { canvasRef,
    clearCanvas,
    isDrawing,
    setIsDrawing,
    getCanvasPoint,
    lastPoint,
    saveState,
    exportImage,
    undo,
  } = useCanvas();

  const handleCapture = () => {
    if (!videoRef.current || !canvasRef.current) return;
  
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
  
    if (context) {
      // Synchronize canvas dimensions with video for proper capture
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
  
      // Draw the video frame onto the canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
  
      // Extract the image as a data URL
      const imageDataUrl = canvas.toDataURL('image/jpeg');

      // update state and stop webcam
      setCanvasImage(imageDataUrl);
      saveState()
      stopWebcam();
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const point = getCanvasPoint(e, canvas);
    setIsDrawing(true);
    lastPoint.current = point;

    const context = canvas.getContext('2d');
    if (context) {
      getDrawingSettings(context);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint.current) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const currentPoint = getCanvasPoint(e, canvas);
    drawLine(context, lastPoint.current, currentPoint);
    lastPoint.current = currentPoint;
  };

  const handleMouseUp = () => {
    if (isDrawing) {
      setIsDrawing(false);
      lastPoint.current = null;
      saveState();
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-200">
      <h1 className={`absolute mx-auto text-3xl font-bold top-20 font-mono ${!canvasImage ? 'invisible' : ''}`}>Photo Canvas</h1>
      <div className="flex justify-center items-center w-full flex-col-reverse flex-col xl:w-3/5 h-1/2 xl:flex-row md:space-x-8 space-y-2 md:space-y-0">
        <ColorPicker
        className={`${!canvasImage ? 'invisible' : ''}`}
        currentColor='black' 
        onColorChange={setLineColor}
        setMode={setMode}
        />
        {/* VideoCapture */}
        <div 
          className={`w-full h-full transition-opacity duration-300 ${
            !canvasImage ? 'opacity-100 pointer-events-auto' : 'hidden opacity-0 pointer-events-none'
          }`}
        >
          <video 
          ref={videoRef} 
          autoPlay 
          muted 
          className="w-full h-full"
          />
        </div>
        {/* Canvas */}
        <div 
          className={`flex justify-center items-center w-full h-full transition-opacity duration-300 ${
            canvasImage ? 'opacity-100 pointer-events-auto visible' : 'hidden opacity-0 pointer-events-none'
          }`}
        >
          <canvas
            className="hover:cursor-crosshair w-fit h-full object-contain border border-1 border-slate-400"
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseOut={handleMouseUp}
            
          />
        </div>
          {/* CanvasControl */}
          <div className={`flex flex-row xl:flex-col xl:space-y-4 pt-10 sm:pt-0 ${!canvasImage ? 'invisible' : ''}`}>
            <Button
              onClick={() => setMode('erase')}
              className="w-32 py-4 rounded-md bg-blue-400 hover:bg-blue-300"
              icon={Eraser}
              label='Erase'
            >
            </Button>
            <Button
              onClick={undo}
              className="w-32 py-4 px-8 rounded-md bg-blue-400 hover:bg-blue-300"
              icon={Undo}
              label='Undo'
            >
            </Button>
            <Button
              onClick={() => exportImage()}
              className="w-32 py-4 px-8 rounded-md bg-blue-400 hover:bg-blue-300"
              icon={Save}
              label='Save'
            >
            </Button>
            <Button
              onClick={() => { clearCanvas(); setCanvasImage('') }}
              className="w-32 py-4 px-8 rounded-md bg-blue-400 hover:bg-blue-300"
              icon={SquareX}
              label='Clear'
            >
            </Button>
          </div>
          {/* Webcam Control */}
          <div className={`absolute mx-auto bottom-10 ${canvasImage ? 'invisible' : ''}`}>
        {!isWebcamActive ? (
            <button
              onClick={startWebcam}
              className="inline bg-white text-gray-800 border-none rounded-full px-5 py-2.5 text-base cursor-pointer shadow-md"
            >
              Start Webcam
            </button>
          ) : (
            <button
              onClick={handleCapture}
              className="inline bg-white text-gray-800 border-none rounded-full px-5 py-2.5 text-base cursor-pointer shadow-md"
            >
              Capture Image
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;