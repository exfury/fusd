import { TxResultRendering } from "@libs/app-fns";
import { StreamDone, StreamInProgress } from "@rx-stream/react";

export type FormParams = Record<string, never>;

export type FormReturn = void;

export type BroadcastTxStreamResult<T = unknown> =
  | StreamInProgress<TxResultRendering<T>>
  | StreamDone<TxResultRendering<T>>;
