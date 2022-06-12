import { useState } from 'react';
import axios from 'axios';

import useInterval from './useInterval';

export default function useGasPrice(targetNetwork: { gasPrice?: number }, speed: string = 'fast') {
  const [gasPrice, setGasPrice] = useState<number>();
  const loadGasPrice = async () => {
    if (targetNetwork.gasPrice) {
      setGasPrice(targetNetwork.gasPrice);
    } else {
      axios
        .get('https://ethgasstation.info/json/ethgasAPI.json')
        .then((response) => {
          const newGasPrice = response.data[speed] * 100000000;
          if (newGasPrice !== gasPrice) {
            setGasPrice(newGasPrice);
          }
        })
        .catch((error) => console.log(error));
    }
  };

  useInterval(loadGasPrice, 39999);
  return gasPrice;
}
