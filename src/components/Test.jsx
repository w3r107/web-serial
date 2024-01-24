import React, { useEffect } from "react";
import { read, utils } from "xlsx";

const Test = () => {
  useEffect(() => {}, [
    fetch(
      "https://firebasestorage.googleapis.com/v0/b/dev-unuh-gcp.appspot.com/o/web-serial.xlsx?alt=media&token=ba809cb2-b8f0-4612-bbe8-6df9855495b1"
    )
      .then((res) => {
        return res.arrayBuffer();
      })
      .then((res) => {
        const readData = read(new Uint8Array(res), { type: "array" });
        const sheetName = readData.SheetNames[0];
        const sheet = readData.Sheets[sheetName];

        const jsonData = utils.sheet_to_json(sheet);
        console.log(jsonData);
      })
      .catch((e) => console.log(e)),
  ]);
  return <div></div>;
};

export default Test;
