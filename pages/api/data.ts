import type { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  return await read(req, res);
}

const read = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const resp = await axios.get(
      "https://data.gov.il/api/3/action/datastore_search?resource_id=36bf1404-0be4-49d2-82dc-2f1ead4a8b93&limit=200000"
    );

    return res.status(200).json(resp.data);
  } catch (e) {
    return res.status(500).json(e);
  }
};
