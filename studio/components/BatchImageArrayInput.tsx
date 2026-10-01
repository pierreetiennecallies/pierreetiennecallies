import { useRef, useState, type ChangeEvent } from "react";
import {
  insert,
  setIfMissing,
  useClient,
  type ArrayOfObjectsInputProps,
} from "sanity";
import { Button, Flex, Stack, Text } from "@sanity/ui";
import { UploadIcon } from "@sanity/icons/Upload";
import { apiVersion } from "../env";

const BATCH_SIZE = 5;

type Progress = { done: number; total: number } | null;

function uniqueKey() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 12);
}

function chunk<T>(items: T[], size: number) {
  const batches: T[][] = [];
  for (let index = 0; index < items.length; index += size) {
    batches.push(items.slice(index, index + size));
  }
  return batches;
}

export function BatchImageArrayInput(props: ArrayOfObjectsInputProps) {
  const { onChange, readOnly } = props;
  const client = useClient({ apiVersion });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<Progress>(null);
  const [error, setError] = useState<string | null>(null);

  const uploadFiles = async (files: File[]) => {
    setError(null);
    setProgress({ done: 0, total: files.length });
    onChange(setIfMissing([]));

    try {
      let done = 0;
      for (const batch of chunk(files, BATCH_SIZE)) {
        const assets = await Promise.all(
          batch.map((file) =>
            client.assets.upload("image", file, { filename: file.name }),
          ),
        );
        const items = assets.map((asset) => ({
          _type: "image",
          _key: uniqueKey(),
          asset: { _type: "reference", _ref: asset._id },
        }));
        onChange(insert(items, "after", [-1]));
        done += batch.length;
        setProgress({ done, total: files.length });
      }
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed",
      );
    } finally {
      setProgress(null);
    }
  };

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length > 0) uploadFiles(files);
  };

  const isUploading = progress !== null;

  return (
    <Stack gap={3}>
      {props.renderDefault(props)}
      <Flex align="center" gap={3}>
        <Button
          icon={UploadIcon}
          mode="ghost"
          text={
            isUploading
              ? `Uploading ${progress.done} / ${progress.total}…`
              : "Upload multiple images"
          }
          disabled={readOnly || isUploading}
          onClick={() => fileInputRef.current?.click()}
        />
        {error ? (
          <Text size={1} muted>
            {error}
          </Text>
        ) : null}
      </Flex>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={handleFiles}
      />
    </Stack>
  );
}
