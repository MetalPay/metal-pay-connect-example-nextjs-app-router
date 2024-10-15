"use client";

import { MetalPayConnect } from "metal-pay-connect-js";
import { useEffect, useRef, useState } from "react";

interface Credentials {
  apiKey: string;
  signature: string;
  nonce: string;
}

export default function MetalPayConnectComponent() {
  const [credentials, setCredentials] = useState<Credentials>({
    apiKey: "",
    signature: "",
    nonce: "",
  });
  const metalPayConnectEl = useRef();
  useEffect(() => {
    if (credentials.apiKey && credentials.signature && credentials.nonce) {
      const metalPayConnect = new MetalPayConnect({
        el: metalPayConnectEl.current,
        environment: "dev",
        params: {
          apiKey: credentials.apiKey,
          signature: credentials.signature,
          nonce: credentials.nonce,
          address: { "xpr-network": "johndoe" }, // address for the user
          networks: ["xpr-network"], // List of networks to enable
        },
      });

      return () => {
        metalPayConnect.destroy();
      };
    }
  }, [credentials]);

  async function fetchCredentials() {
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
      });
      const data = await res.json();
      setCredentials(data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    fetchCredentials();
  }, []);
  return (
    <div
      id="metal-pay-connect"
      className="flex w-full items-center justify-center"
    ></div>
  );
}
