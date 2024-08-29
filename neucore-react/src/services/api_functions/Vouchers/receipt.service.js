import { getHeader } from "@/helpers";
import axios from "axios";

import { get_receipt_listURL } from "@/services/api";
export function get_receipt_list() {
  return axios({
    url: get_receipt_listURL(),
    method: "GET",
    headers: getHeader(),
  });
}
