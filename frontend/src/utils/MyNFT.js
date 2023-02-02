import { useState } from "react";
import { useAccount, useNetwork, useContract, useSigner } from "wagmi";
import abi from "../nft_id.json";
import truncateEthAddress from "truncate-eth-address";

export const MyNFT = () => {
  const { address, isConnected } = useAccount();
  const { chain } = useNetwork();
  const { data: signer } = useSigner();

  let contract = useContract({
    address: "0x7bCBBeDCb251EA36E64DbFD4f21C085b2Bb6C556",
    abi: abi.abi,
    signerOrProvider: signer,
  });

  const [data, setData] = useState();
  const [dataFetched, setDataFetched] = useState(false);

  async function burnNFT(tokenId) {
    try {

      let transaction = await contract.burn(tokenId);
      await transaction.wait();

    } catch (e) {
      console.log("Upload error" + e);
    }
  }

  async function getMyNFTs() {
    let transaction = await contract.getMyNFTs();
    console.log(transaction);

    //Fetch all the details of myNFT from the contract and display
    const items = await Promise.all(
      transaction.map(async (i) => {
        const tokenURI = await contract.tokenURI(i.tokenId);
        console.log(tokenURI);
        let meta = await fetch(tokenURI);
        const json = await meta.json();
        console.log(json);
        // .then((response) => response.json())
        // .then((data) => console.log(data));
        // let meta = await axios.get(tokenURI);
        meta = json;

        let item = {
          tokenId: i.tokenId.toNumber(),
          Company_owner: i.Company_owner,
          candidate: i.candidate,
          image: meta.image,
          name: meta.name,
          description: meta.description,
        };
        return item;
      })
    );

    setDataFetched(true);
    setData(items);
  }

  if (!dataFetched) getMyNFTs();
  console.log(data);

  if (data) {
    return (
      <section class="py-10 bg-gray-100 mt-10">
        <div className="p-5 text-lg border-zinc-900">
          <h2 className="title_bar font-bold">NFT ID WALLET </h2>
        </div>
        <div class="mx-auto grid max-w-6xl  grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((value, index) => {
            return (
              <article class="rounded-xl bg-white p-3 shadow-lg hover:shadow-xl hover:transform hover:scale-105 duration-300 ">
                <a href="#">
                  <div class="relative flex items-end overflow-hidden rounded-xl">
                    <img src={value.image} alt="Hotel Photo" />
                    <div class="flex items-center space-x-1.5 rounded-lg bg-blue-500 px-4 py-1.5 text-white duration-100 hover:bg-blue-600">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="h-4 w-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                        />
                      </svg>

                      <button onClick={() => burnNFT()} class="text-sm">
                        Burn ID
                      </button>
                    </div>
                  </div>

                  <div class="mt-1 p-2">
                    <h2 class="text-slate-700">
                      <b>Title :</b> {value.name}
                    </h2>
                    <p class="mt-1 text-sm text-slate-500">
                      <b>Description : </b>
                      {value.description}
                    </p>
                    <p className=" text-sm text-slate-500">
                      <b>Issuer : </b>${truncateEthAddress(value.Company_owner)}
                    </p>
                    <button
                      onClick={() => burnNFT(value.tokenId)}
                      class="text-sm"
                    >
                      Burn ID
                    </button>
                  </div>
                </a>
              </article>
            );
          })}
          
        </div>
      </section>
    );
  }
};
