import { getCurrentIpaddress, getPortNo } from "@/helpers";

export function get_receipt_listURL() {
  return `http://${getCurrentIpaddress()}:${getPortNo()}/get_receipt_list_by_outlet`;
}
