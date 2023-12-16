import { useRef, useState } from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";

export default function UploadImage({address}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    function handleCancel() {
        setTitle("");
        setDescription("");
        if (fileInputRef.current) 
            fileInputRef.current.value = "";
    }
    async function handleUpload(event) {
        event.preventDefault();

        if (fileInputRef.current.files.length === 0) {
            alert("Please select a file to upload,");
            return;
        }

        const formData = new FormData();
        formData.append("title", title); 
        formData.append("description", description);
        formData.append("file", fileInputRef.current.files[0]);
        formData.append("address", address);

        try {
            setIsLoading(true);
            const res = await axios.post("http://127.0.0.1:8080/upload", formData, {
                headers: {
                    "Content-Type" : "multipart/form-data"
                }
            });
            if (res.ok) setIsLoading(false);
            console.log(`${Date()} : File uploaded successfully`, res.data);
            navigate("/success");
        }
        catch (err) {
            console.log(`${Date()} : Error uploading file ` , err);
        }
        finally {
            setIsLoading(false);
        }
    }
    return (
    <div className="upload-container">
        <h1>Upload Image to IPFS and Mint NFT</h1>
        <form className="upload-form" onSubmit={handleUpload}>
            <label htmlFor="title">Title *</label>
            <input 
            type="text" 
            id="title" 
            placeholder="Enter image title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            />
            <label htmlFor="description">Description </label>
            <textarea 
                id="description"
                placeholder="Describe your image"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <labe htmlFor="file">Image *</labe>
            <input 
                type="file" 
                name="file"
                ref={fileInputRef}
                required
            />
            <div className="buttons">
                <button 
                    type="button" 
                    className="cancel-button" 
                    onClick={handleCancel}
                >
                    Cancel
                </button>
                <button type="submit" className="upload-button">
                    {isLoading? "Loading...." : "upload"}
                </button>
            </div>
        </form>
    </div>
    );
}