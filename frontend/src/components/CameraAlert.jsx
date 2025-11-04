import React, { useRef, useState } from 'react';
import { toast } from "react-toastify"
import api from '../service/api';
import axios from 'axios';

export default function CameraAlert() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [streaming, setStreaming] = useState(false);
    const [capturedImage, setCapturedImage] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [result, setResult] = useState('');
    const [coordinates, setCoordinates] = useState([77.2090, 28.6139]);


    React.useEffect(() => {
        let interval;
        // set the current location cordinate
        navigator.geolocation.getCurrentPosition((position) => {
            setCoordinates([position.coords.longitude, position.coords.latitude]);
        });

        if (streaming) {
            interval = setInterval(() => {
                processImage();
            }, 2000);
        } else {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [streaming]);


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
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
            if (blob) {
                const imageUrl = URL.createObjectURL(blob);
                setCapturedImage(imageUrl)

                const formData = new FormData();

                formData.append("file", blob, "frame.jpg");

                try {
                    const res = await fetch("http://127.0.0.1:8000/detect",
                        {
                            method: "post",
                            body: formData
                        }
                    )
                    if (!res.ok) {
                        toast.error("something is wrong while fetching api");
                        throw new Error("something is wrong while fetching APi..");
                    }

                    const detectionRes = await res.json();
                    console.log("AI Response:", detectionRes.detections);
                    console.log("length of arrayy", detectionRes.detections.length);
                    if (detectionRes.detections.length > 0) {

                        const alertType = detectionRes.detections[0].class;
                        const description = `detected ${detectionRes.detections[0].class} via camera`;
                        console.log(alertType);
                        console.log(description);
                        navigator.geolocation.getCurrentPosition((position) => {
                            setCoordinates([position.coords.longitude, position.coords.latitude]);
                        });

                        try {
                            await api.post('/alert/create', {
                                alertType: alertType,
                                description: description,
                                cordinates: coordinates
                            });
                            toast.success('Danger alert created!');
                            // window.location.href = "/";
                        } catch (error) {
                            console.log(error)
                            toast.error("Failed to create alert");
                        }
                    } else {
                        // toast.info("No danger detected");
                    }
                } catch (error) {
                    return {
                        message: "something is wrong"
                    }
                }

            }
        })
        // toast.success("image is processing");
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