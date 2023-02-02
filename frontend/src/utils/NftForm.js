import { useAccount, useNetwork, useContract, useSigner } from "wagmi";
import { useEffect, useState } from "react";
import { uploadFileToIPFS, uploadJSONToIPFS } from "./pinata";
import abi from "../nft_id.json";

const NftForm = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: signer, isError, isLoading } = useSigner();

  let contract = useContract({
    address: "0x7bCBBeDCb251EA36E64DbFD4f21C085b2Bb6C556",
    abi: abi.abi,
    signerOrProvider: signer,
  });

  const [formParams, setFormParams] = useState({
    name: "",
    description: "",
    recipient: "",
  });

  const [fileURL, setFileURL] = useState("");

  //This function uploads the NFT image to IPFS
  async function OnChangeFile(e) {
    var file = e.target.files[0];
    //check for file extension
    try {
      //upload the file to IPFS
      const response = await uploadFileToIPFS(file);
      if (response.success === true) {
        console.log("Upload image to Pinata: ", response.pinataURL);
        setFileURL(response.pinataURL);
      }
    } catch (e) {
      console.log("Error during file upload", e);
    }
  }

  //This function uploads the metadata to IPFS
  async function uploadMetadataToIPFS() {
    const { name, description, recipient } = formParams;
    //Make sure that none of the fields are empty
    if (!name || !description || !recipient || !fileURL) return;
    const nftJSON = {
      name,
      description,
      recipient,
      image: fileURL,
    };

    try {
      //upload the metadata JSON to IPFS
      const response = await uploadJSONToIPFS(nftJSON);
      if (response.success === true) {
        console.log("Upload JSON to Pinata: ", response);
        return response.pinataURL;
      }
    } catch (e) {
      console.log("error uploading JSON metadata:", e);
    }
  }

  async function listNFT(e) {
    e.preventDefault();
    const { recipient } = formParams;

    //Upload data to IPFS
    try {
      const metadataURL = await uploadMetadataToIPFS();

      let transaction = await contract.mintNFT(recipient, metadataURL);
      await transaction.wait();

      console.log("Successfully listed your NFT");
      setFormParams({ name: "", description: "", recipient: "" });
    } catch (e) {
      console.log("Upload error" + e);
    }
  }

  return (
    <div className=" form_body mt-10 ">
      <h2 className="mb-5 text-lg font-bold ">NFT Upload Form</h2>
      <div class="mb-9 ">
        <input
          type="text"
          id="large-input"
          placeholder="Name"
          onChange={(e) => {
            setFormParams({ ...formParams, name: e.target.value });
          }}
          class="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div class="mb-9 ">
        <input
          type="text"
          id="large-input"
          placeholder="Description"
          onChange={(e) => {
            setFormParams({ ...formParams, description: e.target.value });
          }}
          class="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div class="mb-9 ">
        <input
          type="text"
          id="large-input"
          placeholder="Recipient"
          onChange={(e) => {
            setFormParams({ ...formParams, recipient: e.target.value });
          }}
          class="block w-full p-3 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div>
        <input
          class="block w-full p-3 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
          id="file_input"
          type="file"
          onChange={OnChangeFile}
        />
      </div>

      <button
        type="button"
        onClick={listNFT}
        class="text-white mt-5 bg-[#FF9119] hover:bg-[#FF9119]/80 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 font-medium rounded-lg text-sm px-5 py-2.5 text-center inline-flex items-center dark:hover:bg-[#FF9119]/80 dark:focus:ring-[#FF9119]/40 mr-2 mb-2"
      >
        <svg
          class="w-4 h-4 mr-2 -ml-1"
          aria-hidden="true"
          focusable="false"
          data-prefix="fab"
          data-icon="bitcoin"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 512 512"
        >
          <path
            fill="currentColor"
            d="M504 256c0 136.1-111 248-248 248S8 392.1 8 256 119 8 256 8s248 111 248 248zm-141.7-35.33c4.937-32.1-20.19-50.74-54.55-62.57l11.15-44.7-27.21-6.781-10.85 43.52c-7.154-1.783-14.5-3.464-21.8-5.13l10.93-43.81-27.2-6.781-11.15 44.69c-5.922-1.349-11.73-2.682-17.38-4.084l.031-.14-37.53-9.37-7.239 29.06s20.19 4.627 19.76 4.913c11.02 2.751 13.01 10.04 12.68 15.82l-12.7 50.92c.76 .194 1.744 .473 2.829 .907-.907-.225-1.876-.473-2.876-.713l-17.8 71.34c-1.349 3.348-4.767 8.37-12.47 6.464 .271 .395-19.78-4.937-19.78-4.937l-13.51 31.15 35.41 8.827c6.588 1.651 13.05 3.379 19.4 5.006l-11.26 45.21 27.18 6.781 11.15-44.73a1038 1038 0 0 0 21.69 5.627l-11.11 44.52 27.21 6.781 11.26-45.13c46.4 8.781 81.3 5.239 95.99-36.73 11.84-33.79-.589-53.28-25-65.99 17.78-4.098 31.17-15.79 34.75-39.95zm-62.18 87.18c-8.41 33.79-65.31 15.52-83.75 10.94l14.94-59.9c18.45 4.603 77.6 13.72 68.81 48.96zm8.417-87.67c-7.673 30.74-55.03 15.12-70.39 11.29l13.55-54.33c15.36 3.828 64.84 10.97 56.85 43.03z"
          ></path>
        </svg>
        Pay with Bitcoin
      </button>
    </div>
  );
};

export default NftForm;
