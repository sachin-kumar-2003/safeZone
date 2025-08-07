import React, { useRef, useState } from 'react';
import { toast } from "react-toastify"

export default function CameraAlert() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState('');

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            videoRef.current.srcObject = stream;
            setStreaming(true);
        } catch (err) {
            toast.error('Error accessing camera:', err);
        }
    };

    const closeCamera = () => {
        const video = videoRef.current;
        const stream = video?.srcObject;

        if (stream && stream.getTracks) {
            stream.getTracks().forEach((track) => track.stop());
        }

        video.srcObject = null;

        setStreaming(false);
        toast.info("Camera closed");
    };
    function processImage() {
        toast.success("image is processing");
    }


    return (
        <div className="p-4 w-full mx-auto text-center flex justify-center">

            <div className=''>
                <h2 className="text-xl font-bold mb-2"> Smart Camera Alert</h2>
                {!streaming && (
                    <button
                        onClick={startCamera}
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                        Start Camera
                    </button>
                )}

                <div className="mt-4">
                    <video ref={videoRef} autoPlay width="550" height="300" />
                    <canvas ref={canvasRef} width="300" height="200" style={{ display: 'none' }} />
                </div>

                {streaming && (
                    <div className='flex justify-center gap-2'>
                        <button
                            onClick={processImage}
                            disabled={processing}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
                        >
                            {processing ? 'Processing...' : 'Capture & Check'}
                        </button>
                        <button
                            onClick={closeCamera}
                            disabled={processing}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded"
                        >
                            close camera
                        </button>
                    </div>
                )}
            </div>

            {result && (
                <p className="mt-4 text-lg">
                    <strong>Result:</strong> {result}
                </p>
            )}

            {capturedImage && (
                <img src={capturedImage} alt="Captured" className="mt-4 rounded shadow" />
            )}
        </div>
    );
}