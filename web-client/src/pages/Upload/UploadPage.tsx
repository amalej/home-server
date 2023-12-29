import { useState } from "react";
import { expressEndpoint } from "../../config";
import { Link } from "react-router-dom";
import css from "../../common/common.module.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import TopNav from "../../components/TopNav/TopNav";

function UploadPage() {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string>("");

  function getUploadEndpoint() {
    return `${expressEndpoint}/api/v1/upload`;
  }

  function handleInputChange(event: React.ChangeEvent<HTMLInputElement>) {
    const _fileToUpload = event.target.files as FileList;
    setFileToUpload(_fileToUpload[0]);
    setUploadMessage("");
  }

  async function uploadFile() {
    const endpoint = getUploadEndpoint();
    const formData = new FormData();
    if (fileToUpload !== null) {
      formData.append("file", fileToUpload);
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      if (res.status === 200) {
        setFileToUpload(null);
        setUploadMessage("File uploaded");
      } else {
        setUploadMessage("Error uploading file");
      }
    } else {
      setUploadMessage("No file to upload");
    }
  }

  return (
    <div>
      <TopNav />
      <br />
      <div>
        <input
          type="file"
          id="fileSelector"
          required
          onChange={handleInputChange}
          className={`${css["input-file"]}`}
        />
        <label htmlFor="fileSelector" className={`${css["input-file-label"]}`}>
          {fileToUpload !== null
            ? fileToUpload.name
            : "Choose file to upload..."}
        </label>
        <button
          type="submit"
          onClick={uploadFile}
          className={`${css["upload-file-button"]}`}
        >
          <FileUploadIcon></FileUploadIcon>
        </button>
      </div>
      <div className={`${css["upload-file-message"]}`}>{uploadMessage}</div>
    </div>
  );
}

export default UploadPage;
