/**
 * トップページ → customizeページへリダイレクト
 */

import { redirect } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";

export async function loader({ request }: LoaderFunctionArgs) {
  return redirect("/customize?product=box-tshirt-short");
}
